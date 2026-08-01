"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/button";

const skillGroups = [
  {
    title: "Frontend",
    color: "from-blue-400 to-sky-400",
    barColor: "from-blue-600 to-sky-500",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    title: "Backend",
    color: "from-blue-400 to-cyan-400",
    barColor: "from-blue-500 to-cyan-500",
    skills: [
      { name: "Node.js / Express", level: 90 },
      { name: "MongoDB", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "REST APIs", level: 95 },
    ],
  },
  {
    title: "Mobile",
    color: "from-cyan-400 to-emerald-400",
    barColor: "from-cyan-500 to-emerald-500",
    skills: [
      { name: "Flutter / Dart", level: 90 },
      { name: "Firebase", level: 85 },
      { name: "React Native", level: 75 },
      { name: "App Publishing", level: 88 },
    ],
  },
  {
    title: "Tools & DevOps",
    color: "from-emerald-400 to-green-400",
    barColor: "from-emerald-500 to-green-500",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Docker", level: 75 },
      { name: "Vercel / Azure", level: 85 },
      { name: "Figma", level: 80 },
    ],
  },
];

const technologies = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "Flutter", "Dart", "Firebase", "Supabase",
  "TailwindCSS", "Framer Motion", "Clerk", "Stripe", "Docker", "Vercel",
  "Git", "GitHub", "Figma", "REST APIs", "GraphQL", "Azure",
];

export function SkillsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Expertise</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {skillGroups.map((group, gi) => (
            <GlassCard
              key={group.title}
              rounded="rounded-2xl"
              className={cn("p-6 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
              style={{ transitionDelay: `${gi * 100}ms` }}
            >
              <h3 className="text-lg font-bold mb-6 text-sky-400">
                {group.title}
              </h3>
              <div className="space-y-5">
                {group.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5 font-semibold">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-slate-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: inView ? `${skill.level}%` : "0%", transitionDelay: `${gi * 100 + si * 150}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Tech bubbles */}
        <div className={cn("transition-all duration-700 delay-500", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <h3 className="text-center text-lg font-semibold mb-6 text-white/60">Full Technology Stack</h3>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {technologies.map((tech) => (
              <GlassCard
                key={tech}
                rounded="rounded-full"
                hoverScale
                className="px-4 py-2 cursor-default"
              >
                <span className="text-sm font-medium text-white/85 relative z-10">{tech}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
