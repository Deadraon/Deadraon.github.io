"use client";

import { useState } from "react";

interface QueuedFile {
  id: string;
  file: File;
}

export function PdfMergeTool() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function add(list: FileList | null) {
    if (!list) return;
    const pdfs = Array.from(list).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((file) => ({ id: `${file.name}-${file.size}-${Math.random()}`, file })),
    ]);
  }

  function move(id: string, dir: -1 | 1) {
    setFiles((prev) => {
      const i = prev.findIndex((f) => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const merged = await out.save();
      const blob = new Blob([merged as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't merge — one of the files may be encrypted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <label
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-rose-500/60 bg-rose-500/10"
            : "border-border bg-ink/5 hover:border-rose-500/40 hover:bg-rose-500/5"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); add(e.dataTransfer.files); }}
      >
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => add(e.target.files)}
        />
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Drop PDF files or click to pick</p>
          <p className="text-xs text-ink-faint mt-1">Add 2 or more PDFs — they&apos;ll merge in order</p>
        </div>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
              {files.length} file{files.length !== 1 ? "s" : ""} queued
            </span>
            <button onClick={() => setFiles([])} className="text-xs text-ink-faint hover:text-rose-400 transition-colors">
              Clear all
            </button>
          </div>
          <ol className="space-y-2">
            {files.map((f, i) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs text-ink-faint w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="flex-1 truncate text-sm text-ink font-medium">{f.file.name}</span>
                <span className="font-[family-name:var(--font-mono)] text-xs text-ink-faint shrink-0">
                  {(f.file.size / 1024).toFixed(0)} KB
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => move(f.id, -1)}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 transition-all"
                    aria-label="Move up"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                  </button>
                  <button
                    onClick={() => move(f.id, 1)}
                    disabled={i === files.length - 1}
                    className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 transition-all"
                    aria-label="Move down"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  <button
                    onClick={() => remove(f.id)}
                    className="p-1.5 rounded-lg text-ink-soft hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    aria-label="Remove"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 text-sm text-rose-400 border border-rose-500/20 bg-rose-500/10 rounded-xl p-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={merge}
        disabled={files.length < 2 || busy}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
      >
        {busy ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Merging…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Merge {files.length || ""} PDFs
          </>
        )}
      </button>
    </div>
  );
}
