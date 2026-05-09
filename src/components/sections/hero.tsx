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
      {/* SaaS AI Deep Background & Glows */}
      <div className="absolute inset-0 bg-[#030308] pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        {/* Massive soft glowing orbs */}
        <div className="absolute top-[20%] w-[800px] h-[600px] bg-[#0070F3]/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] right-[10%] w-[600px] h-[500px] bg-[#8A2BE2]/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* AI Launch Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_0_20px_rgba(0,112,243,0.1)] text-white/90 text-sm font-medium mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-[#0070F3]" />
          <span>Crafting next-gen digital experiences</span>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <span className="text-[#0070F3] flex items-center gap-1">Available for hire <span className="relative flex h-2 w-2 ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0070F3] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#0070F3]" /></span></span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="block text-white mb-2">Build faster with</span>
          <span className="block gradient-text drop-shadow-2xl">Deadraon</span>
        </h1>

        {/* Typing role */}
        <div className="h-12 flex items-center justify-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white/60">
            {displayed}
            <span className="typing-cursor">&nbsp;</span>
          </p>
        </div>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          I architect and build <strong className="text-white/90 font-medium">premium software solutions</strong>. From high-performance web applications to scalable infrastructure, delivering excellence at every layer.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button asChild size="xl" className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Link href="/contact">
              Start a Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 font-medium text-lg transition-all">
            <Link href="/portfolio">
              Explore Work
            </Link>
          </Button>
          <ResumeRequestModal>
            <Button size="xl" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 font-medium text-lg transition-all">
              <FileText className="w-5 h-5 mr-2" />
              Resume
            </Button>
          </ResumeRequestModal>
        </div>

        {/* Floating UI Elements (SaaS Mockup Vibe) */}
        <div className="w-full max-w-5xl relative mx-auto h-[300px] sm:h-[400px] animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          {/* Main Mockup Window */}
          <div className="absolute inset-x-4 sm:inset-x-12 top-0 bottom-0 glass-dark rounded-t-3xl border-b-0 overflow-hidden flex flex-col items-center justify-start pt-8 shadow-[0_-20px_80px_rgba(0,112,243,0.15)]">
            <div className="w-3/4 h-2 rounded-full bg-white/5 mb-8" />
            
            <div className="flex gap-4 sm:gap-8 justify-center w-full px-8">
              <div className="w-1/3 h-32 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-4 flex flex-col justify-between">
                <Code className="w-6 h-6 text-[#0070F3]" />
                <div className="w-2/3 h-2 rounded-full bg-white/10" />
              </div>
              <div className="w-1/3 h-40 rounded-2xl bg-gradient-to-br from-[#0070F3]/10 to-transparent border border-[#0070F3]/20 p-4 flex flex-col justify-between -translate-y-4 shadow-[0_0_30px_rgba(0,112,243,0.2)] animate-float">
                <LayoutTemplate className="w-6 h-6 text-white" />
                <div className="space-y-2">
                  <div className="w-full h-2 rounded-full bg-white/20" />
                  <div className="w-4/5 h-2 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="w-1/3 h-32 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-4 flex flex-col justify-between">
                <Database className="w-6 h-6 text-[#8A2BE2]" />
                <div className="w-1/2 h-2 rounded-full bg-white/10" />
              </div>
            </div>
            
            {/* Fade out bottom of mockup */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
