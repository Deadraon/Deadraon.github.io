import { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Globe, Smartphone, Palette, Plug, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Full Stack App & Web Development Services | Deadraon Pricing",
  description: "Explore professional software services by Kunal Chauhan (@Deadraon). Mobile app development using Flutter, Next.js/React full-stack web systems, UI/UX designing, and API integrations with clear, cost-effective pricing packages.",
  keywords: ["Web Development Cost", "Mobile App Development Pricing", "Flutter developer cost", "Nextjs SaaS developer", "Figma design services", "freelance API integration", "Deadraon Services"],
};

const services = [
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    tagline: "Full-Stack Web Applications",
    description: "I build modern, scalable web applications using the latest technologies. From landing pages to complex SaaS platforms, every project is engineered for performance, SEO, and conversion.",
    features: ["Next.js / React SPA & SSR", "RESTful & GraphQL APIs", "Database design & optimization", "Authentication & Authorization", "Payment gateway integration", "Real-time features with WebSockets", "SEO optimization", "CI/CD & deployment"],
    startingAt: "₹11,999",
    color: "from-blue-600 to-sky-600",
    gradient: "bg-gradient-to-br from-blue-600/10 to-sky-600/10",
  },
  {
    id: "app",
    icon: Smartphone,
    title: "App Development",
    tagline: "Cross-Platform Mobile Apps",
    description: "Beautiful, high-performance mobile apps using Flutter — one codebase for iOS and Android. From MVP to production-ready apps with complex features and smooth animations.",
    features: ["Flutter / Dart development", "iOS & Android deployment", "Offline-first architecture", "Push notifications", "In-app purchases", "Camera, maps, sensors", "App Store optimization", "Firebase & cloud backend"],
    startingAt: "₹19,999",
    color: "from-sky-600 to-blue-600",
    gradient: "bg-gradient-to-br from-sky-600/10 to-blue-600/10",
  },
  {
    id: "ui",
    icon: Palette,
    title: "UI/UX Design",
    tagline: "User Experience That Converts",
    description: "Pixel-perfect designs built in Figma, then implemented with precision. I focus on usability, accessibility, and visual hierarchy that guides users toward your business goals.",
    features: ["Figma wireframes & prototypes", "Design systems & component libraries", "Responsive & mobile-first", "Micro-animations & interactions", "Brand identity alignment", "Accessibility (WCAG 2.1)", "Dark & light mode", "Handoff-ready assets"],
    startingAt: "₹6,499",
    color: "from-blue-500 to-indigo-600",
    gradient: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10",
  },
  {
    id: "api",
    icon: Plug,
    title: "API Integration",
    tagline: "Connect Everything Seamlessly",
    description: "Integrate your application with any third-party service — payment processors, CRMs, analytics tools, AI services, or custom APIs. Clean, documented, and maintainable code.",
    features: ["Stripe, PayPal payments", "Google, Apple OAuth", "Twilio SMS & WhatsApp", "SendGrid email automation", "OpenAI / Gemini AI", "Mapbox / Google Maps", "Webhook systems", "API documentation"],
    startingAt: "₹3,999",
    color: "from-indigo-600 to-sky-600",
    gradient: "bg-gradient-to-br from-indigo-600/10 to-sky-600/10",
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Maintenance & Support",
    tagline: "Keep Your App Running Flawlessly",
    description: "Monthly retainer plans to keep your application up-to-date, secure, and performing at its best. Bug fixes, performance optimization, security patches, and minor feature additions.",
    features: ["Bug fixes & patches", "Performance audit", "Security audits & updates", "Dependency upgrades", "Database maintenance", "Uptime monitoring", "Monthly reports", "Priority support"],
    startingAt: "₹2,499/mo",
    color: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-br from-sky-500/10 to-blue-600/10",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-14">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sky-400 text-sm font-bold uppercase tracking-wider">Services & Pricing</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            What I Can <span className="text-sky-400">Build For You</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            End-to-end digital product development. I handle design, development, and deployment so you can focus on growing your business.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {services.map((service) => (
            <GlassCard key={service.id} rounded="rounded-3xl" className="p-8 group hover:scale-[1.01] transition-transform duration-300">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center mb-6 shadow-md">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm text-sky-400 font-bold">{service.tagline}</span>
                  <h2 className="text-3xl font-bold mt-1 mb-4 text-white">{service.title}</h2>
                  <p className="text-slate-300 leading-relaxed mb-6 font-medium">{service.description}</p>
                  <div className="flex items-center gap-4">
                    <div>
                       <p className="text-xs text-slate-400 font-bold">Starting at</p>
                       <p className="text-2xl font-black text-sky-400">{service.startingAt}</p>
                    </div>
                      <Link
                        href={`/contact?service=${service.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-md hover:scale-[1.05] active:scale-[0.95] transition-all duration-200"
                      >
                        <Zap className="w-4 h-4" /> Get a Quote
                      </Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start? <span className="text-sky-400">Let&apos;s Talk</span></h2>
          <p className="text-slate-300 mb-8 font-medium">Tell me about your project and I&apos;ll get back to you within 24 hours with a custom quote.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-extrabold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-md hover:scale-[1.05] active:scale-[0.95] transition-all duration-200"
          >
            <ArrowRight className="w-5 h-5" /> Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
