"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { toast } from "sonner";

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickMessageModal({ isOpen, onClose }: QuickMessageModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Quick Mobile Message from ${name}`,
          message,
          projectType: "Mobile Quick Contact",
        }),
      });

      if (res.ok) {
        toast.success("Message sent! I'll get back to you within 24 hours.");
        setName("");
        setEmail("");
        setMessage("");
        onClose();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to send. Please email me directly at deadraon@gmail.com");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-zinc-950/90 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl overflow-hidden pointer-events-auto z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Send a message <span className="animate-bounce">👋</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  Have a quick question or project in mind? Drop a message!
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/60">Your Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-purple-500/40 text-white placeholder-white/30 transition duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/60">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-purple-500/40 text-white placeholder-white/30 transition duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/60">Message</label>
                <textarea
                  rows={4}
                  placeholder="What's on your mind?..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-blue-500 text-white placeholder-slate-400 resize-none transition duration-200"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white text-sm font-bold py-3.5 rounded-2xl transition duration-200 shadow-md active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {sending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
