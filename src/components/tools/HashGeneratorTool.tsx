"use client";

import { useState, useCallback } from "react";

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm placeholder-ink-faint focus:border-indigo-500/50 focus:bg-ink/10 outline-none transition-all font-mono";
const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";

const algorithms = [
  { id: "md5", label: "MD5", length: 32 },
  { id: "sha-1", label: "SHA-1", length: 40 },
  { id: "sha-256", label: "SHA-256", length: 64 },
  { id: "sha-512", label: "SHA-512", length: 128 },
] as const;

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const computeHash = useCallback(async (algo: string, data: string | ArrayBuffer) => {
    const encoder = new TextEncoder();
    const buffer = typeof data === "string" ? encoder.encode(data) : data;
    const hashBuffer = await crypto.subtle.digest(algo, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }, []);

  const processText = async () => {
    if (!input.trim()) return;
    setError(null);
    try {
      const results: Record<string, string> = {};
      for (const { id } of algorithms) {
        results[id] = await computeHash(id.toUpperCase().replace("-", "-"), input);
      }
      setHashes(results);
    } catch {
      setError("Failed to compute hash");
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const results: Record<string, string> = {};
      for (const { id } of algorithms) {
        results[id] = await computeHash(id.toUpperCase().replace("-", "-"), buffer);
      }
      setHashes(results);
      setFileInput(file);
    } catch {
      setError("Failed to compute file hash");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Text Input</label>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash…"
            rows={3}
            className={`${inputClass} flex-1 resize-y`}
            spellCheck={false}
          />
          <button onClick={processText} disabled={!input.trim()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 transition-all duration-200 h-fit self-end">
            Hash
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <label className={labelClass}>Or Hash a File</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="text-sm text-ink-soft"
            id="hash-file"
          />
          <label htmlFor="hash-file" className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card hover:bg-ink/5 text-ink-soft hover:text-ink font-semibold px-4 py-2.5 transition-colors cursor-pointer">
            Choose File
          </label>
          {fileInput && (
            <span className="text-sm text-ink-soft font-mono">{fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)</span>
          )}
        </div>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          <label className={labelClass}>Results</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {algorithms.map((algo) => (
              <div key={algo.id} className="rounded-xl border border-border bg-bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-ink">{algo.label}</span>
                  <button
                    onClick={() => copyHash(hashes[algo.id])}
                    className="text-ink-faint hover:text-accent transition-colors"
                    aria-label={`Copy ${algo.label}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 00-1.5.124m0 0a33.584 33.584 0 001.5-.124m0 0v3.375c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 001.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H6.75a9.06 9.06 0 011.5-.124m0 0a33.584 33.584 0 01-1.5.124" />
                    </svg>
                  </button>
                </div>
                <code className="text-xs font-mono text-ink-soft break-all bg-ink/5 px-2 py-1.5 rounded block">{hashes[algo.id]}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}