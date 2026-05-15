"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, ExternalLink, ArrowRight } from "lucide-react";

const projects = [
  {
    id: "1",
    title: "GainIq App",
    description: "Cross-platform fitness tracker with workout logging, progress charts, and full Paytm API integration.",
    image: "https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=800&q=80",
    tags: ["Flutter", "Dart", "Firebase", "Paytm API"],
    category: "app",
    github: "https://github.com/Deadraon/gainiq",
    live: "https://gainiq-ten.vercel.app",
    featured: true,
  },
  {
    id: "2",
    title: "Lifeline Hospital",
    description: "Full-stack hospital management system with patient records, scheduling, and billing features.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "web",
    github: "https://github.com/Deadraon/lifeline-hospital",
    live: "https://lifeline-hospital-phi.vercel.app",
    featured: true,
  },
  {
    id: "3",
    title: "Hotel Booking Platform",
    description: "Comprehensive hotel booking and management platform with responsive design and modern UX.",
    image: "https://images.unsplash.com/photo-1566073171639-4d9ffcb25512?w=800&q=80",
    tags: ["React", "JavaScript", "Node.js"],
    category: "web",
    github: "https://github.com/Deadraon/hotel_test_full",
    live: "https://hotel-test-full.vercel.app",
    featured: true,
  },
  {
    id: "4",
    title: "Shivaay Fitness",
    description: "Modern landing page and management interface for a fitness gym, complete with custom CSS styling.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    tags: ["React", "JavaScript", "CSS"],
    category: "web",
    github: "https://github.com/Deadraon/shivaay_fitness",
    live: "https://shivaay-fitness.vercel.app",
    featured: true,
  },
];

const filters = ["all", "web", "app", "ui", "backend"];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

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
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={cn(
                "group relative rounded-2xl border border-border bg-card overflow-hidden card-hover transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                {/* Overlay links */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors border border-white/20">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-primary/80 backdrop-blur-sm rounded-lg text-white hover:bg-primary transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
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
          ))}
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
