"use client";

import { useState } from "react";

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm placeholder-ink-faint focus:border-indigo-500/50 focus:bg-ink/10 outline-none transition-all";
const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";
const buttonClass = "inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 transition-all duration-200";

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    try {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
      setError(null);
    } catch {
      setError("Invalid input for selected operation");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
  };

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex gap-2" role="radiogroup">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-indigo-600 text-white"
                : "text-ink-soft hover:text-ink hover:bg-ink/5"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-indigo-600 text-white"
                : "text-ink-soft hover:text-ink hover:bg-ink/5"
            }`}
          >
            Decode
          </button>
        </div>
        <button onClick={process} className={buttonClass} disabled={!input.trim()}>
          Convert
        </button>
        <button onClick={swap} className="rounded-xl border border-border bg-bg-card hover:bg-ink/5 text-ink-soft hover:text-ink font-semibold px-4 py-2.5 transition-colors" disabled={!output}>
          Swap
        </button>
        {output && (
          <button onClick={copyOutput} className="ml-auto rounded-xl border border-border bg-bg-card hover:bg-ink/5 text-ink-soft hover:text-ink font-semibold px-4 py-2.5 transition-colors">
            Copy
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{mode === "encode" ? "Text to Encode" : "Base64"}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode…" : "Enter Base64 to decode…"}
            rows={12}
            className={`${inputClass} resize-y leading-relaxed`}
            spellCheck={false}
          />
        </div>

        <div>
          <label className={labelClass}>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={12}
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