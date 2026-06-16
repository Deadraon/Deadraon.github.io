"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, X, Loader2 } from "lucide-react";

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  longDesc: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
}

const filters = ["all", "web", "app", "ui", "backend"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="h-52 bg-secondary" />
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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => active === "all" || p.category === active);

  return (
    <div className="pt-14">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Portfolio</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            My <span className="gradient-text">Work &amp; Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg">Explore a selection of projects I&apos;ve built for clients and personal exploration.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-10 px-4">
        {filters.map((f) => (
          <button key={f} onClick={() => setActive(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${active === f ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-24 text-muted-foreground">
              {projects.length === 0 ? "No projects yet. Check back soon!" : "No projects in this category."}
            </div>
          ) : (
            filtered.map((project) => (
              <div key={project._id} className="group relative rounded-2xl border border-border bg-card overflow-hidden card-hover cursor-pointer" onClick={() => setSelected(project)}>
                <div className="relative h-52 overflow-hidden">
                  {project.image ? (
                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                      <span className="text-5xl font-black text-primary/30">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-white/20">View Case Study</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64">
              {selected.image ? (
                <Image src={selected.image} alt={selected.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                  <span className="text-7xl font-black text-primary/30">{selected.title.charAt(0)}</span>
                </div>
              )}
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{selected.longDesc || selected.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {selected.live && (
                  <Button asChild variant="gradient" className="flex-1">
                    <a href={selected.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /> Live Demo</a>
                  </Button>
                )}
                {selected.github && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={selected.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /> GitHub</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
