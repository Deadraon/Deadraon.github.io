"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ArrowRight, X } from "lucide-react";

const projects = [
  { id: "1", title: "MediTrack Pro", category: "web", desc: "Full-stack hospital management system with appointments, billing, and analytics.", longDesc: "A comprehensive hospital management platform built with Next.js and MongoDB. Features include patient records management, appointment scheduling, billing with insurance support, real-time analytics dashboard, and role-based access for doctors, nurses, and administrators.", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80", tags: ["Next.js", "MongoDB", "TypeScript", "Tailwind", "Clerk"], github: "https://github.com", live: "https://example.com" },
  { id: "2", title: "FitPulse App", category: "app", desc: "AI-powered fitness tracker with personalized diet plans and workout logging.", longDesc: "Cross-platform fitness app built with Flutter. Integrates Google Gemini AI for personalized diet plan generation, includes workout logging, progress charts, body metrics tracking, and social features for sharing achievements.", image: "https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=1200&q=80", tags: ["Flutter", "Firebase", "Dart", "Gemini AI", "Riverpod"], github: "https://github.com", live: "https://example.com" },
  { id: "3", title: "ShopFlow E-Commerce", category: "web", desc: "Modern e-commerce platform with Stripe payments and admin dashboard.", longDesc: "Full-stack e-commerce solution with product management, shopping cart, Stripe payment integration, order tracking, inventory management, discount codes, and a rich admin dashboard with sales analytics.", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=1200&q=80", tags: ["React", "Node.js", "PostgreSQL", "Stripe", "Redux"], github: "https://github.com", live: "https://example.com" },
  { id: "4", title: "PropVista", category: "web", desc: "Real estate platform with property listings, virtual tours, and CRM.", longDesc: "Real estate marketplace platform featuring property listings with advanced filters, 360° virtual tours, mortgage calculator, agent CRM system, and lead management dashboard.", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80", tags: ["Next.js", "Supabase", "Mapbox", "TypeScript"], github: "https://github.com", live: "https://example.com" },
  { id: "5", title: "ChatFlow AI", category: "backend", desc: "AI chatbot platform with multi-model support and analytics.", longDesc: "Enterprise-grade AI chatbot platform supporting OpenAI GPT-4, Google Gemini, and Anthropic Claude. Features include conversation history, knowledge base training, webhook integrations, and usage analytics.", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80", tags: ["Node.js", "OpenAI", "Socket.io", "Redis", "MongoDB"], github: "https://github.com", live: "https://example.com" },
  { id: "6", title: "Rustic House", category: "ui", desc: "Premium luxury hotel website with booking and immersive UI.", longDesc: "Luxury hotel website with immersive full-screen hero, smooth scroll animations, room browsing with filters, online booking system with Razorpay integration, and admin portal.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80", tags: ["Next.js", "Framer Motion", "Razorpay", "Tailwind"], github: "https://github.com", live: "https://example.com" },
];

const filters = ["all", "web", "app", "ui", "backend"];

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null);

  const filtered = projects.filter((p) => active === "all" || p.category === active);

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-padding pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Portfolio</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            My <span className="gradient-text">Work & Projects</span>
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
          {filtered.map((project) => (
            <div key={project.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden card-hover cursor-pointer" onClick={() => setSelected(project)}>
              <div className="relative h-52 overflow-hidden">
                <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-white/20">View Case Study</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64">
              <Image src={selected.image} alt={selected.title} fill className="object-cover" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{selected.longDesc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <Button asChild variant="gradient" className="flex-1">
                  <a href={selected.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /> Live Demo</a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={selected.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /> GitHub</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
