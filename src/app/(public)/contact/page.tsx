import { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact";
import { Github, Linkedin, Twitter, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Contact — Deadraon" };

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/deadraon", color: "hover:text-white hover:bg-gray-800" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/deadraon", color: "hover:text-white hover:bg-blue-600" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/deadraon", color: "hover:text-white hover:bg-black" },
  { icon: Mail, label: "Email", href: "mailto:hello@deadraon.dev", color: "hover:text-white hover:bg-primary" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/+1234567890", color: "hover:text-white hover:bg-emerald-600" },
];

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="section-padding pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Hire Me</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Whether it&apos;s a new project, a quick question, or just saying hi — I&apos;m always happy to chat.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap gap-3 justify-center">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground text-sm font-medium transition-all duration-200 ${s.color}`}>
                <s.icon className="w-4 h-4" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
