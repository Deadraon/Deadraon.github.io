"use client";

import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/button";
import { Globe, Smartphone, Palette, Plug, Wrench, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Full-stack web applications built with Next.js, React, and Node.js. Fast, scalable, and SEO-optimized.",
    features: ["Next.js / React", "REST & GraphQL APIs", "Database Design", "Deployment & CI/CD"],
    color: "from-blue-600 to-sky-600",
    href: "/services#web",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Cross-platform mobile applications using Flutter. One codebase, native-quality experience on iOS & Android.",
    features: ["Flutter / Dart", "iOS & Android", "State Management", "App Store Deployment"],
    color: "from-sky-600 to-blue-600",
    href: "/services#app",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Modern, conversion-focused interfaces. From wireframes to pixel-perfect designs that users love.",
    features: ["Figma Prototypes", "Design Systems", "Responsive Layouts", "Animation & Motion"],
    color: "from-blue-500 to-indigo-600",
    href: "/services#ui",
  },
  {
    icon: Plug,
    title: "API Integration",
    description: "Connect your product to third-party services, payment gateways, and external APIs seamlessly.",
    features: ["Payment Gateways", "OAuth / Auth Flows", "Webhooks", "Real-time Systems"],
    color: "from-indigo-600 to-sky-600",
    href: "/services#api",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Ongoing support, performance optimization, bug fixes, and feature updates to keep your app running flawlessly.",
    features: ["Bug Fixes", "Performance Audit", "Security Updates", "Feature Additions"],
    color: "from-sky-500 to-blue-600",
    href: "/services#maintenance",
  },
];

export function ServicesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">What I Do</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Services I <span className="gradient-text">Offer</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            End-to-end digital product development — from design to deployment, I handle it all with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <GlassCard
              key={service.title}
              hoverScale
              rounded="rounded-2xl"
              className={cn(
                "group p-6 cursor-pointer transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Icon */}
              <div className={cn("w-12 h-12 rounded-xl bg-blue-600 border border-blue-400 mb-4 flex items-center justify-center shadow-md", service.color)}>
                <service.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed font-medium">{service.description}</p>

              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={service.href} className="text-sky-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 group-hover:text-white transition-all">
                Learn more <ArrowRight className="w-3 h-3" />
              </Link>
            </GlassCard>
          ))}
        </div>

        <div className={cn("text-center mt-12 transition-all duration-700 delay-500", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-md"
          >
            View All Services & Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
