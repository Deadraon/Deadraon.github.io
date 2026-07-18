"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Menu, X, Code2, Home, User, Briefcase, Wrench, Mail, CreditCard } from "lucide-react";
import { LiquidButton } from "@/components/ui/button";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services and Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/pay", label: "Pay" },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const tabs = [
    { title: "Home", icon: Home, href: "/" },
    { title: "About", icon: User, href: "/about" },
    { title: "Portfolio", icon: Briefcase, href: "/portfolio" },
    { title: "Services", icon: Wrench, href: "/services" },
    { title: "Contact", icon: Mail, href: "/contact" },
    { title: "Pay", icon: CreditCard, href: "/pay" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none">
      {/* Main full-width navbar */}
      <nav className="relative overflow-hidden w-full border-b border-white/10 py-3 shadow-md shadow-black/5 pointer-events-auto">
        {/* Glassmorphic backdrop blur layer */}
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          style={{
            backdropFilter: 'blur(20px) brightness(1.06) saturate(1.2)',
            background: 'rgba(255, 255, 255, 0.04)',
          }}
        />
        {/* Glass rim */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Full-width content wrapper */}
        <div className="w-full px-4 flex items-center gap-2 lg:gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-all duration-300 shrink-0 mr-1 z-10 hover:scale-[1.08] active:scale-[0.92]"
          style={{
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dead
            </span>
            <span>raon</span>
          </span>
        </Link>

        {/* ToolsOne pill */}
        <Link
          href="/tools"
          className="relative z-10 hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-[3px] border-b-blue-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl active:translate-y-[1px] transition-all duration-100 shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 shrink-0 hover:scale-[1.08] active:scale-[0.92]"
          style={{
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ToolsOne
        </Link>

        {/* DriveOne pill */}
        <Link
          href="/drive"
          className="relative z-10 hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-b from-[#24A1DE] to-[#0070F3] border border-[#24A1DE] border-b-[3px] border-b-blue-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl active:translate-y-[1px] transition-all duration-100 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 shrink-0 hover:scale-[1.08] active:scale-[0.92]"
          style={{
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </Link>

        {/* Center menu bar (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
          <ExpandableTabs
            tabs={tabs}
            activeColor="text-purple-400"
            className="border-0 bg-transparent backdrop-blur-none p-0 shadow-none gap-1"
          />
        </div>

        {/* Right Actions */}
        <div className="relative z-10 ml-auto flex items-center gap-2 shrink-0">
          {mounted ? (
            isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all cursor-pointer whitespace-nowrap hover:scale-[1.08] active:scale-[0.92]"
                  style={{
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="hidden sm:inline-flex text-white/80 hover:text-white transition-all cursor-pointer px-3 py-2 rounded-lg whitespace-nowrap hover:scale-[1.08] active:scale-[0.92]"
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    Client Login
                  </button>
                </SignInButton>
                <div 
                  className="transition-all hover:scale-[1.08] active:scale-[0.92]"
                  style={{
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                >
                  <LiquidButton
                    onClick={() => {
                      const el = document.getElementById("contact-card");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      else window.location.href = "/contact";
                    }}
                    size="sm"
                    className="text-xs py-2 whitespace-nowrap"
                  >
                    Start a project
                  </LiquidButton>
                </div>
              </>
            )
          ) : (
            <div className="w-24 h-8 bg-white/10 animate-pulse rounded-lg" />
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="relative overflow-hidden lg:hidden border-b border-white/15 shadow-xl pointer-events-auto">
          {/* Glassmorphic backdrop blur layer */}
          <div
            className="absolute inset-0 -z-10 overflow-hidden"
            style={{
              backdropFilter: 'blur(20px) brightness(1.04) saturate(1.15)',
              background: 'rgba(255, 255, 255, 0.04)',
            }}
          />
          {/* Glass rim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div className="w-full px-4 py-3 space-y-1 relative z-10">
            {/* ToolsOne pill in mobile */}
            <Link
              href="/tools"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-[3px] border-b-blue-900 rounded-xl transition-all duration-100 shadow-md w-full mb-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ToolsOne
            </Link>

            {/* DriveOne pill in mobile */}
            <Link
              href="/drive"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-b from-[#24A1DE] to-[#0070F3] border border-[#24A1DE] border-b-[3px] border-b-blue-900 rounded-xl transition-all duration-100 shadow-md w-full mb-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>

            {/* Main navigation links in mobile drawer */}
            <div className="py-2 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-purple-400 font-semibold"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth */}
            <div className="pt-2 border-t border-white/10 mt-2 space-y-2">
              {mounted && isSignedIn ? (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.fullName || user?.username || "My Account"}
                      </p>
                      <p className="text-[10px] text-white/50 truncate">
                        {user?.primaryEmailAddress?.emailAddress || "Signed in"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/15 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors text-left">
                      Client Login
                    </button>
                  </SignInButton>
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      const el = document.getElementById("contact-card");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      else window.location.href = "/contact";
                    }}
                    className="w-full bg-white text-black text-sm font-semibold py-3 rounded-xl hover:bg-white/95 transition-colors"
                  >
                    Start a project
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

