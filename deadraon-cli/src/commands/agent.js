import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import pc from 'picocolors';
import * as p from '@clack/prompts';

// Load keys from config file
let keys = getKeys();

function getKeys() {
  const possiblePaths = [
    path.join('C:', 'Users', 'chauh', '.fcc', '.env'),
    path.join(process.env.USERPROFILE || '', '.fcc', '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
  ];

  const env = {};
  for (const pth of possiblePaths) {
    if (fs.existsSync(pth)) {
      try {
        const content = fs.readFileSync(pth, 'utf8');
        content.split('\n').forEach(line => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            let val = match[2] || '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            env[match[1]] = val.trim();
          }
        });
      } catch (e) {
        // ignore
      }
    }
  }
  return env;
}

let currentModel = keys.MODEL || 'google/gemini-2.5-flash';

const SYSTEM_PROMPT = `You are "deadraon", a powerful agentic AI coding assistant designed to help developers build and manage their projects.
You run inside a terminal, similar to Claude Code CLI.
You have the ability to run command lines, read files, and write/overwrite files in the user's workspace.

CRITICAL INSTRUCTIONS FOR TOOL USE:
When you need to execute an action, wrap it in one of these exact XML-like tags.
You can ONLY run one tool call at a time.
Once you output a tool call tag, STOP GENERATING immediately (do not write any text after it, do not write a closing explanation, just output the closing tag and stop).

Available Tools:
1. Run Command:
   <run_command>your_terminal_command_here</run_command>
   Example: <run_command>npm run build</run_command>

2. Read File:
   <read_file>path/to/file_here</read_file>
   Example: <read_file>src/models/User.ts</read_file>

3. Write File:
   <write_file path="path/to/file_here">
   file content goes here
   </write_file>
   Example:
   <write_file path="src/models/Product.ts">
   import mongoose from "mongoose";
   ...
   </write_file>

IMPORTANT: All file paths must be relative to the current working directory.
Wait for the user's tool results before suggesting the next step. If a tool fails, analyze the error and try to fix it.`;

// Full-screen TUI state
let tuiState = {
  screen: 'home', // 'home' or 'chat'
  input: '',
  messages: [],
  status: 'ready', // 'ready', 'thinking', 'waiting_approval'
  model: currentModel
};

