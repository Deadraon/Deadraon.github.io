"use client";

import { useState, useEffect } from "react";

export function TimestampConverterTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000).toString();
    setInput(now);
    handleConvert(now);
  }, []);

  const handleConvert = (val: string) => {
    try {
      let date: Date;
      const num = parseInt(val);
      
      if (isNaN(num)) {
        date = new Date(val);
      } else {
        // Guess if it's seconds or milliseconds
        if (num > 100000000000) {
          date = new Date(num);
        } else {
          date = new Date(num * 1000);
        }
      }

      if (date.toString() === "Invalid Date") throw new Error();

      setResults([
        { label: "ISO_8601", value: date.toISOString() },
        { label: "UTC_String", value: date.toUTCString() },
        { label: "Local_String", value: date.toLocaleString() },
        { label: "Unix_Timestamp (s)", value: Math.floor(date.getTime() / 1000).toString() },
        { label: "Unix_Timestamp (ms)", value: date.getTime().toString() },
        { label: "Relative_Time", value: getRelativeTime(date) },
      ]);
    } catch (e) {
      setResults([]);
    }
  };

  const getRelativeTime = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const absDiff = Math.abs(diff);
    const units = [
      { l: "year", v: 31536000000 },
      { l: "month", v: 2592000000 },
      { l: "day", v: 86400000 },
      { l: "hour", v: 3600000 },
      { l: "minute", v: 60000 },
      { l: "second", v: 1000 },
    ];
    for (const { l, v } of units) {
      if (absDiff >= v) {
        const count = Math.floor(absDiff / v);
        return `${count} ${l}${count > 1 ? "s" : ""} ${diff > 0 ? "from now" : "ago"}`;
      }
    }
    return "just now";
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="monochrome-label block mb-2">Input_Timestamp_or_Date</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleConvert(e.target.value);
            }}
            placeholder="e.g. 1718712000 or 2026-06-18"
            className="flex-1 bg-bg-panel border border-border p-4 text-sm font-mono text-accent focus:border-accent outline-none"
          />
          <button 
            onClick={() => {
              const now = Math.floor(Date.now() / 1000).toString();
              setInput(now);
              handleConvert(now);
            }}
            className="btn-primary"
          >
            NOW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {results.length > 0 ? results.map((r) => (
          <div key={r.label} className="workbench-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-black/20">
            <span className="monochrome-label text-ink-faint">{r.label}</span>
            <span className="text-sm font-mono text-ink select-all">{r.value}</span>
          </div>
        )) : (
          <div className="workbench-panel p-8 text-center text-warning italic font-mono text-xs">
            [ERROR: INVALID_TEMPORAL_DATA]
          </div>
        )}
      </div>
    </div>
  );
}
