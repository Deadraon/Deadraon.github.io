import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { CATEGORY_LABEL } from "@/lib/tools";

export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-16 tools-theme">
      <div className="scanline" />

      <div className="relative mx-auto max-w-5xl px-6 py-10 md:py-14">
        {/* Back nav */}
        <div className="mb-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 font-display text-[10px] font-bold text-accent hover:underline tracking-widest uppercase"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            [ESC] RETURN_TO_TOOLS
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12 border-l-4 border-accent pl-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5">
                {CATEGORY_LABEL[tool.category]?.toUpperCase()}
              </span>
              <span className="monochrome-label">MOD_ID: {tool.slug.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display text-ink tracking-tighter uppercase">
              {tool.name}
            </h1>
            <p className="text-ink-soft text-sm font-mono leading-relaxed max-w-2xl">
              {" > "} {tool.tagline.toUpperCase()}
            </p>
          </div>

          {/* Trust Status Bar */}
          <div className="flex flex-wrap gap-4 mt-8">
            {tool.local ? (
              <div className="flex items-center gap-2 border border-success/30 bg-success/5 px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="font-display text-[9px] font-bold text-success tracking-widest uppercase">
                  Execution_Mode: LOCAL_ISOLATED
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-warning/30 bg-warning/5 px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <span className="font-display text-[9px] font-bold text-warning tracking-widest uppercase">
                  Execution_Mode: REMOTE_SRV
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 border border-border bg-ink/5 px-4 py-1.5">
              <span className="font-display text-[9px] font-bold text-ink-soft tracking-widest uppercase">
                Auth_State: ANONYMOUS_OK
              </span>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="workbench-panel shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="border-b border-border bg-black/20 px-4 py-2 flex items-center justify-between">
            <span className="monochrome-label">Module_Viewport</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
            </div>
          </div>
          <div className="p-6 md:p-10">
            {children}
          </div>
        </div>
        
        {/* Module Metadata */}
        <div className="mt-8 flex justify-between items-center px-4">
          <span className="monochrome-label text-[8px]">Compiled: WASM_V1.08_STABLE</span>
          <span className="monochrome-label text-[8px]">Integrity: VERIFIED_HASH</span>
        </div>
      </div>
    </div>
  );
}
