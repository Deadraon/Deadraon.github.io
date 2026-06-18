"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { type Tool, type ToolCategory } from "@/lib/tools";
import {
  FileStack,
  Scissors,
  ImageDown,
  QrCode,
  Type,
  Paintbrush,
  Ruler,
  Eraser,
  ScanText,
  FileBadge,
  Download,
  Braces,
  Binary,
  Fingerprint,
  Cpu,
  Parentheses,
  Palette,
  Eye,
  Unlock,
  Scale,
  Database,
  Clock,
  Scaling,
  AlignLeft,
  GitCompare,
  Wrench,
  Loader2,
  Sparkles,
  Link2,
  Mail,
  Search,
  type LucideProps
} from "lucide-react";

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
  const iconMap: Record<string, React.ComponentType<LucideProps>> = {
    "pdf-merge": FileStack,
    "pdf-split": Scissors,
    "image-compress": ImageDown,
    "qr-generate": QrCode,
    "word-count": Type,
    "color-convert": Paintbrush,
    "online-ruler": Ruler,
    "bg-remove": Eraser,
    "image-ocr": ScanText,
    "resume-builder": FileBadge,
    "media-download": Download,
    "json-formatter": Braces,
    "base64-encode": Binary,
    "hash-generator": Fingerprint,
    "uuid-generator": Cpu,
    "regex-tester": Parentheses,
    "color-palette": Palette,
    "markdown-preview": Eye,
    "jwt-decoder": Unlock,
    "unit-converter": Scale,
    "csv-to-json": Database,
    "timestamp-converter": Clock,
    "image-resize": Scaling,
    "lorem-ipsum": AlignLeft,
    "diff-checker": GitCompare,
  };

  const IconComponent = iconMap[slug] || Wrench;

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/[0.06] flex items-center justify-center text-primary group-hover:from-purple-600/20 group-hover:to-blue-600/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
      <IconComponent className="w-5 h-5 text-primary group-hover:text-white transition-colors" strokeWidth={2} />
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] card-hover overflow-hidden"
    >
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-all duration-500" />
      
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

      <div className="flex-1 space-y-2">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
          {tool.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {tool.tagline}
        </p>
      </div>

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

const FAQ_ITEMS = [
  {
    question: "Is my data safe when using these tools?",
    answer: "Absolutely. All operations occur in transient RAM inside your web browser. Absolutely no files, input fields, or output configurations are uploaded or transmitted to any server. Your data never leaves your computer, ensuring absolute privacy.",
  },
  {
    question: "How do these client-side tools work under the hood?",
    answer: "We utilize modern browser engines, WebAssembly, and direct HTML5 client APIs. For example, PDF splitting and merging are built using client-side WebAssembly runtimes, while image background removal runs neural network models via local WebGL acceleration.",
  },
  {
    question: "Do I need an active internet connection to use them?",
    answer: "No, once the tools dashboard loads in your browser, the majority of the utilities work completely offline. Only the media downloader proxy route requires an active internet connection to query public nodes.",
  },
  {
    question: "Are there size limits on processed files?",
    answer: "Since processing takes place on your local CPU and RAM, limits are dictated by your browser's allocated resources and device memory. Most standard developer tasks (PDFs up to 100MB, images up to 4K resolution) process smoothly within seconds.",
  },
  {
    question: "How do I request a new developer tool?",
    answer: "Simply use the 'Request a Tool' form on this page. Suggest the utility name and expected features, and I will develop and add the requested functionality directly into our local tools hub.",
  },
];

export default function ToolsDashboardContent({ toolsList }: { toolsList: Tool[] }) {
  const liveCount = toolsList.filter((t) => t.status === "live").length;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toolName, setToolName] = useState("");
  const [toolDesc, setToolDesc] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !toolDesc.trim()) {
      toast.error("Please fill in the tool name and description.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tools/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: toolName,
          description: toolDesc,
          email: userEmail || undefined,
        }),
      });

      if (res.ok) {
        toast.success("Tool request submitted successfully! I'll look into building it.");
        setToolName("");
        setToolDesc("");
        setUserEmail("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTools = toolsList.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      t.name.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    );
  });

  const grouped = CATEGORY_ORDER.map((c) => ({
    category: c,
    items: filteredTools.filter((t) => t.category === c),
  })).filter((g) => g.items.length > 0);

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
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
              Precision <span className="gradient-text">Developer Toolkit</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
              A comprehensive suite of client-side web utilities for developers. Fast execution, zero server uploads, absolute privacy.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#tools" className="btn-primary">
                Explore Instruments
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 border border-primary/30 border-b-4 border-b-primary/50 hover:bg-primary/10 rounded-xl transition-all duration-100 font-extrabold text-sm text-primary active:border-b-2 active:translate-y-[2px] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Request a Tool
              </button>
            </div>
          </div>
        </section>

        {/* ===== MODULE GRID ===== */}
        <section id="tools" className="py-20 scroll-mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-l-4 border-primary pl-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Available Instruments
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Click on any card to initialize the module locally.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80 group/search">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-primary transition-colors">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-10 pr-10 py-2.5 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-primary/50 focus:bg-white/[0.04] rounded-xl text-xs font-semibold focus:outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {grouped.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <Sparkles className="w-10 h-10 mx-auto mb-4 text-primary opacity-40 animate-pulse" />
              <p className="text-sm font-semibold">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try searching for other keywords or categories.</p>
            </div>
          ) : (
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
          )}
        </section>

        {/* ===== REQUEST A TOOL WIDGET ===== */}
        <section className="py-16 border-t border-border/50 border-dashed">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-[#be38f3]/5 p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute -right-24 -top-24 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
            
            <div className="relative z-10 space-y-3 max-w-xl">
              <span className="text-[10px] font-bold text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Custom Utilities
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Need a specific digital tool?
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Tell me what utility you are looking for (e.g., custom parsers, formatting aids, converters), and I will build and add it to the workbench suite.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-4 border-b-blue-900 text-white text-sm font-extrabold rounded-xl transition-all duration-100 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/45 hover:from-purple-500 hover:to-blue-500 active:border-b-2 active:translate-y-[2px] cursor-pointer flex items-center justify-center gap-2"
              >
                Request a Tool
              </button>
            </div>
          </div>
        </section>

        {/* ===== SEO ARTICLE & FAQ SECTION ===== */}
        <section className="py-20 border-t border-border/50 border-dashed">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* SEO Article */}
            <div className="lg:col-span-7 space-y-6 text-sm text-muted-foreground leading-relaxed">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
                In-Depth Insights
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Secure Client-Side Developer Utilities
              </h2>
              <p>
                In today&apos;s fast-paced digital ecosystem, developers, content creators, and IT professionals frequently require lightweight utilities to edit, validate, and convert files. However, uploading sensitive configuration details, database schemas, or proprietary customer PDFs to generic online converter platforms poses a severe security hazard. Standard online converters transfer files directly to remote servers, leaving them vulnerable to data breaches, session exposure, and cloud logging.
              </p>
              <p>
                The <strong className="text-foreground">Deadraon Precision Toolkit</strong> completely addresses this security dilemma. It implements a strict <strong className="text-foreground">100% client-side-first execution model</strong>. Utilizing cutting-edge web technologies like WebAssembly (WASM), modern browser APIs (such as HTML5 Canvas and WebGL), and local JavaScript runtime engines, we perform CPU-intensive processing tasks directly inside your browser sandbox. Your private files and datasets never leave your device.
              </p>
              
              <h3 className="text-lg font-bold text-white pt-2">Under the Hood: High-Performance Browser Execution</h3>
              <ul className="space-y-4">
                <li>
                  <strong className="text-foreground block mb-1">1. WebAssembly (WASM) PDF Engine</strong>
                  We use precompiled Rust and C++ bundles loaded directly via the browser engine. This permits complex document manipulation like merging or splitting multiple PDFs without any communication with external servers.
                </li>
                <li>
                  <strong className="text-foreground block mb-1">2. Local Neural Backdrops</strong>
                  Advanced image background removal uses local neural networks running on your browser&apos;s WebGL framework. The AI model resides in your local cache, performing pixel segmentation without transmitting visual media over the network.
                </li>
                <li>
                  <strong className="text-foreground block mb-1">3. On-Device OCR Scanner</strong>
                  Text extraction from images is handled in a local background web worker using optical character recognition libraries. Your documents, logs, and sensitive invoices are processed locally on your hardware.
                </li>
                <li>
                  <strong className="text-foreground block mb-1">4. Secure Client-Side Hashing</strong>
                  Cryptographic verification, UUID synthesis, and JWT validation leverage the browser&apos;s native web crypto standard. This prevents your secure keys or client credentials from ever appearing in any external logs.
                </li>
              </ul>
              
              <p className="pt-2">
                Whether you need to quickly optimize an image, format messy JSON schemas, validate complex regular expressions, or generate high-quality QR codes, our tools execute instantly. Since the network overhead of uploading files is completely eliminated, files are processed instantly. Best of all, once the web application is loaded in your browser, the bulk of our tools run completely offline.
              </p>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
                  FAQ
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Common questions regarding our toolkit, security protocols, and mechanics.
                </p>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className="border border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 text-xs font-bold text-white hover:text-primary transition-colors"
                    >
                      <span>{item.question}</span>
                      <span className="shrink-0 text-muted-foreground font-mono text-sm">
                        {openFaq === index ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        openFaq === index ? "max-h-[300px] opacity-100 border-t border-white/5 bg-white/[0.005]" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <p className="px-5 py-4 text-xs text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

      {/* ===== REQUEST MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-[#080810]/90 border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be38f3] to-transparent" />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Request a Tool</h3>
                <p className="text-xs text-muted-foreground">
                  Suggest a digital utility you need and I will construct it.
                </p>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="req-tool-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Tool Name <span className="text-[#be38f3]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="req-tool-name"
                      type="text"
                      placeholder="e.g. SVG Optimizer, YAML Validator"
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all placeholder:text-white/15"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="req-tool-desc" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Function Description <span className="text-[#be38f3]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-white/20">
                      <Link2 className="w-3.5 h-3.5" />
                    </span>
                    <textarea
                      id="req-tool-desc"
                      rows={3}
                      placeholder="Explain what the tool should do, how it should work, expected inputs and outputs..."
                      value={toolDesc}
                      onChange={(e) => setToolDesc(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all resize-none placeholder:text-white/15"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="req-user-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Your Email <span className="text-white/20">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="req-user-email"
                      type="email"
                      placeholder="you@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all placeholder:text-white/15"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 border-b-4 border-b-white/20 bg-white/[0.02] hover:bg-white/5 text-xs text-white font-extrabold rounded-xl transition-all duration-100 active:border-b-2 active:translate-y-[2px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-4 border-b-blue-900 disabled:opacity-40 text-xs text-white font-extrabold rounded-xl transition-all duration-100 shadow-md shadow-blue-500/15 hover:shadow-blue-500/30 hover:from-purple-500 hover:to-blue-500 active:border-b-2 active:translate-y-[2px] flex items-center justify-center gap-1.5"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
