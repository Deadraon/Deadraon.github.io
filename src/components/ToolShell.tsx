import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { CATEGORY_LABEL } from "@/lib/tools";

export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-16 tools-theme">
      <div className="relative mx-auto max-w-5xl px-6 py-10 md:py-14">
        {/* Back nav */}
        <div className="mb-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-foreground transition-colors uppercase tracking-wider group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            Return to Instruments
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12 border-l-4 border-primary pl-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {CATEGORY_LABEL[tool.category]}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {tool.name}
            </h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl">
              {tool.tagline}
            </p>
          </div>

          {/* Trust Status Bar */}
          <div className="flex flex-wrap gap-3 mt-6">
            {tool.local ? (
              <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Execution: Local Isolated
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 rounded-full text-amber-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Execution: Remote Server
              </div>
            )}
            <div className="flex items-center gap-2 border border-white/[0.05] bg-white/[0.02] px-3.5 py-1 rounded-full text-muted-foreground text-xs font-medium">
              Privacy: Zero Egress
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="glass rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="border-b border-white/[0.05] bg-black/30 px-6 py-3.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Viewport Editor</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            </div>
          </div>
          <div className="p-6 md:p-10 bg-black/10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
