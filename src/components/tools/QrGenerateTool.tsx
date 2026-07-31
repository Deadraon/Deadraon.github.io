"use client";

import { useEffect, useRef, useState } from "react";

export function QrGenerateTool() {
  const [text, setText] = useState("https://example.com");
  const [color, setColor] = useState("#6366f1");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!canvasRef.current) return;
      const QR = (await import("qrcode")).default;
      if (cancelled) return;
      try {
        await QR.toCanvas(canvasRef.current, text || " ", {
          width: 280,
          margin: 2,
          color: { dark: color, light: bg },
          errorCorrectionLevel: "M",
        });
      } catch {
        // empty / invalid — leave canvas blank
      }
    }
    render();
    return () => { cancelled = true; };
  }, [text, color, bg]);

  function download() {
    const c = canvasRef.current;
    if (!c) return;
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.png";
    a.click();
  }

  const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm placeholder-ink-faint focus:border-indigo-500/50 outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Controls */}
      <div className="space-y-5">
        <div>
          <label htmlFor="qr-text" className={labelClass}>Content</label>
          <textarea
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="URL, plain text, or vCard…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="qr-color" className={labelClass}>Dot color</label>
            <div className="flex items-center gap-2">
              <input
                id="qr-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="font-[family-name:var(--font-mono)] text-sm text-ink-soft">{color}</span>
            </div>
          </div>
          <div>
            <label htmlFor="qr-bg" className={labelClass}>Background</label>
            <div className="flex items-center gap-2">
              <input
                id="qr-bg"
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="font-[family-name:var(--font-mono)] text-sm text-ink-soft">{bg}</span>
            </div>
          </div>
        </div>

        <button
          onClick={download}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PNG
        </button>
      </div>

      {/* QR Preview */}
      <div className="flex items-center justify-center rounded-2xl border border-border bg-white p-6 min-h-[280px] shadow-2xl">
        <canvas ref={canvasRef} className="max-w-full rounded-md" />
      </div>
    </div>
  );
}
