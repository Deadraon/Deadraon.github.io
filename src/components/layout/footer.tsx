import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";

const footerLinks = {
  Pages: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services and Pricing", href: "/services" },
    { label: "Contact", href: "/contact" },
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
  ],
};

const socials = [
  { icon: Github, href: "https://github.com/Deadraon", label: "GitHub" },
  { icon: Mail, href: "mailto:chauhankunal695@gmail.com", label: "Email" },
  { icon: MessageCircle, href: "https://wa.me/916396714325", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border mt-20">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Dead</span>
                <span>raon</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              Full Stack Developer crafting premium digital experiences. From concept
              to deployment — I build products that convert and scale.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
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
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Deadraon. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>by MOB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
