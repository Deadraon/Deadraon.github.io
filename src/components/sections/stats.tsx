"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/button";

const stats = [
  { value: "50+", label: "Projects Delivered", color: "from-blue-400 to-sky-400" },
  { value: "30+", label: "Happy Clients", color: "from-blue-400 to-cyan-400" },
  { value: "2+", label: "Years Experience", color: "from-cyan-400 to-emerald-400" },
  { value: "99%", label: "Client Satisfaction", color: "from-emerald-400 to-green-400" },
];

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-4 px-0">
      <GlassCard rounded="rounded-3xl" className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "text-center transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={cn("text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent drop-shadow-lg", stat.color)}>
                {stat.value}
              </div>
              <p className="text-sm text-white/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
