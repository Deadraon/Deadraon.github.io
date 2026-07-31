"use client";

import { useState, useRef, useEffect } from "react";

type Unit = "inch" | "cm";
type CalibrationMode = "none" | "credit-card" | "manual";

export function OnlineRulerTool() {
  const [unit, setUnit] = useState<Unit>("cm");
  const [dpi, setDpi] = useState<number>(96); // default to standard 96 DPI
  const [isVertical, setIsVertical] = useState<boolean>(false);
  
  // Calibration
  const [calibrationMode, setCalibrationMode] = useState<CalibrationMode>("none");
  const [ccWidthPx, setCcWidthPx] = useState<number>(324); // default width representing ~3.37 in at 96 dpi
  const [manualDpi, setManualDpi] = useState<string>("96");
  
  // Guidelines
  const [guides, setGuides] = useState<number[]>([100, 300]);
  const [activeGuideIdx, setActiveGuideIdx] = useState<number | null>(null);
  
  // Camera Measurement Backdrop
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [cameraOpacity, setCameraOpacity] = useState<number>(40);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rulerContainerRef = useRef<HTMLDivElement>(null);

  // standard credit card width in inches is 3.37007874
  const CC_PHYSICAL_INCHES = 3.37007874;

  // Fetch camera devices when camera mode is enabled
  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const video = devices.filter((device) => device.kind === "videoinput");
          setVideoDevices(video);
          if (video.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(video[0].deviceId);
          }
        })
        .catch((err) => console.error("Error listing cameras:", err));
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  // Handle camera stream based on selected device ID
  useEffect(() => {
    if (showCamera && selectedDeviceId) {
      startCamera();
    }
  }, [selectedDeviceId, showCamera]);

  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to start camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const applyCcCalibration = () => {
    const calculatedDpi = ccWidthPx / CC_PHYSICAL_INCHES;
    setDpi(calculatedDpi);
    setManualDpi(Math.round(calculatedDpi).toString());
    setCalibrationMode("none");
  };

  const applyManualDpi = () => {
    const parsed = parseFloat(manualDpi);
    if (!isNaN(parsed) && parsed > 10) {
      setDpi(parsed);
    }
    setCalibrationMode("none");
  };

  // Drag handlers for guidelines
  const handleMouseDown = (idx: number) => {
    setActiveGuideIdx(idx);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeGuideIdx === null || !rulerContainerRef.current) return;
      const rect = rulerContainerRef.current.getBoundingClientRect();
      let pos = 0;
      if (isVertical) {
        pos = e.clientY - rect.top;
      } else {
        pos = e.clientX - rect.left;
      }
      // clamp to container size
      const maxPos = isVertical ? rect.height : rect.width;
      const clamped = Math.max(0, Math.min(maxPos, pos));
      
      setGuides((prev) => {
        const next = [...prev];
        next[activeGuideIdx] = clamped;
        return next;
      });
    };

    const handleMouseUp = () => {
      setActiveGuideIdx(null);
    };

    if (activeGuideIdx !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeGuideIdx, isVertical]);

  const addGuide = () => {
    if (guides.length >= 8) return; // Limit guide count
    setGuides((prev) => [...prev, 150 + prev.length * 30]);
  };

  const removeGuide = (idx: number) => {
    setGuides((prev) => prev.filter((_, i) => i !== idx));
  };

  // Conversion utilities
  const pxToCm = (px: number) => (px / dpi) * 2.54;
  const pxToIn = (px: number) => px / dpi;

  // Markings generation
  const renderMarkings = () => {
    const markings = [];
    const pixelsPerInch = dpi;
    const pixelsPerCm = dpi / 2.54;
    
    // We render up to 100 inches / 250 cm worth of scale depending on space or container size
    const limit = 4000; 
    
    if (unit === "cm") {
      // Millimeter markings
      const step = pixelsPerCm / 10;
      for (let i = 0; i * step < limit; i++) {
        const isCm = i % 10 === 0;
        const isHalfCm = i % 5 === 0 && !isCm;
        const pos = i * step;
        
        let height = "h-2 bg-ink/20";
        if (isCm) height = "h-6 bg-ink/80 w-[1.5px]";
        else if (isHalfCm) height = "h-4 bg-ink/40";
        
        if (isVertical) {
          markings.push(
            <div
              key={`cm-${i}`}
              className="absolute right-0 flex items-center justify-end pr-2"
              style={{ top: `${pos}px` }}
            >
              {isCm && (
                <span className="text-[10px] text-ink-soft mr-2 font-[family-name:var(--font-mono)]">
                  {i / 10}
                </span>
              )}
              <div className={`${height} w-6 h-[1px] bg-ink`} style={{ width: isCm ? "18px" : isHalfCm ? "12px" : "6px", height: "1px" }} />
            </div>
          );
        } else {
          markings.push(
            <div
              key={`cm-${i}`}
              className="absolute bottom-0 flex flex-col items-center justify-end pb-2"
              style={{ left: `${pos}px` }}
            >
              {isCm && (
                <span className="text-[10px] text-ink-soft mb-1 font-[family-name:var(--font-mono)]">
                  {i / 10}
                </span>
              )}
              <div className={`${height} w-[1px]`} style={{ height: isCm ? "18px" : isHalfCm ? "12px" : "6px", width: "1px" }} />
            </div>
          );
        }
      }
    } else {
      // Inches markings (divided by 1/16ths)
      const divisions = 16;
      const step = pixelsPerInch / divisions;
      
      for (let i = 0; i * step < limit; i++) {
        const isWholeInch = i % divisions === 0;
        const isHalfInch = i % 8 === 0 && !isWholeInch;
        const isQuarterInch = i % 4 === 0 && !isWholeInch && !isHalfInch;
        const isEighthInch = i % 2 === 0 && i % 4 !== 0;
        const pos = i * step;
        
        let height = "6px";
        let width = "1px";
        
        if (isWholeInch) height = "18px";
        else if (isHalfInch) height = "14px";
        else if (isQuarterInch) height = "10px";
        else if (isEighthInch) height = "8px";
        
        if (isVertical) {
          markings.push(
            <div
              key={`in-${i}`}
              className="absolute right-0 flex items-center justify-end pr-2"
              style={{ top: `${pos}px` }}
            >
              {isWholeInch && (
                <span className="text-[10px] text-ink-soft mr-2 font-[family-name:var(--font-mono)]">
                  {i / divisions}
                </span>
              )}
              <div className="bg-ink/60" style={{ width: height, height: width }} />
            </div>
          );
        } else {
          markings.push(
            <div
              key={`in-${i}`}
              className="absolute bottom-0 flex flex-col items-center justify-end pb-2"
              style={{ left: `${pos}px` }}
            >
              {isWholeInch && (
                <span className="text-[10px] text-ink-soft mb-1 font-[family-name:var(--font-mono)]">
                  {i / divisions}
                </span>
              )}
              <div className="bg-ink/60" style={{ height: height, width: width }} />
            </div>
          );
        }
      }
    }
    
    return markings;
  };

  const getGuidelineDistance = () => {
    if (guides.length < 2) return null;
    const sorted = [...guides].sort((a, b) => a - b);
    const diffPx = sorted[sorted.length - 1] - sorted[0];
    return {
      px: diffPx,
      cm: pxToCm(diffPx).toFixed(2),
      in: pxToIn(diffPx).toFixed(3),
      mm: (pxToCm(diffPx) * 10).toFixed(1),
    };
  };

  const distance = getGuidelineDistance();

  return (
    <div className="space-y-6">
      {/* Top Menu Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border bg-bg-card rounded-2xl">
        <div className="flex items-center gap-3">
          {/* Unit selection */}
          <div className="inline-flex rounded-xl bg-ink/5 p-1 border border-border">
            <button
              onClick={() => setUnit("cm")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                unit === "cm" ? "bg-blue-600 text-white shadow" : "text-ink-soft hover:text-ink"
              }`}
            >
              cm / mm
            </button>
            <button
              onClick={() => setUnit("inch")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                unit === "inch" ? "bg-blue-600 text-white shadow" : "text-ink-soft hover:text-ink"
              }`}
            >
              inches
            </button>
          </div>

          {/* Orientation selection */}
          <button
            onClick={() => setIsVertical(!isVertical)}
            className="flex items-center gap-2 rounded-xl bg-ink/5 border border-border hover:bg-ink/10 hover:border-border-hover px-4 py-2 text-xs font-semibold text-ink transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Rotate {isVertical ? "Horizontal" : "Vertical"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Calibration button */}
          <button
            onClick={() => setCalibrationMode(calibrationMode === "credit-card" ? "none" : "credit-card")}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
              calibrationMode !== "none"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                : "bg-ink/5 border-border hover:bg-ink/10 text-ink"
            }`}
          >
            📏 Calibrate Scale
          </button>

          {/* Add guide */}
          <button
            onClick={addGuide}
            className="rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 text-xs font-semibold transition-colors"
          >
            ➕ Guideline
          </button>

          {/* Camera Backdrop Toggle */}
          <button
            onClick={() => setShowCamera(!showCamera)}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
              showCamera
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-300"
                : "bg-ink/5 border-border hover:bg-ink/10 text-ink"
            }`}
          >
            📷 Camera Backdrop
          </button>
        </div>
      </div>

      {/* Camera Controls Panel */}
      {showCamera && (
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Backdrop settings</span>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="rounded-lg border border-border bg-bg text-ink px-3 py-1.5 text-xs outline-none"
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                </option>
              ))}
              {videoDevices.length === 0 && <option value="">No cameras found</option>}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-ink-soft">Backdrop Opacity</label>
            <input
              type="range"
              min="10"
              max="90"
              value={cameraOpacity}
              onChange={(e) => setCameraOpacity(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-xs font-mono text-ink-soft w-8">{cameraOpacity}%</span>
          </div>
        </div>
      )}

      {/* Calibration panel */}
      {calibrationMode !== "none" && (
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-wider">Calibration Console</h3>
            <div className="flex rounded-lg bg-ink/5 p-0.5 border border-border">
              <button
                onClick={() => setCalibrationMode("credit-card")}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  calibrationMode === "credit-card" ? "bg-amber-500/20 text-amber-600 dark:text-amber-300" : "text-ink-soft"
                }`}
              >
                Credit Card Size
              </button>
              <button
                onClick={() => setCalibrationMode("manual")}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  calibrationMode === "manual" ? "bg-amber-500/20 text-amber-600 dark:text-amber-300" : "text-ink-soft"
                }`}
              >
                Enter DPI Manual
              </button>
            </div>
          </div>

          {calibrationMode === "credit-card" && (
            <div className="flex flex-col items-center gap-6">
              <p className="text-xs text-ink-soft text-center max-w-lg leading-relaxed">
                Place a physical credit/debit card on your screen. Adjust the slider or size controls below until the dotted template matches the actual physical width of your card.
              </p>

              {/* Dotted calibration card representation */}
              <div
                style={{ width: `${ccWidthPx}px` }}
                className="h-44 rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-500/10 flex flex-col items-center justify-center relative shadow-xl max-w-full transition-all duration-100"
              >
                <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/30 absolute top-4 left-4" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-widest">Credit Card</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400/70 font-mono mt-1">Template Matches Scale</span>
              </div>

              {/* Slider for resize */}
              <div className="w-full max-w-md flex items-center gap-4">
                <button
                  onClick={() => setCcWidthPx((p) => Math.max(150, p - 2))}
                  className="w-8 h-8 rounded-lg bg-ink/5 border border-border text-ink font-bold text-sm flex items-center justify-center hover:bg-ink/10"
                >
                  -
                </button>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={ccWidthPx}
                  onChange={(e) => setCcWidthPx(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setCcWidthPx((p) => Math.min(600, p + 2))}
                  className="w-8 h-8 rounded-lg bg-ink/5 border border-border text-ink font-bold text-sm flex items-center justify-center hover:bg-ink/10"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-soft">Calculated Screen Scale: {Math.round(ccWidthPx / CC_PHYSICAL_INCHES)} DPI</span>
                <button
                  onClick={applyCcCalibration}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  Apply Calibration
                </button>
              </div>
            </div>
          )}

          {calibrationMode === "manual" && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs text-ink-soft text-center max-w-lg leading-relaxed">
                Enter your screen's precise pixels per inch (DPI/PPI) if known. Standard screens are usually around 96 or 120. High-DPI laptops range from 140 to 220.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={manualDpi}
                  onChange={(e) => setManualDpi(e.target.value)}
                  className="w-32 rounded-xl border border-border bg-bg text-ink px-3 py-2 text-center text-sm outline-none font-[family-name:var(--font-mono)]"
                />
                <button
                  onClick={applyManualDpi}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2.5 transition-all"
                >
                  Save DPI
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ruler container viewport */}
      <div 
        ref={rulerContainerRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl transition-all duration-300"
        style={{ 
          height: isVertical ? "650px" : "180px",
          width: "100%",
          cursor: activeGuideIdx !== null ? (isVertical ? "row-resize" : "col-resize") : "default"
        }}
      >
        {/* Camera video element */}
        {showCamera && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
            style={{ opacity: cameraOpacity / 100 }}
          />
        )}

        {/* Ruler Background Grid */}
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

        {/* Dynamic markings */}
        <div className="absolute inset-0 pointer-events-none">
          {renderMarkings()}
        </div>

        {/* Guidelines overlays */}
        {guides.map((pos, idx) => (
          <div
            key={idx}
            className="absolute group transition-shadow cursor-pointer z-20"
            style={
              isVertical
                ? { top: `${pos}px`, left: 0, right: 0, height: "16px", marginTop: "-8px" }
                : { left: `${pos}px`, top: 0, bottom: 0, width: "16px", marginLeft: "-8px" }
            }
            onMouseDown={() => handleMouseDown(idx)}
          >
            {/* Guide line visual representation */}
            <div 
              className={`absolute ${
                isVertical ? "h-[1.5px] left-0 right-0 top-[8px]" : "w-[1.5px] top-0 bottom-0 left-[8px]"
              } bg-blue-500 transition-colors shadow-glow`} 
            />
            {/* Grab handle badge */}
            <div
              className={`absolute ${
                isVertical
                  ? "left-4 top-0 translate-y-[2px]"
                  : "top-4 left-0 -translate-x-[4px]"
              } rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-mono text-white/90 shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5`}
            >
              <span>#{idx + 1}</span>
              <button 
                onMouseDown={(e) => {
                  e.stopPropagation();
                  removeGuide(idx);
                }} 
                className="hover:text-red-400 font-bold shrink-0 pointer-events-auto"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines measurement stats panel */}
      {distance && (
        <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-blue-400 dark:text-blue-300 uppercase tracking-wider">Interval Measurements</span>
            <span className="text-xs text-ink-soft">Between outer guidelines</span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <span className="block text-[10px] text-ink-soft uppercase tracking-wider font-medium">Inches</span>
              <span className="text-base font-bold font-mono text-ink">{distance.in}″</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-[10px] text-ink-soft uppercase tracking-wider font-medium">Centimeters</span>
              <span className="text-base font-bold font-mono text-ink">{distance.cm} cm</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-[10px] text-ink-soft uppercase tracking-wider font-medium">Millimeters</span>
              <span className="text-base font-bold font-mono text-ink">{distance.mm} mm</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Instructions Card */}
      <div className="p-5 rounded-2xl border border-border bg-ink/5 space-y-3">
        <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">ruler calibration & tips</h4>
        <ul className="space-y-2 text-xs text-ink-soft leading-relaxed list-disc list-inside font-light">
          <li>For an <strong>accurate online ruler actual size</strong>, press the <strong className="text-ink">Calibrate Scale</strong> button above and adjust using a standard credit card.</li>
          <li>Select between <strong className="text-ink">cm/mm</strong> or <strong className="text-ink">inches</strong> depending on your metric/imperial project requirements.</li>
          <li>Click <strong className="text-ink">➕ Guideline</strong> to add visual drag markers for measuring complex physical objects aligned with your monitor.</li>
          <li>Click <strong className="text-ink">Rotate</strong> to swap layout constraints for vertical or horizontal scaling needs.</li>
        </ul>
      </div>
    </div>
  );
}
