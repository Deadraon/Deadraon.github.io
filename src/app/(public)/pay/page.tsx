"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Script from "next/script";
import { CreditCard, Loader2, Send, ShieldCheck, IndianRupee, User, Mail, Phone, FileText, Lock, History, CheckCircle2, XCircle, Clock } from "lucide-react";

function PaymentForm() {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gateway, setGateway] = useState<"mymobpay" | "cashfree">("mymobpay");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    amount: "",
    projectId: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [payments, setPayments] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch payments function
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payment/history");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPayments();
      
      // Set up polling interval if there are pending payments
      const hasPending = payments.some((p) => p.status === "pending");
      if (hasPending) {
        const interval = setInterval(fetchPayments, 8000);
        return () => clearInterval(interval);
      }
    }
  }, [isLoaded, user, payments.length]);

  // Prefill form from query parameters or user session
  useEffect(() => {
    if (isLoaded) {
      setFormData((prev) => ({
        name: prev.name || searchParams.get("name") || searchParams.get("clientName") || user?.fullName || user?.username || "",
        email: prev.email || searchParams.get("email") || searchParams.get("clientEmail") || user?.primaryEmailAddress?.emailAddress || "",
        phone: prev.phone || searchParams.get("phone") || "",
        note: prev.note || searchParams.get("note") || searchParams.get("projectName") || "",
        amount: prev.amount || searchParams.get("amount") || searchParams.get("budget") || "",
        projectId: prev.projectId || searchParams.get("projectId") || "",
      }));
    }
  }, [searchParams, user, isLoaded]);

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
        body: JSON.stringify({ ...formData, gateway }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment.");
      }

      if (data.isCashfree) {
        toast.success("Payment session created! Initializing Cashfree...");
        
        // Initialize Cashfree checkout
        const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
        const Cashfree = (window as any).Cashfree;
        if (!Cashfree) {
          throw new Error("Cashfree SDK failed to load. Please refresh and try again.");
        }
        
        const cashfree = Cashfree({ mode });
        cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self"
        });
      } else {
        toast.success("Payment order created! Redirecting to UPI gateway...");
        // Redirect directly to the MyMobPay checkout page
        window.location.href = data.paymentUrl;
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handlePresetClick = (amountValue: number) => {
    setFormData((prev) => ({ ...prev, amount: amountValue.toString() }));
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
            <Lock className="w-3.5 h-3.5 text-[#be38f3]" />
            <span>Secure Checkout Gateway</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mt-1 mb-3 tracking-tight">
            Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d364ff] to-[#be38f3] drop-shadow-[0_0_15px_rgba(190,56,243,0.2)]">Payment</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Pay securely to <strong className="text-white">Deadraon Development</strong>.
          </p>
        </div>

        {/* Payment Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#080810]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-black/80 relative overflow-hidden"
        >
          {/* Subtle top brand border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be38f3] to-transparent" />
          
          {/* Amount Section - Primary Focus */}
          <div className="bg-[#be38f3]/[0.02] border border-[#be38f3]/15 p-5 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(190,56,243,0.02)]">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#be38f3]/30 to-transparent" />
            <label className="block text-center text-[10px] font-bold text-[#be38f3] uppercase tracking-widest mb-3">
              Enter Amount to Pay <span className="text-[#be38f3]">*</span>
            </label>
            <div className="flex items-center justify-center gap-2 max-w-[240px] mx-auto border-b-2 border-[#be38f3]/20 focus-within:border-[#be38f3] pb-1.5 transition-all">
              <span className="text-3xl font-extrabold text-[#be38f3] select-none mb-1">₹</span>
              <input
                name="amount"
                type="number"
                min="1"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
                required
                className="bg-transparent text-white text-4xl font-black focus:outline-none placeholder:text-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                style={{ width: formData.amount ? `${Math.max(1, formData.amount.length) * 22 + 10}px` : '40px' }}
              />
            </div>
            
            {/* Quick-Select Preset Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {[1000, 5000, 10000, 25000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#be38f3]/5 border border-[#be38f3]/10 text-white/70 hover:text-white hover:bg-[#be38f3]/25 hover:border-[#be38f3]/40 active:scale-95 transition-all shadow-sm"
                >
                  ₹{preset.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <p className="text-center text-[9px] text-white/30 tracking-wide uppercase mt-4">
              Instant settlement via secure payment transfer
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-4 border-t border-white/[0.05]">
            <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">
              Select Payment Method <span className="text-white/30">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option 1: MyMobPay */}
              <div
                onClick={() => setGateway("mymobpay")}
                className={`relative group p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[125px] ${gateway === "mymobpay" ? "bg-[#be38f3]/[0.06] border-[#be38f3] shadow-[0_0_20px_rgba(190,56,243,0.15)]" : "border-white/5 bg-[#0d0d15]/30 hover:border-white/20 hover:bg-[#0d0d15]/50"}`}
              >
                {/* Large Background Watermark Logo (QR Code) */}
                <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <rect x="5" y="5" width="6" height="6" />
                    <rect x="13" y="5" width="6" height="6" />
                    <rect x="5" y="13" width="6" height="6" />
                    <rect x="13" y="13" width="2" height="2" />
                    <rect x="17" y="17" width="2" height="2" />
                    <rect x="13" y="17" width="2" height="2" />
                    <rect x="17" y="13" width="2" height="2" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black tracking-tight text-white flex items-center">
                        <span className="text-[#be38f3]">My</span>MobPay
                      </span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider scale-90 origin-left">
                        Recommended
                      </span>
                    </div>
                    
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gateway === "mymobpay" ? "border-[#be38f3]" : "border-white/30"}`}>
                      {gateway === "mymobpay" && <div className="w-2 h-2 rounded-full bg-[#be38f3]" />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/95">QR Payments</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      Scan QR code with any UPI app (GPay, PhonePe, Paytm, BHIM) to pay instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Cashfree */}
              <div
                onClick={() => setGateway("cashfree")}
                className={`relative group p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[125px] ${gateway === "cashfree" ? "bg-[#0070F3]/[0.06] border-[#0070F3] shadow-[0_0_20px_rgba(0,112,243,0.15)]" : "border-white/5 bg-[#0d0d15]/30 hover:border-white/20 hover:bg-[#0d0d15]/50"}`}
              >
                {/* Large Background Watermark Logo (Credit Card) */}
                <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <rect x="6" y="14" width="4" height="2" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black tracking-tight text-white flex items-center">
                        <span className="text-[#0070F3]">Cash</span>free
                      </span>
                    </div>
                    
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gateway === "cashfree" ? "border-[#0070F3]" : "border-white/30"}`}>
                      {gateway === "cashfree" && <div className="w-2 h-2 rounded-full bg-[#0070F3]" />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/95">Mobile UPI & Cards</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      Pay using Credit/Debit Cards, NetBanking, Wallets, or Mobile UPI checkout.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Secondary Client Details */}
          <div className="space-y-4 pt-4 border-t border-white/[0.05]">
            
            {/* User Session Info Badge */}
            {mounted && isLoaded && user && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-4 backdrop-blur-md animate-fade-in">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User avatar"}
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#be38f3] flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">
                    Paying as <span className="text-[#be38f3]">{user.fullName || user.username}</span>
                  </p>
                  <p className="text-[10px] text-white/40 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <div className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold select-none uppercase tracking-wider">
                  Verified Client
                </div>
              </div>
            )}

            <h3 className="text-xs font-medium text-white/40 mb-1">Billing Details</h3>
            
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                  Client Name <span className="text-white/30">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/20 group-focus-within:text-[#be38f3] group-hover:text-white/40 transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 h-10 rounded-lg border border-white/5 bg-[#0d0d15]/30 hover:bg-[#0d0d15]/50 text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all placeholder:text-white/15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                  Email Address <span className="text-white/30">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/20 group-focus-within:text-[#be38f3] group-hover:text-white/40 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 h-10 rounded-lg border border-white/5 bg-[#0d0d15]/30 hover:bg-[#0d0d15]/50 text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all placeholder:text-white/15"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-white/30">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/20 group-focus-within:text-[#be38f3] group-hover:text-white/40 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-9 pr-3 py-2 h-10 rounded-lg border border-white/5 bg-[#0d0d15]/30 hover:bg-[#0d0d15]/50 text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all placeholder:text-white/15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                  Payment For / Note <span className="text-white/30">(Optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 flex items-center justify-center text-[#be38f3] group-hover:text-white/40 transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="e.g. Website development milestone 1"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/5 bg-[#0d0d15]/30 hover:bg-[#0d0d15]/50 text-white text-xs focus:outline-none focus:border-[#be38f3]/50 focus:ring-1 focus:ring-[#be38f3]/25 transition-all resize-none placeholder:text-white/15"
                  />
                </div>
              </div>
            </div>
            
            {/* Hidden field for project linkage */}
            <input type="hidden" name="projectId" value={formData.projectId} />
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
          
          {/* Brand Badges / SSL Certification Row */}
          <div className="pt-4 border-t border-white/[0.05] flex flex-col items-center justify-center gap-3">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure 256-bit SSL Payment Gateway
            </span>
            <div className="flex items-center justify-center gap-3 select-none">
              <div className="h-8 px-3.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center group cursor-pointer" title="Google Pay">
                <img 
                  src="/google-pay.svg" 
                  alt="Google Pay" 
                  className="h-[22px] w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                />
              </div>
              <div className="h-8 px-3.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center group cursor-pointer" title="PhonePe">
                <img 
                  src="/phonepe.svg" 
                  alt="PhonePe" 
                  className="h-[22px] w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                />
              </div>
              <div className="h-8 px-3.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center group cursor-pointer" title="Paytm">
                <img 
                  src="/paytm.svg" 
                  alt="Paytm" 
                  className="h-[20px] w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                />
              </div>
              <div className="h-8 px-3.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center group cursor-pointer" title="UPI">
                <img 
                  src="/upi.svg" 
                  alt="UPI" 
                  className="h-[18px] w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                />
              </div>
            </div>
          </div>
        </form>

        {/* Payment History List (Below the payment card) */}
        {mounted && isLoaded && user && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#be38f3]" />
                Recent Payments
              </h2>
              {historyLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/30" />}
            </div>

            {historyLoading ? (
              <div className="p-8 rounded-3xl border border-white/[0.05] bg-[#080810]/20 backdrop-blur-2xl text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#be38f3]/60 mb-2" />
                <p className="text-xs text-white/40">Loading payment history...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 rounded-3xl border border-white/[0.05] bg-[#080810]/20 backdrop-blur-2xl text-center">
                <p className="text-xs text-white/40">No payment history found for this account.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment: any) => (
                  <div
                    key={payment._id}
                    className="p-4 rounded-2xl border border-white/[0.05] bg-[#080810]/30 backdrop-blur-md flex items-center justify-between gap-4 transition-all hover:border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {payment.status === "success" && (
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {payment.status === "pending" && (
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {payment.status === "failed" && (
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white/80 truncate">
                          {payment.note || "Milestone Payment"}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-white/40">
                          <span>
                            {new Intl.DateTimeFormat("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(payment.createdAt))}
                          </span>
                          {payment.utr && (
                            <>
                              <span className="text-white/10">•</span>
                              <span className="font-mono truncate">UTR: {payment.utr}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-white">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-white/40">
                        {payment.paymentMode || "UPI"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
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
