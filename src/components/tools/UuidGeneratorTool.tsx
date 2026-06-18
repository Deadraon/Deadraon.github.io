"use client";

import { useState } from "react";

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<"v4">("v4");
  const [quantity, setQuantity] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const newUuids = [];
    for (let i = 0; i < quantity; i++) {
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="monochrome-label block mb-2">UUID_Version</label>
            <select 
              value={version}
              onChange={(e) => setVersion(e.target.value as "v4")}
              className="w-full bg-bg-panel border border-border p-3 text-sm font-mono focus:border-accent outline-none"
            >
              <option value="v4">Version 4 (Random)</option>
            </select>
          </div>
          <div>
            <label className="monochrome-label block mb-2">Quantity</label>
            <input 
              type="number" 
              min="1" 
              max="100" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full bg-bg-panel border border-border p-3 text-sm font-mono focus:border-accent outline-none"
            />
          </div>
          <button 
            onClick={generate}
            className="btn-primary w-full"
          >
            EXECUTE_GENERATION
          </button>
        </div>

        <div className="space-y-4">
          <label className="monochrome-label block mb-2">Output_Buffer</label>
          <div className="workbench-panel min-h-[150px] p-4 font-mono text-xs text-accent overflow-y-auto max-h-[300px] bg-black/40">
            {uuids.length > 0 ? (
              <ul className="space-y-1">
                {uuids.map((u, i) => (
                  <li key={i} className="animate-flicker">{u}</li>
                ))}
              </ul>
            ) : (
              <span className="text-ink-faint italic">[NO_DATA_GENERATED]</span>
            )}
          </div>
          {uuids.length > 0 && (
            <button 
              onClick={copyToClipboard}
              className="text-[10px] font-display font-bold text-ink-soft hover:text-accent flex items-center gap-2 uppercase transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
              </svg>
              Copy_to_Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
