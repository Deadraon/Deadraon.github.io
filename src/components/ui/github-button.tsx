"use client";

import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GithubButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isRedirecting) {
      e.preventDefault();
      return;
    }
    
    setIsRedirecting(true);
    
    // Reset back to normal after 3 seconds since it opens in a new tab
    setTimeout(() => {
      setIsRedirecting(false);
    }, 3000);
  };

  return (
    <Button asChild variant="outline" size="lg" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 transition-all duration-300 w-36">
      <a 
        href="https://github.com/Deadraon" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {isRedirecting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-white/70" />
        ) : (
          <Github className="w-4 h-4 mr-2" />
        )}
        {isRedirecting ? "Redirecting..." : "GitHub"}
      </a>
    </Button>
  );
}
