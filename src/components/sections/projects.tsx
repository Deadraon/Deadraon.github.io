"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/button";
import { Github, ExternalLink, ArrowRight } from "lucide-react";

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
  published: boolean;
  order: number;
}

const filters = ["all", "web", "app", "ui", "backend"];

function SkeletonCard() {
  return (
    <GlassCard rounded="rounded-2xl" className="overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-white/10 rounded-full w-3/4" />
        <div className="h-3 bg-white/8 rounded-full w-full" />
        <div className="h-3 bg-white/8 rounded-full w-5/6" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-20 bg-white/10 rounded-full" />
        </div>
      </div>
    </GlassCard>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        const featured = (data.projects || []).filter((p: PortfolioProject) => p.featured);
        setProjects(featured);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => activeFilter === "all" || p.category === activeFilter);

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className={cn("text-center mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">My Work</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real-world products built with care. Each project represents a problem solved and a client satisfied.
          </p>
        </div>

        {/* Filters */}
        <div className={cn("flex flex-wrap gap-2 justify-center mb-10 transition-all duration-700 delay-100", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200",
                activeFilter === f
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-white/70 hover:text-white"
              )}
              style={activeFilter !== f ? {
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              } : undefined}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-white/50">
              {projects.length === 0 ? "No projects yet." : "No projects in this category."}
            </div>
          ) : (
            filtered.map((project, i) => (
              <GlassCard
                key={project._id}
                rounded="rounded-2xl"
                hoverScale
                className={cn(
                  "group overflow-hidden transition-all duration-700",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-4xl font-black text-white/20">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Overlay links */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-white hover:scale-110 transition-transform"
                        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-white hover:scale-110 transition-transform bg-gradient-to-r from-purple-600 to-blue-600">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">{project.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full text-white/70 bg-white/10 border border-white/15">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
