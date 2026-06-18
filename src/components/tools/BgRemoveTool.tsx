"use client";

import { useState, useRef } from "react";

export function BgRemoveTool() {
  const [busy, setBusy] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processImage(file: File) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResultSrc(null);
    setResultBlob(null);
    setStatus("Initializing AI model...");
    setProgress(0);
    const origUrl = URL.createObjectURL(file);
    setOriginalSrc(origUrl);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const outBlob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          setStatus(key.replace(/_/g, " "));
          setProgress(Math.round((current / total) * 100));
        },
      });
      const outUrl = URL.createObjectURL(outBlob);
      setResultSrc(outUrl);
      setResultBlob(outBlob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Background removal failed. Check that your browser supports WebAssembly.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  function saveImage() {
    if (!resultSrc || !resultBlob) return;
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = "bg_removed.png";
    a.click();
  }

  return (
    <div className="space-y-6">
      <style>{`
        .bg-checker {
          background-size: 16px 16px;
          background-image:
            linear-gradient(45deg, var(--checker-color, rgba(255,255,255,0.06)) 25%, transparent 25%, transparent 75%, var(--checker-color, rgba(255,255,255,0.06)) 75%),
            linear-gradient(45deg, var(--checker-color, rgba(255,255,255,0.06)) 25%, transparent 25%, transparent 75%, var(--checker-color, rgba(255,255,255,0.06)) 75%);
          background-position: 0 0, 8px 8px;
        }
      `}</style>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]); }}
        onClick={() => !busy && fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging ? "border-violet-500/60 bg-violet-500/10" : busy ? "opacity-60 cursor-not-allowed border-border" : "border-border bg-ink/5 hover:border-violet-500/40 hover:bg-violet-500/5"
        }`}
      >
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processImage(e.target.files[0]); }} disabled={busy} />
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{busy ? "Removing background…" : "Drop photo or click to upload"}</p>
          <p className="text-xs text-ink-faint mt-1">Best for portraits, animals, products · JPEG, PNG, WebP</p>
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
            <span className="font-[family-name:var(--font-mono)] text-ink-soft capitalize">{status || "Loading AI model…"}</span>
            <span className="font-mono font-bold text-violet-400">{progress}%</span>
          </div>
          <div className="w-full bg-ink/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-violet-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-ink-faint">First run downloads the AI model (~70 MB) into browser cache. Subsequent runs are instant.</p>
        </div>
      )}

      {/* Side-by-side result */}
      {(originalSrc || resultSrc) && (
        <div className="grid md:grid-cols-2 gap-4">
          {originalSrc && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider block">Original</span>
              <div className="rounded-xl border border-border bg-bg-card p-3 flex items-center justify-center min-h-[220px]">
                <img src={originalSrc} alt="Original" className="max-w-full max-h-[350px] object-contain rounded-lg" />
              </div>
            </div>
          )}
          {resultSrc && (
            <div className="space-y-2 flex flex-col">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider block">Result</span>
              <div className="bg-checker rounded-xl border border-border p-3 flex items-center justify-center min-h-[220px] flex-1">
                <img src={resultSrc} alt="Background removed" className="max-w-full max-h-[350px] object-contain rounded-lg drop-shadow-lg" />
              </div>
              <button
                onClick={saveImage}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Save transparent PNG
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
