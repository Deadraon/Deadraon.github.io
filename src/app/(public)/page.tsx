"use client";

import { useState, useEffect, FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { Twitter, Github, MessageCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

import { StatsSection } from "@/components/sections/stats";
import { ServicesSection } from "@/components/sections/services";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { AdminRequestAlert } from "@/components/admin/AdminRequestAlert";
import { Footer } from "@/components/layout/footer";
import { HeroGeometricBackground } from "@/components/sections/HeroGeometric";

const SERVICES = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "API Integration",
  "Maintenance & Support",
  "Other"
];

interface SocialBtnProps {
  href: string;
  bgClass: string;
  textClass: string;
  children: ReactNode;
}

function SocialBtn({ href, bgClass, textClass, children }: SocialBtnProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-85 transition-opacity shrink-0 ${bgClass} ${textClass}`}
    >
      {children}
    </a>
  );
}

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Typewriter effect state
  const roles = [
    "Full Stack Developer",
    "React & Next.js Expert",
    "Mobile App Developer",
    "UI/UX Craftsman",
    "API Architect"
  ];
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

  const { isSignedIn } = useUser();

  // Mouse tracking and dynamic gradient hue state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glowColors, setGlowColors] = useState({
    color1: 'hsla(260, 80%, 60%, 0.15)',
    color2: 'hsla(210, 85%, 55%, 0.15)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const pctX = x / rect.width;
    const pctY = y / rect.height;

    // Dynamically shift HSL hues based on coordinates
    // H1 (Purple-to-Pink): 250 -> 360
    // H2 (Blue-to-Cyan/Emerald): 180 -> 260
    const hue1 = Math.round(250 + pctX * 110);
    const hue2 = Math.round(180 + pctY * 80);

    setGlowColors({
      color1: `hsla(${hue1}, 85%, 65%, 0.22)`,
      color2: `hsla(${hue2}, 90%, 55%, 0.18)`,
    });
  };

  const toggleService = (service: string) => {
    if (selected.includes(service)) {
      setSelected(selected.filter((s) => s !== service));
    } else {
      setSelected([...selected, service]);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: selected.length > 0 ? `Inquiry: ${selected.join(", ")}` : `New project inquiry from ${name}`,
          message,
          projectType: selected.join(", "),
        }),
      });

      if (res.ok) {
        setSent(true);
        toast.success("Message sent! I'll get back to you within 24 hours.");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to send. Please email me directly at deadraon@gmail.com");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-24 p-3 sm:p-4 md:p-6 pb-12 max-w-7xl mx-auto relative z-10 pt-[80px] sm:pt-[80px]">
      
      {/* Hero Rounded Card Container */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full rounded-[32px] min-h-[calc(100vh-80px)] transition-all duration-300 overflow-hidden border border-white/[0.08] bg-black/25 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        
        {/* Geometric Ambient Background & floating shapes */}
        <HeroGeometricBackground
          isHovered={isHovered}
          mousePos={mousePos}
          glowColors={glowColors}
        />
        
        {/* Interactive Content Layer */}
        <div className="relative z-10 flex flex-col p-6 sm:p-8 lg:p-10 gap-6 min-h-[calc(100vh-80px)] justify-between">
          
          {/* Spacer (pushes headline to bottom) */}
          <div className="flex-1 min-h-[2rem]" />

          {/* Bottom Row: Headline + Form */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12 w-full mt-auto">
            
            {/* Headline */}
            <div className="flex-1 mb-4 flex flex-col gap-4">
              <h1 className="text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] drop-shadow-2xl max-w-xl shrink-0">
                I craft bold digital solutions
                <br />
                and ship them as{' '}
                <span className="serif-italic text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-none">
                  products
                </span>
              </h1>
              
              {/* Typewriter role sub-headline */}
              <div className="h-8 flex items-center justify-start">
                <p className="text-base sm:text-lg md:text-xl font-light text-white/50 tracking-wide">
                  <span>I'm a </span>
                  <span className="text-white font-medium">{displayed}</span>
                  <span className="typing-cursor">&nbsp;</span>
                </p>
              </div>
            </div>

            {/* Contact Form Card */}
            <div id="contact-card" className="w-full max-w-md md:max-w-none md:w-[380px] lg:w-[440px] shrink-0 self-center md:self-auto transition-all select-text">
              <div className="bg-white rounded-[32px] shadow-2xl p-6 flex flex-col gap-5">
                
                {/* Heading */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
                    Say hello! <span className="animate-bounce">👋</span>
                  </h2>
                </div>

                {/* Email + Socials row */}
                <div className="flex flex-row items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                      Drop us a line
                    </span>
                    <a
                      href="mailto:deadraon@gmail.com"
                      className="text-blue-600 font-semibold text-sm hover:underline truncate"
                    >
                      deadraon@gmail.com
                    </a>
                  </div>
                  
                  {/* Social Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <SocialBtn href="https://github.com/Deadraon" bgClass="bg-gray-100" textClass="text-gray-800">
                      <Github size={14} className="stroke-[2.5]" />
                    </SocialBtn>
                    <SocialBtn href="https://wa.me/916396714325" bgClass="bg-emerald-50" textClass="text-emerald-500">
                      <MessageCircle size={14} className="stroke-[2.5]" />
                    </SocialBtn>
                    <SocialBtn href="https://twitter.com/Deadraon" bgClass="bg-blue-50" textClass="text-blue-400">
                      <Twitter size={14} className="stroke-[2.5]" />
                    </SocialBtn>
                  </div>
                </div>

                {!sent ? (
                  <>
                    {/* OR Divider */}
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] select-none">OR</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-black select-none">
                          Tell us about your vision
                        </label>
                        
                        {/* Name + Email side by side */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="flex-1 min-w-0 text-sm px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/55 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition text-gray-900"
                          />
                          <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 min-w-0 text-sm px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/55 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition text-gray-900"
                          />
                        </div>
                      </div>

                      {/* Message/Vision input */}
                      <textarea
                        rows={3}
                        placeholder="What are you looking to build or improve?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full text-sm px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/55 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none transition text-gray-900"
                      />

                      {/* Service tags section */}
                      <div className="select-none">
                        <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          I need help with...
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {SERVICES.map((service) => {
                            const isActive = selected.includes(service);
                            return (
                              <button
                                key={service}
                                type="button"
                                onClick={() => toggleService(service)}
                                className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                {service}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-black text-white text-sm font-bold py-4 rounded-2xl hover:bg-gray-800 transition-transform active:scale-[0.98] mt-2 cursor-pointer disabled:opacity-60"
                      >
                        {sending ? 'Sending...' : 'Send my message'}
                      </button>
                    </form>
                  </>
                ) : (
                  /* Success State shown in place of the form */
                  <div className="flex flex-col items-start justify-start pt-2 pb-6 gap-4 animate-fade-in text-left">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl text-green-600 font-bold shadow-xs">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        You're all set!
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Expect a reply within 24 hours.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setName('');
                        setEmail('');
                        setMessage('');
                        setSelected([]);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold transition-colors mt-2 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                )}
                
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Admin Alerts */}
      <AdminRequestAlert />

      {/* Homepage Footer */}
      <Footer />

    </div>
  );
}
