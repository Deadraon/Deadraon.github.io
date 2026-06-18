import type { Metadata } from "next";
import Link from "next/link";
import { tools, type ToolCategory, type Tool } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Precision Digital Workbench | Deadraon Tools",
  description: "High-precision, local-only digital tools for PDF, Images, and Data. Zero server uploads, maximum privacy.",
};

const CATEGORY_ORDER: ToolCategory[] = ["pdf", "image", "text", "convert", "generate", "media", "developer", "calculator", "security", "data", "color", "code", "encode"];

const CATEGORY_LABELS: Partial<Record<ToolCategory, string>> = {
  pdf: "PDF_PROCESSING",
  image: "IMAGE_ENGINE",
  text: "TEXT_ANALYSIS",
  convert: "UNIT_TRANSFORM",
  generate: "DATA_SYNTHESIS",
  media: "MEDIA_FETCH",
  developer: "DEV_CORE",
  calculator: "MATH_LOGIC",
  security: "CRYPT_PROT",
  data: "DATA_STRUCT",
  color: "COLOR_SPACE",
  code: "CODE_EXEC",
  encode: "ENCODE_DEC",
};

function ToolIcon({ slug }: { slug: string }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/[0.06] flex items-center justify-center text-primary group-hover:from-purple-600/20 group-hover:to-blue-600/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
      <svg className="w-5 h-5 text-primary group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-6 py-5 border-r border-white/[0.05] last:border-r-0 bg-white/[0.01]">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-extrabold text-primary font-mono tracking-tight">{value}</span>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] card-hover overflow-hidden"
    >
      {/* Subtle ambient light glow on hover */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-all duration-500" />
      
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <ToolIcon slug={tool.slug} />
        <div className="flex items-center gap-2">
          {tool.local ? (
            <span className="text-[9px] font-bold text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full bg-emerald-500/10 uppercase tracking-widest">
              Local
            </span>
          ) : (
            <span className="text-[9px] font-bold text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full bg-amber-500/10 uppercase tracking-widest">
              Cloud
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex-1 space-y-2">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
          {tool.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {tool.tagline}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between mt-5">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready
        </span>
        <div className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary">
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function ToolsDashboard() {
  const liveCount = tools.filter(t => t.status === "live").length;
  
  const grouped = CATEGORY_ORDER.map(c => ({
    category: c,
    items: tools.filter(t => t.category === c),
  })).filter(g => g.items.length > 0);

  return (
    <div className="relative pt-24 pb-20 tools-theme min-h-screen hero-mesh">
      <div className="relative mx-auto max-w-7xl px-6">
        
        {/* ===== HERO ===== */}
        <section className="py-20 border-b border-border/50 text-center md:text-left">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-semibold tracking-wider uppercase">System Core // Active</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
              Precision <span className="gradient-text">Developer Toolkit</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
              A comprehensive suite of client-side web utilities for developers. Fast execution, zero server uploads, absolute privacy.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#tools" className="btn-primary">
                Explore Instruments
              </a>
              <Link href="/" className="px-6 py-3 border border-border hover:border-white/10 hover:bg-white/[0.02] rounded-xl transition-all font-medium text-sm text-muted-foreground hover:text-foreground">
                Return to Portfolio
              </Link>
            </div>
          </div>
        </section>

        {/* ===== TELEMETRY STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-l border-r border-border/50 bg-card/25 backdrop-blur-md rounded-b-2xl shadow-xl shadow-black/10 overflow-hidden">
          <StatBadge value={`${liveCount}`} label="Active Modules" />
          <StatBadge value="100%" label="Local Processing" />
          <StatBadge value="0.0kb" label="Egress Data" />
          <StatBadge value="WASM" label="Engine" />
        </div>

        {/* ===== MODULE GRID ===== */}
        <section id="tools" className="py-20 scroll-mt-32">
          <div className="flex items-center justify-between mb-16 border-l-4 border-primary pl-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Available Instruments
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Click on any card to initialize the module locally.
              </p>
            </div>
            <div className="hidden lg:block text-right text-xs font-mono text-muted-foreground leading-normal">
              <span>Filter: ALL_MODULES</span><br />
              <span>Status: OPERATIONAL</span>
            </div>
          </div>

          <div className="space-y-24">
            {grouped.map((g) => (
              <div key={g.category} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-bold text-sm tracking-widest text-primary uppercase flex items-center gap-2">
                    <span className="w-1.5 h-4.5 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full" />
                    {CATEGORY_LABELS[g.category]?.replace("_", " ") || g.category.toUpperCase()}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {g.items.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOOTER INFO ===== */}
        <section className="py-20 border-t border-border/50 border-dashed">
          <div className="glass p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Local Security Protocols</h4>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                This toolkit is designed for absolute data confidentiality. All operations occur in transient CPU memory inside your web browser. Absolutely no data is transmitted to the cloud.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-4 border border-border bg-card/30 rounded-2xl">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-1.5 uppercase tracking-wide">Version ID</span>
                <span className="text-xs font-mono text-primary font-bold">TH-2026.18.06</span>
              </div>
              <div className="px-5 py-4 border border-border bg-card/30 rounded-2xl">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-1.5 uppercase tracking-wide">Interface Mode</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Isolated Client</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
