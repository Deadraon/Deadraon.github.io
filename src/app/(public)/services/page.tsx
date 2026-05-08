import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Globe, Smartphone, Palette, Plug, Wrench } from "lucide-react";

export const metadata: Metadata = { title: "Services — Deadraon" };

const services = [
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    tagline: "Full-Stack Web Applications",
    description: "I build modern, scalable web applications using the latest technologies. From landing pages to complex SaaS platforms, every project is engineered for performance, SEO, and conversion.",
    features: ["Next.js / React SPA & SSR", "RESTful & GraphQL APIs", "Database design & optimization", "Authentication & Authorization", "Payment gateway integration", "Real-time features with WebSockets", "SEO optimization", "CI/CD & deployment"],
    startingAt: "$800",
    color: "from-purple-500 to-blue-500",
    gradient: "bg-gradient-to-br from-purple-500/10 to-blue-500/10",
  },
  {
    id: "app",
    icon: Smartphone,
    title: "App Development",
    tagline: "Cross-Platform Mobile Apps",
    description: "Beautiful, high-performance mobile apps using Flutter — one codebase for iOS and Android. From MVP to production-ready apps with complex features and smooth animations.",
    features: ["Flutter / Dart development", "iOS & Android deployment", "Offline-first architecture", "Push notifications", "In-app purchases", "Camera, maps, sensors", "App Store optimization", "Firebase & cloud backend"],
    startingAt: "$1,200",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
  },
  {
    id: "ui",
    icon: Palette,
    title: "UI/UX Design",
    tagline: "User Experience That Converts",
    description: "Pixel-perfect designs built in Figma, then implemented with precision. I focus on usability, accessibility, and visual hierarchy that guides users toward your business goals.",
    features: ["Figma wireframes & prototypes", "Design systems & component libraries", "Responsive & mobile-first", "Micro-animations & interactions", "Brand identity alignment", "Accessibility (WCAG 2.1)", "Dark & light mode", "Handoff-ready assets"],
    startingAt: "$500",
    color: "from-cyan-500 to-teal-500",
    gradient: "bg-gradient-to-br from-cyan-500/10 to-teal-500/10",
  },
  {
    id: "api",
    icon: Plug,
    title: "API Integration",
    tagline: "Connect Everything Seamlessly",
    description: "Integrate your application with any third-party service — payment processors, CRMs, analytics tools, AI services, or custom APIs. Clean, documented, and maintainable code.",
    features: ["Stripe, PayPal payments", "Google, Apple OAuth", "Twilio SMS & WhatsApp", "SendGrid email automation", "OpenAI / Gemini AI", "Mapbox / Google Maps", "Webhook systems", "API documentation"],
    startingAt: "$400",
    color: "from-teal-500 to-emerald-500",
    gradient: "bg-gradient-to-br from-teal-500/10 to-emerald-500/10",
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Maintenance & Support",
    tagline: "Keep Your App Running Flawlessly",
    description: "Monthly retainer plans to keep your application up-to-date, secure, and performing at its best. Bug fixes, performance optimization, security patches, and minor feature additions.",
    features: ["Bug fixes & patches", "Performance optimization", "Security audits & updates", "Dependency upgrades", "Database maintenance", "Uptime monitoring", "Monthly reports", "Priority support"],
    startingAt: "$299/mo",
    color: "from-emerald-500 to-green-500",
    gradient: "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Services</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            What I Can <span className="gradient-text">Build For You</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            End-to-end digital product development. I handle design, development, and deployment so you can focus on growing your business.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {services.map((service, i) => (
            <div id={service.id} key={service.id} className={`p-8 rounded-3xl border border-border ${service.gradient} hover:border-primary/30 transition-all duration-300`}>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm text-primary font-medium">{service.tagline}</span>
                  <h2 className="text-3xl font-bold mt-1 mb-4">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting at</p>
                      <p className="text-2xl font-black gradient-text">{service.startingAt}</p>
                    </div>
                    <Button asChild variant="gradient">
                      <Link href={`/contact?service=${service.id}`}><Zap className="w-4 h-4" /> Get a Quote</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-500/10 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start? <span className="gradient-text">Let&apos;s Talk</span></h2>
          <p className="text-muted-foreground mb-8">Tell me about your project and I&apos;ll get back to you within 24 hours with a custom quote.</p>
          <Button asChild size="xl" variant="gradient">
            <Link href="/contact"><ArrowRight className="w-5 h-5" /> Start a Project</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
