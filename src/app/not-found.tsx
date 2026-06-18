"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden flex items-center justify-center px-4">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        {/* Error Code Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold mb-2">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Error 404 // File Not Found</span>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-300 to-rose-500 select-none leading-none">
          404
        </h1>
        
        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Lost in Cyberspace?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The page you are looking for has been moved, deleted, or does not exist in our system.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
