"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/button";
import { Mail, MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
        form.reset();
        toast.success("Message sent! I'll get back to you within 24 hours.");
      } else throw new Error();
    } catch {
      toast.error("Failed to send. Please email me directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none"
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
  };

  return (
    <section ref={ref} id="contact" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info column */}
          <div className={cn("lg:col-span-2 space-y-5 transition-all duration-700 delay-100", inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
            <GlassCard rounded="rounded-2xl" className="p-6">
              <h3 className="font-semibold mb-4 text-white">Quick Contact</h3>
              <div className="space-y-4">
                <a href="mailto:deadraon@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-sm font-medium">deadraon@gmail.com</p>
                  </div>
                </a>
                <a href="https://wa.me/916396714325" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">WhatsApp</p>
                    <p className="text-sm font-medium">Chat Now</p>
                  </div>
                </a>
              </div>
            </GlassCard>

            <GlassCard rounded="rounded-2xl" className="p-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/15 to-sky-600/15" />
              <h3 className="font-bold text-lg mb-2 text-white relative z-10">Response Time</h3>
              <p className="text-white/70 text-sm relative z-10">
                I typically respond within <strong className="text-white">24 hours</strong>. For urgent projects, WhatsApp is fastest.
              </p>
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-white/80">Currently available for work</span>
              </div>
            </GlassCard>
          </div>

          {/* Form column */}
          <div className={cn("lg:col-span-3 transition-all duration-700 delay-200", inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
            {sent ? (
              <GlassCard rounded="rounded-2xl" className="h-full flex flex-col items-center justify-center text-center p-12">
                <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Message Received!</h3>
                <p className="text-white/60 mb-6">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Send Another
                </button>
              </GlassCard>
            ) : (
              <GlassCard rounded="rounded-2xl" className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: "name", label: "Full Name", placeholder: "Enter your name" },
                      { name: "email", label: "Email Address", placeholder: "Enter your email", type: "email" },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium mb-2 text-white/80">{f.label}</label>
                        <input
                          name={f.name}
                          type={f.type || "text"}
                          placeholder={f.placeholder}
                          required
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Project Type</label>
                    <select
                      name="projectType"
                      className={inputClass}
                      style={{ ...inputStyle, appearance: "none" as const }}
                    >
                      <option value="" className="bg-gray-900">Select a service</option>
                      <option className="bg-gray-900">Web Development</option>
                      <option className="bg-gray-900">App Development</option>
                      <option className="bg-gray-900">UI/UX Design</option>
                      <option className="bg-gray-900">API Integration</option>
                      <option className="bg-gray-900">Maintenance & Support</option>
                      <option className="bg-gray-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Subject</label>
                    <input
                      name="subject"
                      placeholder="Tell me about your project"
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Describe your project requirements, timeline, and budget..."
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
