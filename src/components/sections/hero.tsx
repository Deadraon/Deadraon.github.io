"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code, LayoutTemplate, Database, FileText } from "lucide-react";
import { ResumeRequestModal } from "./resume-request-modal";


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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Clean Solid Background */}
      <div className="absolute inset-0 bg-[#090b12] pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        {/* Subtle geometric grid */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38bdf8 1px, transparent 1px),
              linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-slate-900 text-white text-sm font-semibold mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Crafting next-gen digital experiences</span>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <span className="text-sky-400 flex items-center gap-1">Available for hire <span className="relative flex h-2 w-2 ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" /></span></span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="block text-white mb-2">Build faster with</span>
          <span className="block text-sky-400">Deadraon</span>
        </h1>

        {/* Typing role */}
        <div className="h-12 flex items-center justify-center mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-white/60">
            {displayed}
            <span className="typing-cursor">&nbsp;</span>
          </p>
        </div>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-white/50 mb-8 sm:mb-10 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: "0.3s" }}>
          I architect and build <strong className="text-white/90 font-medium">premium software solutions</strong>. From high-performance web applications to scalable infrastructure, delivering excellence at every layer.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-sm sm:max-w-none mb-16 sm:mb-24 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button asChild size="xl" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-base sm:text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Link href="/contact">
              Start a Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full border-white/10 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 font-medium text-base sm:text-lg transition-all">
            <Link href="/portfolio">
              Explore Work
            </Link>
          </Button>
          <ResumeRequestModal>
            <Button size="xl" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full border-white/10 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 font-medium text-base sm:text-lg transition-all">
              <FileText className="w-5 h-5 mr-2" />
              Resume
            </Button>
          </ResumeRequestModal>
        </div>

        {/* Floating UI Elements (SaaS Mockup Vibe) */}
        <div className="w-full max-w-5xl relative mx-auto h-[260px] sm:h-[400px] animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          {/* Main Mockup Window */}
          <div className="absolute inset-x-2 sm:inset-x-12 top-0 bottom-0 glass-dark rounded-t-3xl border-b-0 overflow-hidden flex flex-col items-center justify-start pt-6 sm:pt-8 shadow-[0_-20px_80px_rgba(0,112,243,0.15)]">
            <div className="w-3/4 h-2 rounded-full bg-white/5 mb-6 sm:mb-8" />
            
            <div className="flex gap-2 sm:gap-8 justify-center w-full px-4 sm:px-8">
              <div className="w-1/3 h-32 rounded-2xl bg-slate-900 border border-slate-700 p-4 flex flex-col justify-between shadow-md">
                <Code className="w-6 h-6 text-sky-400" />
                <div className="w-2/3 h-2 rounded-full bg-slate-700" />
              </div>
              <div className="w-1/3 h-40 rounded-2xl bg-blue-950/80 border border-blue-500/40 p-4 flex flex-col justify-between -translate-y-4 shadow-xl animate-float">
                <LayoutTemplate className="w-6 h-6 text-white" />
                <div className="space-y-2">
                  <div className="w-full h-2 rounded-full bg-blue-500/40" />
                  <div className="w-4/5 h-2 rounded-full bg-blue-500/20" />
                </div>
              </div>
              <div className="w-1/3 h-32 rounded-2xl bg-slate-900 border border-slate-700 p-4 flex flex-col justify-between shadow-md">
                <Database className="w-6 h-6 text-cyan-400" />
                <div className="w-1/2 h-2 rounded-full bg-slate-700" />
              </div>
            </div>
            
            {/* Fade out bottom of mockup */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-[#090b12] pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