function center(text, width) {
  const textLenWithoutAnsi = text.replace(/\x1B\[\d+m/g, '').length;
  const pad = Math.max(0, Math.floor((width - textLenWithoutAnsi) / 2));
  return ' '.repeat(pad) + text;
}

function centerBoxLine(text, width) {
  const textLenWithoutAnsi = text.replace(/\x1B\[\d+m/g, '').length;
  const totalPad = width - textLenWithoutAnsi;
  if (totalPad <= 0) return text;
  const leftPad = Math.floor(totalPad / 2);
  const rightPad = totalPad - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

function wrapLine(text, width) {
  const lines = [];
  let currentLine = '';
  const words = text.split(' ');
  for (const word of words) {
    if ((currentLine + word).length >= width) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function wrapText(text, width) {
  const lines = [];
  const paras = text.split('\n');
  for (const para of paras) {
    if (!para) {
      lines.push('');
      continue;
    }
    const wrapped = wrapLine(para, width);
    lines.push(...wrapped);
  }
  return lines;
}

const banner = [
  "██████╗ ███████╗ █████╗ ██████╗ ██████╗  █████╗  ██████╗ ███╗   ██╗",
  "██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗████╗  ██║",
  "██║  ██║█████╗  ███████║██║  ██║██████╔╝███████║██║   ██║██╔██╗ ██║",
  "██║  ██║██╔══╝  ██╔══██║██║  ██║██╔══██╗██╔══██║██║   ██║██║╚██╗██║",
  "██████╔╝███████╗██║  ██║██████╔╝██║  ██║██║  ██║╚██████╔╝██║ ╚████║",
  "╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
];

// Principal Drawing Function
export function render() {
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;

  if (tuiState.screen === 'chat') {
    renderChat();
    return;
  }

  // Clear screen cross-platform
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  let buffer = '';

  // Render Top Empty Space
  buffer += '\n'.repeat(Math.max(1, Math.floor((rows - 20) / 2)));

  // Render Center ASCII Banner
  for (const line of banner) {
    buffer += pc.cyan(center(line, cols)) + '\n';
  }
  buffer += '\n';

  // Centered Command prompt card
  const boxWidth = 70;
  const leftPad = Math.max(0, Math.floor((cols - boxWidth) / 2));
  const padStr = ' '.repeat(leftPad);

  buffer += padStr + pc.gray('┌' + '─'.repeat(boxWidth - 2) + '┐') + '\n';
  buffer += padStr + pc.gray('│') + centerBoxLine(pc.dim('Ask anything... "What is the tech stack of this project?"'), boxWidth - 2) + pc.gray('│') + '\n';
  buffer += padStr + pc.gray('│') + ' '.repeat(boxWidth - 2) + '│' + '\n';
  
  // Format user input typing line
  const inputPrompt = `${pc.bold(pc.green('> '))} ${tuiState.input ? pc.white(tuiState.input) : pc.gray('Type your prompt here...')}`;
  buffer += padStr + pc.gray('│') + centerBoxLine(inputPrompt, boxWidth - 2) + pc.gray('│') + '\n';
  
  buffer += padStr + pc.gray('│') + ' '.repeat(boxWidth - 2) + '│' + '\n';
  buffer += padStr + pc.gray('│') + centerBoxLine(pc.dim(`Build · `) + pc.cyan(tuiState.model), boxWidth - 2) + pc.gray('│') + '\n';
  buffer += padStr + pc.gray('└' + '─'.repeat(boxWidth - 2) + '┘') + '\n';
  
  buffer += '\n\n';

  // Key shortcuts
  buffer += pc.dim(center('tab agents    ctrl+p settings    ctrl+c exit', cols)) + '\n';
  buffer += '\n';
  
  // Tips
  buffer += center(`${pc.yellow('• Tip')} Run ${pc.cyan('/config')} to edit keys or model preferences directly.`, cols) + '\n';

  // Relative Footer at absolute bottom
  const writtenLines = buffer.split('\n').length;
  const paddingNeeded = rows - writtenLines - 2;
  if (paddingNeeded > 0) {
    buffer += '\n'.repeat(paddingNeeded);
  }

  const footerLeft = `  ~/${path.basename(process.cwd())}`;
  const footerRight = `1.17.9  `;
  const spaceLength = cols - footerLeft.length - footerRight.length;
  const footerLine = pc.dim(footerLeft + ' '.repeat(Math.max(0, spaceLength)) + footerRight);
  buffer += footerLine;

  process.stdout.write(buffer);
}

function renderChat() {
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;

  // Clear screen cross-platform
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  let buffer = '';

  // Chat Header Banner - ASCII Banner representation
  for (const line of banner) {
    buffer += pc.cyan(center(line, cols)) + '\n';
  }
  buffer += '\n';

  const contentHeight = rows - 10; // Recalculate space: ASCII banner takes 7 lines, plus 3 lines for borders/prompt
  let chatLines = [];

  for (const msg of tuiState.messages) {
    if (msg.role === 'system') continue;

    if (msg.role === 'user') {
      const wrapped = wrapText(msg.content, cols - 10);
      chatLines.push(`${pc.green('You >')} ${wrapped[0]}`);
      for (let i = 1; i < wrapped.length; i++) {
        chatLines.push(`      ${wrapped[i]}`);
      }
      chatLines.push('');
    } else if (msg.role === 'assistant') {
      chatLines.push(pc.cyan(`┌  deadraon`));
      const wrapped = wrapText(msg.content, cols - 6);
      for (const line of wrapped) {
        chatLines.push(`${pc.cyan('│')}  ${line}`);
      }
      chatLines.push(pc.cyan(`└`));
      chatLines.push('');
    } else if (msg.role === 'tool') {
      const wrapped = wrapText(msg.content, cols - 16);
      chatLines.push(`${pc.yellow('⚙ Tool Output >')} ${wrapped[0]}`);
      for (let i = 1; i < wrapped.length; i++) {
        chatLines.push(`                ${wrapped[i]}`);
      }
      chatLines.push('');
    }
  }

  const sliced = chatLines.slice(-contentHeight);
  for (const line of sliced) {
    buffer += line + '\n';
  }

  if (sliced.length < contentHeight) {
    buffer += '\n'.repeat(contentHeight - sliced.length);
  }

  // Footer / Input line
  buffer += pc.cyan('─'.repeat(cols) + '\n');
  if (tuiState.status === 'thinking') {
    buffer += `${pc.bold(pc.yellow('⚙ thinking...'))} ${pc.gray('deadraon is rendering response')}`;
  } else if (tuiState.status === 'waiting_approval') {
    buffer += `${pc.bold(pc.yellow('⌛ Waiting for authorization...'))}`;
  } else {
    buffer += `${pc.bold(pc.green('deadraon > '))} ${tuiState.input}`;
  }

  process.stdout.write(buffer);
}

// Tool Helpers
function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || '',
        stderr: stderr || '',
        code: error ? error.code : 0
      });
    });
  });
}

