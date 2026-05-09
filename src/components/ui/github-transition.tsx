"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function GithubTransition() {
  const [stage, setStage] = useState<"idle" | "moving" | "flipping">("idle");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTrigger = () => {
      // Find the real logo
      const realLogo = document.getElementById("navbar-logo");
      if (realLogo) {
        const rect = realLogo.getBoundingClientRect();
        setStartPos({ x: rect.left, y: rect.top });
        realLogo.style.opacity = "0";
      }

      setStage("moving");
      
      // Flip after 800ms
      setTimeout(() => {
        setStage("flipping");
        
        // Ensure real logo comes back if user hits back button (fallback)
        if (realLogo) {
          setTimeout(() => {
            realLogo.style.opacity = "1";
          }, 800);
        }

        // Redirect after flip animation finishes
        setTimeout(() => {
          window.location.href = "https://github.com/Deadraon";
        }, 600);
      }, 800);
    };

    // Fix for browser back-forward cache (bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setStage("idle");
        const realLogo = document.getElementById("navbar-logo");
        if (realLogo) {
          realLogo.style.opacity = "1";
        }
      }
    };

    window.addEventListener("triggerGithubTransition", handleTrigger);
    window.addEventListener("pageshow", handlePageShow);
    
    return () => {
      window.removeEventListener("triggerGithubTransition", handleTrigger);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (stage === "idle") return null;

  // Center of screen
  const endX = typeof window !== 'undefined' ? window.innerWidth / 2 - 60 : 0;
  const endY = typeof window !== 'undefined' ? window.innerHeight / 2 - 20 : 0;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dim background */}
      <div className={`absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity duration-500`} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes moveToCenter {
          0% { 
            transform: translate(${startPos.x}px, ${startPos.y}px) scale(1); 
            opacity: 1;
          }
          100% { 
            transform: translate(${endX}px, ${endY}px) scale(4); 
            opacity: 1;
            filter: drop-shadow(0 0 40px rgba(0, 112, 243, 0.6));
          }
        }
        .flip-container {
          perspective: 1000px;
        }
        .flipper {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          position: relative;
          width: 120px;
          height: 40px;
        }
        .flipping .flipper {
          transform: rotateY(180deg);
        }
        .front, .back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .back {
          transform: rotateY(180deg);
          justify-content: center;
        }
      `}} />

      {/* The animated logo wrapper */}
      <div 
        className={`absolute top-0 left-0 flip-container ${stage === "flipping" ? "flipping" : ""}`}
        style={{
          animation: stage === "moving" ? "moveToCenter 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards" : "none",
          transform: stage === "flipping" ? `translate(${endX}px, ${endY}px) scale(4)` : "none",
          filter: stage === "flipping" ? "drop-shadow(0 0 60px rgba(255, 255, 255, 0.3))" : "none",
          transition: "filter 0.6s"
        }}
      >
        {(stage === "moving" || stage === "flipping") && (
          <div className="flipper">
            {/* Front: Original Logo */}
            <div className="front flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0070F3] to-[#8A2BE2] rounded-lg flex items-center justify-center shadow-lg">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white flex">
                <span className="bg-gradient-to-r from-white via-[#80C0FF] to-[#0070F3] bg-clip-text text-transparent">Dead</span>
                raon
              </span>
            </div>
            
            {/* Back: GitHub Logo */}
            <div className="back flex items-center gap-2">
              <FaGithub className="w-8 h-8 text-white" />
              <span className="font-bold text-xl tracking-tight text-white">GitHub</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
