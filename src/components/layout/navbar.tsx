"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Code2, Zap } from "lucide-react";
import { ResumeRequestModal } from "@/components/sections/resume-request-modal";


const navLinks = [
  { href: "/tools", label: "ToolsOne" },
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services and Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/pay", label: "Pay" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || isMobileOpen
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" id="navbar-logo" className="flex items-center gap-2 group transition-opacity duration-300">
          <div className="relative w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="gradient-text">Dead</span>
            <span className="text-foreground">raon</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            if (link.href === "/tools") {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "mx-2 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-[3px] border-b-blue-900 rounded-xl hover:from-purple-500 hover:to-blue-500 active:border-b-[1px] active:translate-y-[2px] transition-all duration-100 shadow-md shadow-purple-500/10 hover:shadow-purple-500/30 flex items-center justify-center gap-1.5 h-[34px]"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {link.label}
                </Link>
              );
            }
            return link.href.endsWith(".pdf") ? (
              <ResumeRequestModal key={link.href}>
                <button
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </button>
              </ResumeRequestModal>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3 min-w-[100px] justify-end">
          {mounted ? (
            isSignedIn ? (
              <div className="flex items-center gap-3">
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Client Login</Button>
                </SignInButton>
                <Button asChild variant="gradient" size="sm">
                  <Link href="/contact#contact-form">
                    <Zap className="w-4 h-4" /> Hire Me
                  </Link>
                </Button>
              </div>
            )
          ) : (
            <div className="w-24 h-8 bg-muted/10 animate-pulse rounded-lg" />
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              if (link.href === "/tools") {
                return (
                  <div key={link.href} className="px-4 py-2">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block text-center py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-b from-purple-600 to-blue-600 border border-purple-500 border-b-[3px] border-b-blue-900 rounded-xl hover:from-purple-500 hover:to-blue-500 active:border-b-[1px] active:translate-y-[2px] transition-all duration-100 shadow-md shadow-purple-500/10 hover:shadow-purple-500/30 w-full"
                      )}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              }
              return link.href.endsWith(".pdf") ? (
                <ResumeRequestModal key={link.href}>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </button>
                </ResumeRequestModal>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {mounted ? (
                isSignedIn ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 border border-border/50 rounded-xl bg-accent/20">
                    <div className="flex items-center gap-3">
                      <UserButton afterSignOutUrl="/" />
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.fullName || user?.username || "My Account"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user?.primaryEmailAddress?.emailAddress || "Signed in"}
                        </p>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="flex-shrink-0">
                      <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">Client Login</Button>
                    </SignInButton>
                    <Button asChild variant="gradient" className="w-full">
                      <Link href="/contact#contact-form" onClick={() => setIsMobileOpen(false)}>
                        <Zap className="w-4 h-4" /> Hire Me
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <div className="w-full h-10 bg-muted/10 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