async function askApproval(promptText) {
  console.log();
  const approved = await p.confirm({
    message: promptText,
    active: 'Yes, authorize',
    inactive: 'No, deny'
  });

  if (p.isCancel(approved)) return false;
  return approved;
}

async function runConfigWizard() {
  console.log();
  p.note('Let\'s configure your developer API key and endpoint.', 'Settings Wizard');

  const apiKeyInput = await p.password({
    message: 'Enter API Key (OpenRouter or AgentRouter):',
    validate: (val) => !val ? 'API Key cannot be empty' : undefined
  });

  if (p.isCancel(apiKeyInput)) return false;

  const baseUrlInput = await p.text({
    message: 'Enter API Base URL:',
    initialValue: keys.AGENT_ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    validate: (val) => !val ? 'Base URL cannot be empty' : undefined
  });

  if (p.isCancel(baseUrlInput)) return false;

  const modelInput = await p.text({
    message: 'Enter LLM Model Name:',
    initialValue: currentModel,
    validate: (val) => !val ? 'Model name cannot be empty' : undefined
  });

  if (p.isCancel(modelInput)) return false;

  const envPath = path.join(process.cwd(), '.env.local');
  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
  }

  const lines = content.split('\n');
  const newLines = [];
  const updatedKeys = new Set();

  lines.forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      if (key === 'OPENROUTER_API_KEY') {
        newLines.push(`OPENROUTER_API_KEY=${apiKeyInput}`);
        updatedKeys.add('OPENROUTER_API_KEY');
      } else if (key === 'AGENT_ROUTER_BASE_URL') {
        newLines.push(`AGENT_ROUTER_BASE_URL=${baseUrlInput}`);
        updatedKeys.add('AGENT_ROUTER_BASE_URL');
      } else if (key === 'MODEL') {
        newLines.push(`MODEL=${modelInput}`);
        updatedKeys.add('MODEL');
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  });

  if (!updatedKeys.has('OPENROUTER_API_KEY')) newLines.push(`OPENROUTER_API_KEY=${apiKeyInput}`);
  if (!updatedKeys.has('AGENT_ROUTER_BASE_URL')) newLines.push(`AGENT_ROUTER_BASE_URL=${baseUrlInput}`);
  if (!updatedKeys.has('MODEL')) newLines.push(`MODEL=${modelInput}`);

  try {
    fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
    keys = getKeys();
    keys.OPENROUTER_API_KEY = apiKeyInput;
    keys.AGENT_ROUTER_BASE_URL = baseUrlInput;
    keys.MODEL = modelInput;
    currentModel = modelInput;
    tuiState.model = modelInput;
    p.log.success('Configuration saved successfully to .env.local!');
    return true;
  } catch (err) {
    p.log.error(`Failed to save configuration: ${err.message}`);
    return false;
  }
}

async function executeTool(toolCall) {
  // Suspend raw mode so that Clack confirm prompt gets clean stdin
  process.stdin.setRawMode(false);
  console.log();

  let toolOutput = '';

  if (toolCall.type === 'run_command') {
    const cmd = toolCall.value.trim();
    p.log.warn(`deadraon requests to run terminal command:`);
    console.log(pc.bgBlack(pc.white(`  $ ${cmd}  `)));

    const approved = await askApproval('Allow command execution?');
    if (approved) {
      const s = p.spinner();
      s.start(`Executing: ${cmd}`);
      const result = await runCommand(cmd);
      s.stop(`Finished with code ${result.code}`);

      if (result.stdout) toolOutput += `[STDOUT]\n${result.stdout}\n`;
      if (result.stderr) toolOutput += `[STDERR]\n${result.stderr}\n`;
      if (!toolOutput) toolOutput = '[SUCCESS] Command completed with no output.';
    } else {
      p.log.error('Command execution declined.');
      toolOutput = 'Command execution was declined by the user.';
    }
  } else if (toolCall.type === 'read_file') {
    const filePath = path.resolve(process.cwd(), toolCall.value.trim());
    p.log.warn(`deadraon requests to read file:`);
    console.log(pc.cyan(`  ${filePath}`));

    const approved = await askApproval('Allow file read?');
    if (approved) {
      if (fs.existsSync(filePath)) {
        try {
          toolOutput = fs.readFileSync(filePath, 'utf8');
          p.log.success(`Successfully read file.`);
        } catch (err) {
          toolOutput = `Error reading file: ${err.message}`;
        }
      } else {
        toolOutput = `File does not exist at ${filePath}`;
      }
    } else {
      p.log.error('File read declined.');
      toolOutput = 'File read was declined by the user.';
    }
  } else if (toolCall.type === 'write_file') {
    const relativePath = toolCall.path.trim();
    const filePath = path.resolve(process.cwd(), relativePath);
    const content = toolCall.value;
    p.log.warn(`deadraon requests to write to file:`);
    console.log(pc.cyan(`  ${filePath}`));

    const approved = await askApproval('Allow file write?');
    if (approved) {
      try {
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
        fs.writeFileSync(filePath, content, 'utf8');
        p.log.success(`File written successfully.`);
        toolOutput = `File written successfully to ${relativePath}`;
      } catch (err) {
        toolOutput = `Error writing file: ${err.message}`;
      }
    } else {
      p.log.error('File write declined.');
      toolOutput = 'File write was declined by the user.';
    }
  }

  // Restore raw mode and re-draw TUI
  process.stdin.setRawMode(true);
  render();
  return toolOutput;
}

