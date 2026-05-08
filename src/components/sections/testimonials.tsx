"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechVentures Inc.",
    avatar: "SJ",
    content: "Deadraon delivered our SaaS dashboard 2 weeks ahead of schedule. The code quality and UI design exceeded our expectations. Absolutely recommend!",
    rating: 5,
    project: "SaaS Dashboard",
    color: "from-purple-500 to-blue-500",
  },
  {
    name: "Ahmed Al-Rashid",
    role: "Founder",
    company: "HealthApp Arabia",
    avatar: "AA",
    content: "Built our entire Flutter health app from scratch. The attention to detail, animations, and backend integration were world-class. 5 stars!",
    rating: 5,
    project: "Mobile App",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    company: "EduTech Solutions",
    avatar: "PS",
    content: "Our e-learning platform is now 3x faster and beautifully designed. Deadraon understood our vision instantly and brought it to life perfectly.",
    rating: 5,
    project: "Web Platform",
    color: "from-cyan-500 to-emerald-500",
  },
  {
    name: "Marcus Williams",
    role: "CTO",
    company: "Finova Labs",
    avatar: "MW",
    content: "Professional, fast, and brilliant. The API integrations and real-time features he built are rock solid in production. Will hire again!",
    rating: 5,
    project: "FinTech App",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Olivia Chen",
    role: "Startup Founder",
    company: "StyleHive",
    avatar: "OC",
    content: "Transformed our Figma designs into a pixel-perfect e-commerce site. Mobile performance is exceptional. Our conversions increased by 40%!",
    rating: 5,
    project: "E-Commerce",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Daniel Foster",
    role: "Director",
    company: "PropTech Global",
    avatar: "DF",
    content: "Complex real estate platform delivered flawlessly. Admin dashboard, client portal, and analytics — all working perfectly. Outstanding work.",
    rating: 5,
    project: "Real Estate Platform",
    color: "from-indigo-500 to-purple-500",
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Client Feedback</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Real words from real clients about their experience working with me.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "relative p-6 rounded-2xl border border-border bg-card card-hover transition-all duration-700 group",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0", t.color)}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} at {t.company}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t.project}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
