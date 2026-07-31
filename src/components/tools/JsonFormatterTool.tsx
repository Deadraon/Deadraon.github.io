"use client";

import { useState } from "react";

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm placeholder-ink-faint focus:border-blue-500/50 focus:bg-ink/10 outline-none transition-all font-mono";
const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";
const buttonClass = "inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 transition-all duration-200";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const process = () => {
    try {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex gap-2" role="radiogroup">
          <button
            onClick={() => setMode("format")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "format"
                ? "bg-blue-600 text-white"
                : "text-ink-soft hover:text-ink hover:bg-ink/5"
            }`}
          >
            Format
          </button>
          <button
            onClick={() => setMode("minify")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "minify"
                ? "bg-blue-600 text-white"
                : "text-ink-soft hover:text-ink hover:bg-ink/5"
            }`}
          >
            Minify
          </button>
        </div>
        <button onClick={process} className={buttonClass} disabled={!input.trim()}>
          Process
        </button>
        {output && (
          <button onClick={copyOutput} className="ml-auto rounded-xl border border-border bg-bg-card hover:bg-ink/5 text-ink-soft hover:text-ink font-semibold px-4 py-2.5 transition-colors">
            Copy
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here… e.g. {"key": "value"}'
            rows={16}
            className={`${inputClass} resize-y leading-relaxed`}
            spellCheck={false}
          />
        </div>

        <div>
          <label className={labelClass}>Output</label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={16}
              className={`${inputClass} resize-y leading-relaxed ${error ? "border-red-500/30" : ""}`}
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-2 right-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}