// Call LLM Stream Core
async function callLLMStream(messages, onToken, onToolCall) {
  let url = 'https://openrouter.ai/api/v1/chat/completions';
  keys = getKeys();
  let apiKey = keys.OPENROUTER_API_KEY;

  if (keys.AGENT_ROUTER_API_KEY && keys.AGENT_ROUTER_BASE_URL) {
    url = `${keys.AGENT_ROUTER_BASE_URL}/chat/completions`;
    apiKey = keys.AGENT_ROUTER_API_KEY;
  } else if (keys.AGENT_ROUTER_BASE_URL && keys.OPENROUTER_API_KEY) {
    url = `${keys.AGENT_ROUTER_BASE_URL}/chat/completions`;
  }

  if (!apiKey) {
    throw new Error('401 - API key not configured.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: currentModel,
      messages: messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error (${response.status}): ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  let fullResponse = '';
  let printedIndex = 0;
  let isInsideTag = false;
  let currentTagType = '';
  let tagValueBuffer = '';
  let writeFilePath = '';
  let detectedToolCall = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const dataStr = trimmed.slice(6).trim();
      if (dataStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(dataStr);
        const token = parsed.choices?.[0]?.delta?.content || '';
        if (token) {
          fullResponse += token;
          
          while (true) {
            let unprinted = fullResponse.slice(printedIndex);
            if (!unprinted) break;

            if (!isInsideTag) {
              const openBraceIndex = unprinted.indexOf('<');
              if (openBraceIndex === -1) {
                onToken(unprinted);
                printedIndex = fullResponse.length;
                break;
              } else {
                if (openBraceIndex > 0) {
                  onToken(unprinted.slice(0, openBraceIndex));
                  printedIndex += openBraceIndex;
                  unprinted = unprinted.slice(openBraceIndex);
                }

                if (unprinted.startsWith('<run_command>')) {
                  isInsideTag = true;
                  currentTagType = 'run_command';
                  tagValueBuffer = '';
                  printedIndex += '<run_command>'.length;
                } else if (unprinted.startsWith('<read_file>')) {
                  isInsideTag = true;
                  currentTagType = 'read_file';
                  tagValueBuffer = '';
                  printedIndex += '<read_file>'.length;
                } else if (unprinted.startsWith('<write_file path=')) {
                  const closeTagIndex = unprinted.indexOf('>');
                  if (closeTagIndex === -1) break;
                  
                  const tagOpenStr = unprinted.slice(0, closeTagIndex + 1);
                  const pathMatch = tagOpenStr.match(/path=["']([^"']+)["']/);
                  if (pathMatch) {
                    writeFilePath = pathMatch[1];
                    isInsideTag = true;
                    currentTagType = 'write_file';
                    tagValueBuffer = '';
                    printedIndex += tagOpenStr.length;
                  } else {
                    onToken('<');
                    printedIndex += 1;
                  }
                } else {
                  if (unprinted.length > 20) {
                    onToken('<');
                    printedIndex += 1;
                  } else {
                    break;
                  }
                }
              }
            } else {
              const closeTagName = `</${currentTagType}>`;
              const closeTagIndex = unprinted.indexOf(closeTagName);
              if (closeTagIndex === -1) {
                tagValueBuffer += unprinted;
                printedIndex = fullResponse.length;
                break;
              } else {
                tagValueBuffer += unprinted.slice(0, closeTagIndex);
                printedIndex += closeTagIndex + closeTagName.length;
                isInsideTag = false;

                detectedToolCall = {
                  type: currentTagType,
                  value: tagValueBuffer,
                  path: writeFilePath
                };
                currentTagType = '';
                tagValueBuffer = '';
                writeFilePath = '';
                
                reader.cancel();
                break;
              }
            }
          }
        }
      } catch (err) {
        // ignore partial JSON errors
      }
    }
    if (detectedToolCall) break;
  }

  if (!detectedToolCall && printedIndex < fullResponse.length) {
    onToken(fullResponse.slice(printedIndex));
  }

  return {
    text: fullResponse,
    toolCall: detectedToolCall
  };
}

