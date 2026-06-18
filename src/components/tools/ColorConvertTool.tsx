"use client";

import { useState } from "react";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace("#", "").trim();
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
  return { r: parseInt(v.slice(0, 2), 16), g: parseInt(v.slice(2, 4), 16), b: parseInt(v.slice(4, 6), 16) };
}
function rgbToHex({ r, g, b }: RGB) {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = ln - c / 2;
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-3 py-2.5 font-[family-name:var(--font-mono)] text-sm placeholder-ink-faint focus:border-indigo-500/50 outline-none transition-all";
const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";

export function ColorConvertTool() {
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [copied, setCopied] = useState<string | null>(null);

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);

  function onHex(v: string) { const parsed = hexToRgb(v); if (parsed) setRgb(parsed); }
  function onRgb(key: keyof RGB, v: string) {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) setRgb({ ...rgb, [key]: Math.max(0, Math.min(255, n)) });
  }
  function onHsl(key: keyof HSL, v: string) {
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return;
    setRgb(hslToRgb({ ...hsl, [key]: n }));
  }

  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setCopied(label); setTimeout(() => setCopied(null), 1500); } catch { /* no-op */ }
  }

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="relative h-40 rounded-2xl overflow-hidden border border-border shadow-2xl"
        style={{ background: hex }}
      >
        <div className="absolute bottom-3 right-3 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white/90">
          {hex}
        </div>
      </div>

      {/* Input sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* HEX */}
        <div>
          <label className={labelClass}>HEX</label>
          <div className="flex gap-2">
            <div className="w-8 h-9 rounded-lg border border-border shrink-0" style={{ background: hex }} />
            <input value={hex} onChange={(e) => onHex(e.target.value)} className={`${inputClass} flex-1`} />
          </div>
          <button onClick={() => copy(hex, "hex")} className="mt-2 text-xs text-ink-soft hover:text-indigo-600 transition-colors font-medium">
            {copied === "hex" ? "✓ Copied!" : "Copy hex"}
          </button>
        </div>

        {/* RGB */}
        <div>
          <label className={labelClass}>RGB</label>
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((k) => (
              <input key={k} value={rgb[k]} onChange={(e) => onRgb(k, e.target.value)} className={inputClass} />
            ))}
          </div>
          <button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")} className="mt-2 text-xs text-ink-soft hover:text-indigo-600 transition-colors font-medium">
            {copied === "rgb" ? "✓ Copied!" : "Copy rgb()"}
          </button>
        </div>

        {/* HSL */}
        <div>
          <label className={labelClass}>HSL</label>
          <div className="grid grid-cols-3 gap-2">
            {(["h", "s", "l"] as const).map((k) => (
              <input key={k} value={hsl[k]} onChange={(e) => onHsl(k, e.target.value)} className={inputClass} />
            ))}
          </div>
          <button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")} className="mt-2 text-xs text-ink-soft hover:text-indigo-600 transition-colors font-medium">
            {copied === "hsl" ? "✓ Copied!" : "Copy hsl()"}
          </button>
        </div>
      </div>

      {/* Color picker shortcut */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <label className="text-xs text-ink-soft font-medium">Quick pick</label>
        <input
          type="color"
          value={hex}
          onChange={(e) => { const parsed = hexToRgb(e.target.value); if (parsed) setRgb(parsed); }}
          className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
        />
      </div>
    </div>
  );
}
