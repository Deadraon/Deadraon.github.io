"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Server 500 Unhandled Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden flex items-center justify-center px-4">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        {/* Error Code Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-semibold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Error 500 // System Fault</span>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-300 to-amber-500 select-none leading-none">
          500
        </h1>
        
        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Our system core encountered an unhandled execution fault. The developer team has been notified.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reboot Page
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/5 bg-white/[0.02] hover:bg-white/5 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