async function startChatSession(userPrompt) {
  tuiState.screen = 'chat';
  tuiState.messages.push({ role: 'user', content: userPrompt });
  tuiState.status = 'thinking';
  render();

  let continueAgentLoop = true;
  while (continueAgentLoop) {
    try {
      tuiState.messages.push({ role: 'assistant', content: '' });
      tuiState.status = 'thinking';
      render();

      const result = await callLLMStream(
        tuiState.messages.slice(0, -1),
        (token) => {
          tuiState.messages[tuiState.messages.length - 1].content += token;
          render();
        },
        executeTool
      );

      tuiState.messages[tuiState.messages.length - 1].content = result.text;

      if (result.toolCall) {
        tuiState.status = 'waiting_approval';
        render();

        const toolResult = await executeTool(result.toolCall);
        tuiState.messages.push({
          role: 'tool',
          content: toolResult
        });
      } else {
        continueAgentLoop = false;
      }
    } catch (err) {
      tuiState.messages.push({ role: 'assistant', content: `Error during LLM call: ${err.message}` });
      render();

      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('invalid token')) {
        process.stdin.setRawMode(false);
        const reconfig = await p.confirm({
          message: 'Your API key seems invalid or expired. Configure now?',
          active: 'Yes, config now',
          inactive: 'No, cancel'
        });
        if (reconfig && !p.isCancel(reconfig)) {
          const success = await runConfigWizard();
          process.stdin.setRawMode(true);
          render();
          if (success) continue;
        } else {
          process.stdin.setRawMode(true);
          render();
        }
      }
      continueAgentLoop = false;
    }
  }

  tuiState.status = 'ready';
  render();
}

/**
 * Main Interactive TUI Shell Starter
 */
export async function startAgentChat() {
  tuiState.screen = 'home';
  tuiState.input = '';
  tuiState.messages = [
    { role: 'assistant', content: 'Hello! I am deadraon, your AI coding assistant. How can I help you today?' }
  ];
  tuiState.status = 'ready';

  // Enable keypress events on stdin
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  // Draw home screen initially
  render();

  const handleKeypress = async (str, key) => {
    // Escape check to exit
    if (key.ctrl && key.name === 'c') {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('keypress', handleKeypress);
      console.log('\nGoodbye!');
      process.exit(0);
    }

    // Config settings key trigger
    if (key.ctrl && key.name === 'p') {
      process.stdin.setRawMode(false);
      await runConfigWizard();
      process.stdin.setRawMode(true);
      render();
      return;
    }

    if (tuiState.status !== 'ready') return;

    if (key.name === 'backspace') {
      tuiState.input = tuiState.input.slice(0, -1);
      render();
    } else if (key.name === 'return') {
      const promptText = tuiState.input.trim();
      if (promptText) {
        tuiState.input = '';
        
        // Handle in-tui slash commands
        if (promptText.startsWith('/')) {
          const args = promptText.split(' ');
          const cmd = args[0].toLowerCase();
          
          if (cmd === '/config' || cmd === '/settings') {
            process.stdin.setRawMode(false);
            await runConfigWizard();
            process.stdin.setRawMode(true);
            render();
            return;
          }
          if (cmd === '/clear') {
            tuiState.messages = [];
            tuiState.screen = 'home';
            render();
            return;
          }
          if (cmd === '/help') {
            p.note('Slash Commands: /config (edit keys), /clear (clear chat), /help (this menu)');
            render();
            return;
          }
        }

        await startChatSession(promptText);
      }
    } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
      tuiState.input += str;
      render();
    }
  };

  process.stdin.on('keypress', handleKeypress);

  // Resize listener
  const handleResize = () => {
    render();
  };
  process.stdout.on('resize', handleResize);
}
