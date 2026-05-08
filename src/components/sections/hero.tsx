"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Zap, Play, ChevronDown } from "lucide-react";

const roles = ["Full Stack Developer", "React & Next.js Expert", "Mobile App Developer", "UI/UX Craftsman", "API Architect"];

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-mesh pt-16">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Available for new projects
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="block text-foreground">Hi, I&apos;m</span>
          <span className="block gradient-text">Deadraon</span>
        </h1>

        {/* Typing role */}
        <div className="h-12 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {displayed}
            <span className="border-r-2 border-primary ml-0.5 animate-pulse">&nbsp;</span>
          </p>
        </div>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
          I build <strong className="text-foreground">premium digital products</strong> — from sleek web apps to powerful mobile solutions. 
          Every line of code crafted for performance, beauty, and real business results.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button asChild size="xl" variant="gradient">
            <Link href="/contact">
              <Zap className="w-5 h-5" />
              Hire Me Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="group">
            <Link href="/portfolio">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              View My Work
            </Link>
          </Button>
          <Button asChild size="xl" variant="ghost">
            <Link href="/sign-in">
              Client Login
            </Link>
          </Button>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-3 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {["React", "Next.js", "TypeScript", "Node.js", "Flutter", "MongoDB", "TailwindCSS"].map((tech) => (
            <span key={tech} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-default">
              {tech}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
