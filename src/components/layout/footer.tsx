import Link from "next/link";
import { Code2, Github, Mail, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/button";

const footerLinks = {
  Pages: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services and Pricing", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  "Services & Pricing": [
    { label: "Web Development", href: "/services#web" },
    { label: "App Development", href: "/services#app" },
    { label: "UI/UX Design", href: "/services#ui" },
    { label: "API Integration", href: "/services#api" },
    { label: "Maintenance", href: "/services#maintenance" },
  ],
  Client: [
    { label: "Client Login", href: "/sign-in" },
    { label: "Project Dashboard", href: "/dashboard" },
    { label: "Hire Me", href: "/contact" },
    { label: "Get a Quote", href: "/contact#quote" },
    { label: "Make Payment", href: "/pay" },
  ],
};

const socials = [
  { icon: Github, href: "https://github.com/Deadraon", label: "GitHub" },
  { icon: Mail, href: "mailto:deadraon@gmail.com", label: "Email" },
  { icon: MessageCircle, href: "https://wa.me/916396714325", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 px-3 sm:px-4 md:px-6 pb-3">
      <GlassCard rounded="rounded-3xl" className="overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Dead</span>
                  <span>raon</span>
                </span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
                Full Stack Developer crafting premium digital experiences. From concept
                to deployment — I build products that convert and scale.
              </p>
              <div className="flex items-center gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-sm mb-4 text-white/80">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/45 hover:text-white/90 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Deadraon. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-white/40">
              <span>Built with</span>
              <span className="text-red-400">♥</span>
              <span>by MOB</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </footer>
  );
}
