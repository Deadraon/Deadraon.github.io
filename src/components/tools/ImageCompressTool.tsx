"use client";

import { useState } from "react";

interface Result {
  name: string;
  url: string;
  originalSize: number;
  newSize: number;
}

export function ImageCompressTool() {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [maxKB, setMaxKB] = useState(500);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function onPick(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setBusy(true);
    setError(null);
    setResults([]);
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const next: Result[] = [];
      for (const f of files) {
        const out = await imageCompression(f, {
          maxSizeMB: maxKB / 1024,
          maxWidthOrHeight: 2400,
          useWebWorker: true,
        });
        next.push({
          name: f.name,
          url: URL.createObjectURL(out),
          originalSize: f.size,
          newSize: out.size,
        });
      }
      setResults(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Quality slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            Target size per image
          </label>
          <span className="font-[family-name:var(--font-mono)] text-sm text-ink font-semibold bg-ink/5 border border-border px-2.5 py-0.5 rounded-md">
            ~{maxKB} KB
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={maxKB}
          onChange={(e) => setMaxKB(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-ink-faint">
          <span>50 KB (heavy)</span>
          <span>2000 KB (light)</span>
        </div>
      </div>

      {/* Drop zone */}
      <label
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-violet-500/60 bg-violet-500/10"
            : "border-border bg-ink/5 hover:border-violet-500/40 hover:bg-violet-500/5"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onPick(e.dataTransfer.files); }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
          disabled={busy}
        />
        {busy ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-sm text-ink-soft">Compressing images…</span>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Drop images here or click to pick</p>
              <p className="text-xs text-ink-faint mt-1">JPEG, PNG, WebP, AVIF supported</p>
            </div>
          </>
        )}
      </label>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 text-sm text-rose-400 border border-rose-500/20 bg-rose-500/10 rounded-xl p-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-3">
            {results.length} image{results.length !== 1 ? "s" : ""} compressed
          </div>
          <ul className="space-y-2">
            {results.map((r) => {
              const pct = Math.round((1 - r.newSize / r.originalSize) * 100);
              return (
                <li
                  key={r.name}
                  className="flex items-center gap-4 rounded-xl border border-border bg-bg-card px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate font-medium">{r.name}</div>
                    <div className="font-[family-name:var(--font-mono)] text-xs text-ink-soft mt-0.5">
                      {(r.originalSize / 1024).toFixed(0)} KB → {(r.newSize / 1024).toFixed(0)} KB
                      <span className="ml-2 text-emerald-400 font-semibold">−{pct}%</span>
                    </div>
                  </div>
                  <a
                    href={r.url}
                    download={r.name}
                    className="text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 transition-colors shrink-0"
                  >
                    Download
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
