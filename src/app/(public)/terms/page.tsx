import type { Metadata } from "next";
import { FileText, Lock, Globe, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Deadraon Software Agreements",
  description: "Review terms of service and billing conditions for Deadraon. Learn about payment structures, licensing of utility tools, and project handovers.",
  keywords: ["Terms of Service Deadraon", "developer billing terms", "tools usage conditions"],
};

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-24 pb-20 relative overflow-hidden min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#be38f3]/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" /> Site Agreement
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Last Updated: June 18, 2026. Please read this agreement before using our services or tools.
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 md:p-10 rounded-3xl border border-white/[0.08] bg-[#080810]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 text-sm leading-relaxed text-white/70">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> 1. Overview of Service
            </h2>
            <p>
              By accessing the website at <strong>deadraon.dev</strong>, you agree to comply with and be bound by these Terms and Conditions, our Privacy Policy, and any applicable local guidelines. If you do not agree, you must immediately cease accessing the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> 2. Licensing & Usage of Utilities
            </h2>
            <p>
              All client-side developer utility tools integrated within the `/tools` section are free to use. You are granted a personal, non-exclusive, non-transferable license to use these tools for private or commercial development purposes. Reverse engineering of code packages, scraping, or launching DDoS campaigns against proxy endpoints is strictly prohibited and will result in network bans.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> 3. Secure Billing & Payments
            </h2>
            <p>
              When initiating payments through our portal, you agree to provide accurate, complete billing details (name, email, phone). All payments are finalized through secure Cashfree/MyMobPay channels. Once order states are successfully settled, transactions are final and non-refundable unless explicitly agreed upon in writing for specific freelance development contract milestones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" /> 4. Warranties and Limitation of Liability
            </h2>
            <p>
              Our utility suite and consulting services are provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied. In no event shall Deadraon or its developer be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools or custom backend.
            </p>
          </section>

          <div className="pt-6 border-t border-white/[0.05] text-xs text-muted-foreground text-center">
            For inquiry or legal questions, reach out via email: <a href="mailto:deadraon@gmail.com" className="text-primary hover:underline">deadraon@gmail.com</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
