"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ArrowRight, X } from "lucide-react";

const projects = [
  {
    id: "1",
    title: "Deadraon Portfolio",
    category: "web",
    desc: "Full-stack freelance platform with client dashboard, project management, messaging, and Clerk auth.",
    longDesc: "A professional SaaS-style freelance portfolio built with Next.js 15, TypeScript, MongoDB, and Clerk. Features include a client-facing portfolio, project submission system, admin dashboard, messaging, notifications, and a dark-mode-first premium UI inspired by modern SaaS products.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    tags: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Tailwind"],
    github: "https://github.com/Deadraon/Deadraon.github.io",
    live: "https://deadraon.dev",
  },
  {
    id: "2",
    title: "GainIQ",
    category: "app",
    desc: "AI-powered fitness & diet app with personalized plans, workout tracking, and Google Gemini integration.",
    longDesc: "GainIQ is a cross-platform Flutter fitness application featuring AI-generated diet plans powered by Google Gemini, workout logging, body metrics tracking, admin management panel, subscription control, and a premium modern UI with dark mode.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    tags: ["Flutter", "Dart", "Gemini AI", "Firebase", "Riverpod"],
    github: "https://github.com/Deadraon/gainiq",
    live: "https://gainiq-ten.vercel.app",
  },
  {
    id: "3",
    title: "Rustic House",
    category: "ui",
    desc: "Premium luxury hotel website with immersive animations, room booking, and full-screen hero experience.",
    longDesc: "A luxury hotel website built with HTML, CSS, and JavaScript featuring an immersive full-screen hero section, smooth scroll animations, room browsing, online booking system with Razorpay integration, and a stunning glassmorphism navigation on mobile.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    tags: ["HTML", "CSS", "JavaScript", "Razorpay"],
    github: "https://github.com/Deadraon/rustic-house_build",
    live: "https://rustic-house-build.vercel.app",
  },
  {
    id: "4",
    title: "Hotel Taj View Residency",
    category: "web",
    desc: "Full-featured hotel website with a premium Crystal Glass mobile nav, room gallery, and booking system.",
    longDesc: "A full-featured hotel website for Taj View Residency. Built with JavaScript, features a premium crystal-glass mobile navigation, room photo gallery, contact forms, online enquiry system, and smooth scroll animations throughout.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    tags: ["JavaScript", "CSS", "HTML", "Vercel"],
    github: "https://github.com/Deadraon/hotel_test_full",
    live: "https://hotel-test-full.vercel.app",
  },
  {
    id: "5",
    title: "Shivaay Fitness",
    category: "web",
    desc: "Gym & fitness centre website with membership plans, class schedules, and trainer profiles.",
    longDesc: "A modern gym and fitness centre website for Shivaay Fitness. Features membership plan listings, class schedule, trainer profile cards, testimonials, and a contact section. Built with Next.js and Tailwind CSS with a dark, energetic aesthetic.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80",
    tags: ["Next.js", "JavaScript", "Tailwind", "Vercel"],
    github: "https://github.com/Deadraon/shivaay_fitness",
    live: "https://shivaay-fitness.vercel.app",
  },
  {
    id: "6",
    title: "Lifeline Hospital",
    category: "web",
    desc: "Hospital management portal with doctor listings, appointment booking, and patient services.",
    longDesc: "A comprehensive hospital web portal for Lifeline Hospital built with Next.js and TypeScript. Features doctor directory, department listings, appointment booking flow, emergency contact section, and a clean, trust-inspiring medical UI.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    github: "https://github.com/Deadraon/lifeline-hospital",
    live: "https://lifeline-hospital-phi.vercel.app",
  },
  {
    id: "7",
    title: "Om Chaudhary Hospital",
    category: "web",
    desc: "Hospital website with department listings, doctor profiles, and appointment booking.",
    longDesc: "A hospital website for Om Chaudhary Hospital built with JavaScript. Includes department and doctor listing pages, patient appointment booking, emergency contact details, and a clean, accessible healthcare UI.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    tags: ["JavaScript", "CSS", "HTML", "Vercel"],
    github: "https://github.com/Deadraon/om_chaudhary_hospital",
    live: "https://om-chaudhary-hospital.vercel.app",
  },
];

const filters = ["all", "web", "app", "ui", "backend"];

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null);

  const filtered = projects.filter((p) => active === "all" || p.category === active);

  return (
    <div className="pt-14">
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
