"use client";

import { useState } from "react";

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm placeholder-ink-faint focus:border-blue-500/50 focus:bg-ink/10 outline-none transition-all";
const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2";

export function WordCountTool() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text === "" ? 0 : text.split(/\n{2,}/).filter((p) => p.trim().length > 0).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const stats = [
    { label: "Words",       value: words.toLocaleString(),          icon: "📝" },
    { label: "Characters",  value: chars.toLocaleString(),          icon: "🔤" },
    { label: "No spaces",   value: charsNoSpaces.toLocaleString(),  icon: "✂️" },
    { label: "Sentences",   value: sentences.toLocaleString(),      icon: "💬" },
    { label: "Paragraphs",  value: paragraphs.toLocaleString(),     icon: "📄" },
    { label: "Read time",   value: `~${readingTime} min`,           icon: "⏱️" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={10}
          className={`${inputClass} resize-y leading-relaxed font-light`}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-bg-card p-4 flex flex-col gap-1.5">
            <span className="text-xs text-ink-faint font-medium">{s.label}</span>
            <span className="text-2xl font-bold text-ink tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      {words > 0 && (
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex justify-between text-xs text-ink-soft mb-2">
            <span className="font-medium">Reading progress preview</span>
            <span className="font-[family-name:var(--font-mono)]">{words} words</span>
          </div>
          <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (words / 500) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
