"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Loader2, Send, ShieldCheck, IndianRupee } from "lucide-react";

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
          className="space-y-5 p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top brand border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be38f3] to-transparent" />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Client Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/40 focus:border-[#be38f3] transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/40 focus:border-[#be38f3] transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/40 focus:border-[#be38f3] transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground">
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
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/40 focus:border-[#be38f3] transition-all placeholder:text-muted-foreground/60 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                Payment For / Note
              </label>
              <textarea
                name="note"
                rows={3}
                placeholder="e.g. Website development milestone 1, Project invoice ID"
                value={formData.note}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#be38f3]/40 focus:border-[#be38f3] transition-all resize-none placeholder:text-muted-foreground/60"
              />
            </div>
            
            {/* Hidden field for project linkage */}
            <input type="hidden" name="projectId" value={formData.projectId} />
          </div>

          {/* Secured banner */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/70 leading-relaxed">
              <strong>Direct Settlement:</strong> Payments route directly to our bank account. Securely verified and processed by <strong>MyMobPay UPI Gateway</strong>.
            </p>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-purple-600 via-[#d364ff] to-[#be38f3] text-white hover:scale-[1.01] transition-transform shadow-[0_0_25px_rgba(190,56,243,0.2)] font-semibold text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Connecting to gateway...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Pay Now
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
