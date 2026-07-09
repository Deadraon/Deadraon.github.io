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
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaTelegramPlane className="h-12 w-12 text-[#24A1DE] animate-pulse" />
          <p className="text-gray-400 font-mono text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background decoration elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#24A1DE]/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="w-full max-w-md glass border border-white/[0.08] rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-[#24A1DE]/10 border border-[#24A1DE]/20 flex items-center justify-center mb-4 text-[#24A1DE]">
            <FaTelegramPlane className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Deadraon Drive</h1>
          <p className="text-sm text-gray-400 mt-2 text-center">
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+91"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 text-white text-center focus:outline-none focus:border-[#24A1DE] focus:ring-1 focus:ring-[#24A1DE] transition-all font-mono"
                  required
                  disabled={loading}
                />
                <input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phoneBody}
                  onChange={(e) => setPhoneBody(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#24A1DE] focus:ring-1 focus:ring-[#24A1DE] transition-all font-mono"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                India (+91) is default. You can edit the country code if needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !phoneBody}
              className="w-full bg-[#24A1DE] hover:bg-[#24A1DE]/90 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#24A1DE]/25 flex items-center justify-center gap-2 cursor-pointer"
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                placeholder="Enter 5-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#24A1DE] focus:ring-1 focus:ring-[#24A1DE] transition-all font-mono text-center tracking-widest text-lg"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the code sent to your Telegram app.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full bg-[#24A1DE] hover:bg-[#24A1DE]/90 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#24A1DE]/25 flex items-center justify-center gap-2 cursor-pointer"
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
              }}
              disabled={loading}
              className="w-full bg-transparent hover:bg-white/[0.02] border border-white/10 text-white/70 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Back to Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
