"use client";

import { useState, useEffect } from "react";

const UNITS: Record<string, Record<string, number>> = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    mile: 0.000621371,
    yard: 1.09361,
    foot: 3.28084,
    inch: 39.3701,
  },
  weight: {
    kilogram: 1,
    gram: 1000,
    milligram: 1000000,
    pound: 2.20462,
    ounce: 35.274,
  },
  temperature: {
    celsius: 1, // special handling
    fahrenheit: 1,
    kelvin: 1,
  }
};

export function UnitConverterTool() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [value, setValue] = useState("1");
  const [result, setResult] = useState("");

  useEffect(() => {
    const units = Object.keys(UNITS[category]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, category]);

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult("");
      return;
    }

    if (category === "temperature") {
      let c;
      if (fromUnit === "celsius") c = val;
      else if (fromUnit === "fahrenheit") c = (val - 32) * 5/9;
      else c = val - 273.15;

      let res;
      if (toUnit === "celsius") res = c;
      else if (toUnit === "fahrenheit") res = c * 9/5 + 32;
      else res = c + 273.15;
      
      setResult(res.toFixed(4));
    } else {
      const base = val / UNITS[category][fromUnit];
      const res = base * UNITS[category][toUnit];
      setResult(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="monochrome-label block mb-2">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-bg-panel border border-border p-3 text-sm font-mono focus:border-accent outline-none"
          >
            {Object.keys(UNITS).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <label className="monochrome-label block mb-2">Source_Magnitude</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-bg-panel border border-border p-4 text-xl font-mono text-accent focus:border-accent outline-none"
            />
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-bg-panel border border-border p-3 text-xs font-mono outline-none"
            >
              {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="monochrome-label block mb-2">Target_Magnitude</label>
          <div className="flex gap-2">
            <div className="flex-1 workbench-panel p-4 text-xl font-mono text-ink bg-black/40 min-h-[64px] flex items-center">
              {result || "0"}
            </div>
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-bg-panel border border-border p-3 text-xs font-mono outline-none"
            >
              {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
