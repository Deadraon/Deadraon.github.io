import type { Metadata } from "next";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Deadraon Security & Confidentiality",
  description: "Learn how Deadraon handles user data. We guarantee 100% data confidentiality, zero-egress local processing, and absolute client privacy.",
  keywords: ["Privacy Policy Deadraon", "local tool privacy", "data confidentiality developer"],
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 relative overflow-hidden min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#be38f3]/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Privacy & Trust
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Privacy <span className="text-sky-400">Policy</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Last Updated: June 18, 2026. Your trust and privacy are our highest priorities.
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 md:p-10 rounded-3xl border border-white/[0.08] bg-[#080810]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 text-sm leading-relaxed text-white/70">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> 1. Client-Side Local Execution Policy
            </h2>
            <p>
              Many of the utility instruments provided inside the <strong>Deadraon Toolkit</strong> suite execute entirely inside your local web browser using Client-Side JavaScript and WebAssembly (WASM). For these tools (such as PDF merging, splitting, image compression, QR generation, OCR scanner, and validators), <strong>absolutely none of your uploaded files or input data are sent to our servers</strong>. All processing occurs in transient CPU memory on your local machine and vanishes when you close the browser tab.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> 2. Information We Collect
            </h2>
            <p>
              We only collect data that you directly provide to us in the following scenarios:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact & Inquiries:</strong> When you send a message via our contact forms, we store your name, email address, message, and details to reply to your consulting requests.</li>
              <li><strong>Secure Payments:</strong> Payments are processed via verified PCI-compliant gateways (Cashfree & MyMobPay). We store your basic client details (billing name, email, phone) to log transaction history, but <strong>we never store your credit card details or payment credentials</strong>.</li>
              <li><strong>Tool Requests:</strong> When suggesting new utilities, we save the tool name, description, and optional email address.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> 3. Cookies and Analytics
            </h2>
            <p>
              We use standard session cookies managed by our authentication provider (Clerk) to keep you logged in to your account. Additionally, if Google Analytics is enabled, it may gather anonymized traffic logs (such as page visits, browser types, and general demographics) to help us analyze site performance. You can block cookies using your browser settings or adblockers without affecting your workbench suite experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> 4. Data Retention and Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information with third parties. Client details, invoices, and transaction logs are stored securely in MongoDB Atlas using standard encryption and are retained solely for bookkeeping and account validation purposes.
            </p>
          </section>

          <div className="pt-6 border-t border-white/[0.05] text-xs text-muted-foreground text-center">
            For questions regarding this policy, reach out via email: <a href="mailto:deadraon@gmail.com" className="text-primary hover:underline">deadraon@gmail.com</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
