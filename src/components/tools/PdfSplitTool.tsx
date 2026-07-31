"use client";

import { useState } from "react";

function parseRanges(input: string, max: number): number[][] | string {
  const groups = input.split(",").map((s) => s.trim()).filter(Boolean);
  if (groups.length === 0) return "Enter at least one page or range, like 1-3,5";
  const out: number[][] = [];
  for (const g of groups) {
    if (g.includes("-")) {
      const [a, b] = g.split("-").map((n) => parseInt(n, 10));
      if (!a || !b || a < 1 || b < a || b > max) return `"${g}" is outside the document (1–${max}).`;
      const arr: number[] = [];
      for (let i = a; i <= b; i++) arr.push(i);
      out.push(arr);
    } else {
      const n = parseInt(g, 10);
      if (!n || n < 1 || n > max) return `"${g}" is outside the document (1–${max}).`;
      out.push([n]);
    }
  }
  return out;
}

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(f: File | undefined) {
    setError(null);
    setFile(null);
    setPageCount(null);
    if (!f) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
      setRanges(`1-${doc.getPageCount()}`);
    } catch {
      setError("Couldn't read that PDF — it may be encrypted.");
    }
  }

  async function split() {
    if (!file || !pageCount) return;
    const parsed = parseRanges(ranges, pageCount);
    if (typeof parsed === "string") {
      setError(parsed);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      for (let g = 0; g < parsed.length; g++) {
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, parsed[g].map((p) => p - 1));
        pages.forEach((p) => out.addPage(p));
        const data = await out.save();
        const blob = new Blob([data as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const label = parsed[g].length === 1 ? `p${parsed[g][0]}` : `p${parsed[g][0]}-${parsed[g][parsed[g].length - 1]}`;
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}_${label}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't split.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <label className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-ink/5 p-10 text-center cursor-pointer hover:border-rose-500/40 hover:bg-rose-500/5 transition-all duration-200">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        {file ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{file.name}</p>
              <p className="text-xs text-emerald-400 mt-1">{pageCount} pages detected · click to replace</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Pick a PDF to split</p>
              <p className="text-xs text-ink-faint mt-1">We&apos;ll read the page count locally</p>
            </div>
          </>
        )}
      </label>

      {pageCount && (
        <div className="space-y-2">
          <label htmlFor="ranges" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
            Pages or ranges
          </label>
          <input
            id="ranges"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="1-3, 5, 8-10"
            className="w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm placeholder-ink-faint focus:border-indigo-500/50 outline-none transition-all"
          />
          <p className="text-xs text-ink-faint">
            Each comma-separated group creates a separate PDF file.
          </p>
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
        onClick={split}
        disabled={!file || busy}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        {busy ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Splitting…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Split &amp; download
          </>
        )}
      </button>
    </div>
  );
}
