"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, ExternalLink, ArrowRight, Loader2 } from "lucide-react";

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

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="h-48 bg-secondary" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-secondary rounded-full w-3/4" />
        <div className="h-3 bg-secondary rounded-full w-full" />
        <div className="h-3 bg-secondary rounded-full w-5/6" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-secondary rounded-full" />
          <div className="h-6 w-20 bg-secondary rounded-full" />
          <div className="h-6 w-14 bg-secondary rounded-full" />
        </div>
      </div>
    </div>
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
        // Only show featured projects on home page
        const featured = (data.projects || []).filter((p: PortfolioProject) => p.featured);
        setProjects(featured);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => activeFilter === "all" || p.category === activeFilter);

  return (
    <section ref={ref} className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className={cn("text-center mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">My Work</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
                "px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200",
                activeFilter === f
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              )}
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
            <div className="col-span-full text-center py-16 text-muted-foreground">
              {projects.length === 0 ? "No projects yet." : "No projects in this category."}
            </div>
          ) : (
            filtered.map((project, i) => (
              <div
                key={project._id}
                className={cn(
                  "group relative rounded-2xl border border-border bg-card overflow-hidden card-hover transition-all duration-700",
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
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                      <span className="text-4xl font-black text-primary/30">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  {/* Overlay links */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors border border-white/20">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 bg-primary/80 backdrop-blur-sm rounded-lg text-white hover:bg-primary transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link href="/portfolio">View All Projects <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
