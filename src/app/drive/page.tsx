"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaTelegramPlane } from "react-icons/fa";

export default function DriveLoginPage() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneBody, setPhoneBody] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1 = Phone number, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes expiration timer

  // Check if session is already active
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/drive/check-session");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/drive/home");
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, [router]);

  // Countdown timer trigger
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneBody) return;
    setLoading(true);
    setError("");

    const fullPhoneNumber = `${countryCode.trim()}${phoneBody.trim()}`;

    try {
      const res = await fetch("/api/drive/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your Telegram app!");
        setTimer(120); // Reset timer to 120 seconds
        setStep(2);
      } else {
        setError(data.error || "Failed to send code. Make sure you included country code (e.g. +1234567890)");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/drive/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Successfully logged in!");
        router.push("/drive/home");
      } else {
        setError(data.error || "Invalid code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,90,213,0.05)_0%,transparent_50%)] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <FaTelegramPlane className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground font-mono text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background decoration elements (mesh glow) */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#8A2BE2]/8 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md glass border border-white/[0.06] rounded-2xl p-8 relative z-10 shadow-2xl hover:border-white/10 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 border border-purple-400/20 shadow-lg shadow-purple-500/20 flex items-center justify-center mb-4 text-white hover:scale-105 active:scale-95 transition-all duration-300">
            <FaTelegramPlane className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2.5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,112,243,0.2)]">
            Deadraon Drive
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Cloud storage backed by your personal Telegram account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+91"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20 bg-white/[0.02] border border-white/10 rounded-xl px-3 py-3 text-white text-center focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                  required
                  disabled={loading}
                />
                <input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phoneBody}
                  onChange={(e) => setPhoneBody(e.target.value)}
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                India (+91) is default. You can edit the country code if needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !phoneBody}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                <span>Verification Code</span>
                {timer > 0 ? (
                  <span className="text-xs font-mono text-primary font-semibold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                    Expires in {formatTimer(timer)}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-red-400 font-semibold bg-red-950/30 px-2.5 py-0.5 rounded-full border border-red-500/20">
                    Expired
                  </span>
                )}
              </label>
              <input
                id="code"
                type="text"
                placeholder="Enter 5-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-center tracking-widest text-lg disabled:opacity-50"
                required
                disabled={loading || timer <= 0}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {timer > 0 
                  ? "Enter the code sent to your Telegram app." 
                  : "The code request session has expired. Please go back to request a new code."}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !code || timer <= 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCode("");
                setError("");
                setTimer(120);
              }}
              disabled={loading}
              className="w-full bg-transparent hover:bg-white/[0.04] border border-white/10 text-white/80 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {timer <= 0 ? "Request New Code" : "Back to Phone Number"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
