"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Loader2, Send, ShieldCheck, IndianRupee, User, Mail, Phone, FileText, Lock } from "lucide-react";

function PaymentForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    amount: "",
    projectId: "",
  });

  // Prefill form from query parameters
  useEffect(() => {
    setFormData({
      name: searchParams.get("name") || searchParams.get("clientName") || "",
      email: searchParams.get("email") || searchParams.get("clientEmail") || "",
      phone: searchParams.get("phone") || "",
      note: searchParams.get("note") || searchParams.get("projectName") || "",
      amount: searchParams.get("amount") || searchParams.get("budget") || "",
      projectId: searchParams.get("projectId") || "",
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment.");
      }

      toast.success("Payment order created! Redirecting to UPI gateway...");
      
      // Redirect directly to the MyMobPay checkout page
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const formattedAmount = formData.amount && !isNaN(Number(formData.amount)) && Number(formData.amount) > 0
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(formData.amount))
    : null;

  return (
    <div className="pt-24 pb-16 relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* SaaS AI Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#be38f3]/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#0070F3]/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />
      
      <div className="max-w-xl w-full px-4 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#be38f3]/20 bg-[#be38f3]/5 text-white/90 text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(190,56,243,0.1)]">
            <CreditCard className="w-3.5 h-3.5 text-[#be38f3]" />
            <span>UPI Payment Gateway</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mt-1 mb-3 tracking-tight">
            Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d364ff] to-[#be38f3] drop-shadow-[0_0_15px_rgba(190,56,243,0.2)]">Payment</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Pay for invoices, milestones, or service contracts securely via UPI.
          </p>
        </div>

        {/* Payment Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#080810]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-black/80 relative overflow-hidden"
        >
          {/* Subtle top brand border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be38f3] to-transparent" />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Client Name <span className="text-[#be38f3]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 group-focus-within:text-[#be38f3] group-hover:text-white/50 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0d0d15]/40 hover:bg-[#0d0d15]/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/30 focus:border-[#be38f3] transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Email Address <span className="text-[#be38f3]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 group-focus-within:text-[#be38f3] group-hover:text-white/50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0d0d15]/40 hover:bg-[#0d0d15]/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/30 focus:border-[#be38f3] transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-[#be38f3]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 group-focus-within:text-[#be38f3] group-hover:text-white/50 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0d0d15]/40 hover:bg-[#0d0d15]/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/30 focus:border-[#be38f3] transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Amount (₹ INR) <span className="text-[#be38f3]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 group-focus-within:text-[#be38f3] group-hover:text-white/50 transition-colors">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount in INR"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0d0d15]/40 hover:bg-[#0d0d15]/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/30 focus:border-[#be38f3] transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Payment For / Note <span className="text-[#be38f3]">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 flex items-center justify-center text-white/30 group-focus-within:text-[#be38f3] group-hover:text-white/50 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="e.g. Website development milestone 1, Project invoice ID"
                  value={formData.note}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0d0d15]/40 hover:bg-[#0d0d15]/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/30 focus:border-[#be38f3] transition-all resize-none placeholder:text-white/20"
                />
              </div>
            </div>
            
            {/* Hidden field for project linkage */}
            <input type="hidden" name="projectId" value={formData.projectId} />
          </div>

          {/* Secured banner */}
          <div className="p-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.02] backdrop-blur-md flex items-start gap-3 shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition-colors hover:border-emerald-500/25">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 mb-0.5">
                Direct Bank Settlement
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Payments route directly to our bank account. Securely verified and processed in real-time by <strong className="text-white">MyMobPay UPI Gateway</strong>.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#8a2be2] via-[#be38f3] to-[#ff007f] hover:from-[#943be8] hover:to-[#ff1a8c] text-white font-bold tracking-wide shadow-[0_0_30px_rgba(190,56,243,0.25)] hover:shadow-[0_0_40px_rgba(190,56,243,0.45)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 text-base relative group"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Connecting to secure gateway...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                <span>{formattedAmount ? `Pay ${formattedAmount} Now` : "Pay Now"}</span>
                <Send className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#030308]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentForm />
    </Suspense>
  );
}
