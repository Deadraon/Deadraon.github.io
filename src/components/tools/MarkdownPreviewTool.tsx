"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownPreviewTool() {
  const [text, setText] = useState("# Markdown Preview\n\nEdit this text to see the **live** result.\n\n- GFM Supported\n- Fast & Local\n\n```js\nconsole.log('Hello World');\n```");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border border-border">
      <div className="flex flex-col">
        <div className="bg-black/40 border-b border-border px-4 py-2 monochrome-label">Input_Markdown</div>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[500px] p-6 font-mono text-sm bg-bg-panel text-ink-soft focus:text-ink outline-none resize-none"
        />
      </div>
      <div className="flex flex-col border-l border-border">
        <div className="bg-black/40 border-b border-border px-4 py-2 monochrome-label">Output_Render</div>
        <div className="w-full h-[500px] p-8 overflow-y-auto bg-bg-surface prose prose-invert prose-cyan max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
