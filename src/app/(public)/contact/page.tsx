import { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact";
import { FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Hire Kunal Chauhan | Contact Deadraon Full Stack Developer",
  description: "Get in touch with Kunal Chauhan (@Deadraon) for custom software engineering, Next.js web projects, Flutter cross-platform applications, or consulting. Contact via email, WhatsApp, or GitHub.",
  keywords: ["Hire Next.js Developer", "Hire Flutter Developer India", "Freelance Software Engineer Contact", "Deadraon email", "Deadraon phone", "Kunal Chauhan contact"],
};

const socials = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/Deadraon", brandColor: "text-white group-hover:text-black", bgColor: "hover:bg-white border-white/10", textColor: "text-white group-hover:text-black" },
  { icon: FaEnvelope, label: "Email", href: "mailto:deadraon@gmail.com", brandColor: "text-red-500 group-hover:text-white", bgColor: "hover:bg-red-500 border-red-500/20", textColor: "text-white group-hover:text-white" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/916396714325", brandColor: "text-green-500 group-hover:text-white", bgColor: "hover:bg-green-500 border-green-500/20", textColor: "text-white group-hover:text-white" },
];

export default function ContactPage() {
  return (
    <div className="pt-14 relative overflow-hidden">
      {/* SaaS AI glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0070F3]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#8A2BE2]/10 rounded-full blur-[100px] pointer-events-none" />

      <section className="section-padding pb-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Hire Me</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            Start a <span className="text-sky-400">Conversation</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Whether it&apos;s a new project, a quick question, or just saying hi — I&apos;m always happy to chat.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap gap-4 justify-center">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl border bg-black/50 backdrop-blur-md transition-all duration-300 ${s.bgColor}`}>
                <s.icon className={`w-5 h-5 transition-colors ${s.brandColor}`} />
                <span className={`${s.textColor} font-medium transition-colors`}>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div id="contact-form" className="relative z-10 scroll-mt-24">
        <ContactSection />
      </div>
    </div>
  );
}
