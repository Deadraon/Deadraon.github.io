"use client";

import { useState } from "react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function LoremIpsumTool() {
  const [type, setType] = useState<"paragraphs" | "words" | "bytes">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      for (let i = 0; i < count; i++) {
        let p = "";
        const sentenceCount = Math.floor(Math.random() * 4) + 3;
        for (let j = 0; j < sentenceCount; j++) {
          const wordCount = Math.floor(Math.random() * 10) + 8;
          let s = "";
          for (let k = 0; k < wordCount; k++) {
            s += LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] + " ";
          }
          p += s.trim().charAt(0).toUpperCase() + s.trim().slice(1) + ". ";
        }
        result += p.trim() + "\n\n";
      }
    } else if (type === "words") {
      for (let i = 0; i < count; i++) {
        result += LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] + " ";
      }
      result = result.trim().charAt(0).toUpperCase() + result.trim().slice(1) + ".";
    } else {
      // bytes
      result = "Lorem ipsum dolor sit amet...".repeat(Math.ceil(count / 26)).slice(0, count);
    }
    setOutput(result.trim());
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="monochrome-label block mb-2">Gen_Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-bg-panel border border-border p-3 text-sm font-mono focus:border-accent outline-none"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="words">Words</option>
            <option value="bytes">Bytes</option>
          </select>
        </div>
        <div>
          <label className="monochrome-label block mb-2">Amount</label>
          <input 
            type="number" 
            min="1" 
            max="2000"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full bg-bg-panel border border-border p-3 text-sm font-mono focus:border-accent outline-none"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={generate}
            className="btn-primary w-full"
          >
            GENERATE_TEXT
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="monochrome-label block mb-2">Output_Buffer</label>
        <textarea 
          readOnly
          value={output}
          placeholder="[AWAITING_INPUT]"
          className="w-full workbench-panel min-h-[300px] p-6 font-mono text-sm text-ink-soft bg-black/40 focus:text-ink outline-none"
        />
        {output && (
          <button 
            onClick={() => navigator.clipboard.writeText(output)}
            className="text-[10px] font-display font-bold text-ink-soft hover:text-accent flex items-center gap-2 uppercase transition-colors"
          >
            Copy_Buffer
          </button>
        )}
      </div>
    </div>
  );
}
