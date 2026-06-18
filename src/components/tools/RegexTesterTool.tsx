"use client";

import { useState, useEffect } from "react";

export function RegexTesterTool() {
  const [regex, setRegex] = useState("([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at support@toolhub.app or info@example.com for more information.");
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const re = new RegExp(regex, flags);
      const m = [];
      let match;
      
      if (flags.includes("g")) {
        while ((match = re.exec(text)) !== null) {
          m.push(match);
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        match = re.exec(text);
        if (match) m.push(match);
      }
      
      setMatches(m);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regex, flags, text]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="monochrome-label block mb-2">Regular_Expression</label>
          <input 
            type="text" 
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="w-full bg-bg-panel border border-border p-3 font-mono text-accent focus:border-accent outline-none"
          />
        </div>
        <div>
          <label className="monochrome-label block mb-2">Flags</label>
          <input 
            type="text" 
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full bg-bg-panel border border-border p-3 font-mono text-ink focus:border-accent outline-none"
            placeholder="gim"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 border border-warning/30 bg-warning/5 text-warning font-mono text-[10px]">
          [REGEXP_ERROR]: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="monochrome-label block mb-2">Test_Input</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 bg-bg-panel border border-border p-4 font-mono text-sm text-ink-soft focus:text-ink outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="monochrome-label block mb-2">Match_Results ({matches.length})</label>
          <div className="workbench-panel h-64 overflow-y-auto p-4 bg-black/40">
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((m, i) => (
                  <div key={i} className="border-b border-border/50 pb-2 last:border-0">
                    <span className="monochrome-label text-[9px] text-accent">Match {i+1}</span>
                    <div className="text-sm font-mono text-ink truncate select-all">{m[0]}</div>
                    <div className="text-[10px] font-mono text-ink-faint">Index: {m.index}</div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-ink-faint italic font-mono text-xs">[NO_MATCHES_FOUND]</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
