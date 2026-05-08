"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50+", label: "Projects Delivered", color: "from-purple-600 to-blue-600" },
  { value: "30+", label: "Happy Clients", color: "from-blue-600 to-cyan-500" },
  { value: "4+", label: "Years Experience", color: "from-cyan-500 to-emerald-500" },
  { value: "99%", label: "Client Satisfaction", color: "from-emerald-500 to-green-500" },
];

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-16 px-4 border-y border-border bg-card/50">
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
            <div className={cn("text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent", stat.color)}>
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
