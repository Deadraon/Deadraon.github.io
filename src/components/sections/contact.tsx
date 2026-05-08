"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  return (
    <section ref={ref} id="contact" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className={cn("lg:col-span-2 space-y-6 transition-all duration-700 delay-100", inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <a href="mailto:hello@deadraon.dev" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">hello@deadraon.dev</p>
                  </div>
                </a>
                <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-emerald-500 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-sm font-medium">Chat Now</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <h3 className="font-bold text-lg mb-2">Response Time</h3>
              <p className="text-white/80 text-sm">I typically respond within <strong className="text-white">24 hours</strong>. For urgent projects, WhatsApp is fastest.</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium">Currently available for work</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={cn("lg:col-span-3 transition-all duration-700 delay-200", inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Message Received!</h3>
                <p className="text-muted-foreground mb-6">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                <Button onClick={() => setSent(false)} variant="outline">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl border border-border bg-card">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[{ name: "name", label: "Full Name", placeholder: "John Doe" },
                    { name: "email", label: "Email Address", placeholder: "john@example.com", type: "email" }
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium mb-2">{f.label}</label>
                      <input name={f.name} type={f.type || "text"} placeholder={f.placeholder} required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select name="projectType" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                    <option value="">Select a service</option>
                    <option>Web Development</option>
                    <option>App Development</option>
                    <option>UI/UX Design</option>
                    <option>API Integration</option>
                    <option>Maintenance & Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input name="subject" placeholder="Tell me about your project" required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea name="message" rows={5} placeholder="Describe your project requirements, timeline, and budget..." required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
