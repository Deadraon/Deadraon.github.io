"use client";

import { useState, useRef } from "react";

const LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish (Español)" },
  { code: "fra", name: "French (Français)" },
  { code: "deu", name: "German (Deutsch)" },
  { code: "chi_sim", name: "Chinese Simplified (中文)" },
  { code: "jpn", name: "Japanese (日本語)" },
];

export function ImageOcrTool() {
  const [busy, setBusy] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processImage(file: File) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResultText(null);
    setStatus("Initializing…");
    setProgress(0);
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    try {
      const Tesseract = await import("tesseract.js");
      const response = await Tesseract.recognize(file, language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setStatus("Extracting text…");
            setProgress(Math.round(m.progress * 100));
          } else {
            setStatus(m.status.replace(/_/g, " "));
            setProgress(0);
          }
        },
      });
      setResultText(response.data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR text extraction failed.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  async function copyToClipboard() {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* no-op */ }
  }

  function downloadText() {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-all";

  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="space-y-2">
        <label htmlFor="language-select" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
          Language
        </label>
        <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={busy} className={inputClass}>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]); }}
        onClick={() => !busy && fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging ? "border-cyan-500/60 bg-cyan-500/10" : busy ? "opacity-60 cursor-not-allowed border-border" : "border-border bg-ink/5 hover:border-cyan-500/40 hover:bg-cyan-500/5"
        }`}
      >
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processImage(e.target.files[0]); }} disabled={busy} />
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{busy ? "Processing image…" : "Drop image or click to upload"}</p>
          <p className="text-xs text-ink-faint mt-1">PNG, JPEG, WebP, BMP — all processed locally</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 text-sm text-rose-400 border border-rose-500/20 bg-rose-500/10 rounded-xl p-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {/* Progress */}
      {busy && (
        <div className="p-4 border border-border rounded-xl bg-bg-card space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-[family-name:var(--font-mono)] text-ink-soft capitalize">{status || "Loading OCR engine…"}</span>
            {progress > 0 && <span className="font-mono font-bold text-cyan-400">{progress}%</span>}
          </div>
          <div className="w-full bg-ink/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Results side-by-side */}
      {(imageSrc || resultText !== null) && (
        <div className="grid md:grid-cols-2 gap-4">
          {imageSrc && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider block">Source image</span>
              <div className="rounded-xl border border-border bg-bg-card p-3 flex items-center justify-center min-h-[200px]">
                <img src={imageSrc} alt="Source" className="max-w-full max-h-[350px] object-contain rounded-lg" />
              </div>
            </div>
          )}
          {resultText !== null && (
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Extracted text</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-ink/5 text-ink-soft hover:text-ink hover:border-border-hover transition-all"
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={downloadText}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-ink/5 text-ink-soft hover:text-ink hover:border-border-hover transition-all"
                  >
                    .txt
                  </button>
                </div>
              </div>
              <textarea
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                className="flex-1 w-full min-h-[250px] rounded-xl border border-border bg-ink/5 text-ink p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed focus:border-indigo-500/50 outline-none resize-y"
                placeholder="No text recognized from this image."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
