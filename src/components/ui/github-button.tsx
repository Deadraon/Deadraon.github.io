"use client";

import { useState, useEffect } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GithubButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Fix bfcache stuck loading state
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsRedirecting(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleClick = () => {
    if (isRedirecting) return;
    
    setIsRedirecting(true);
    
    // Play animation first for 1.2s, then redirect
    setTimeout(() => {
      window.location.href = "https://github.com/Deadraon";
    }, 1200);
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline" 
      size="lg" 
      className={`relative rounded-full transition-all duration-500 w-44 flex items-center justify-center overflow-hidden
        ${isRedirecting 
          ? "bg-[#0070F3]/10 border-[#0070F3]/40 text-[#80C0FF] shadow-[0_0_20px_rgba(0,112,243,0.2)] scale-95" 
          : "border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
        }`}
    >
      <div className="flex items-center justify-center w-full">
        {isRedirecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="font-medium tracking-wide">Redirecting</span>
          </>
        ) : (
          <>
            <Github className="w-4 h-4 mr-2" />
            <span className="font-medium">GitHub</span>
          </>
        )}
      </div>
    </Button>
  );
}
