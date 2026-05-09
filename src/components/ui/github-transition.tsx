"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function GithubTransition() {
  const [stage, setStage] = useState<"idle" | "appearing" | "flipping" | "expanding">("idle");

  useEffect(() => {
    const handleTrigger = () => {
      // Stage 1: Appear in center
      setStage("appearing");
      
      // Stage 2: Flip with spring effect
      setTimeout(() => {
        setStage("flipping");
        
        // Stage 3: Expand into screen and redirect
        setTimeout(() => {
          setStage("expanding");
          setTimeout(() => {
            window.location.href = "https://github.com/Deadraon";
          }, 500);
        }, 900);
      }, 700);
    };

    // Fix for browser back-forward cache (bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setStage("idle");
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

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {/* Cinematic Dim background */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-700 ease-in-out"
        style={{ opacity: stage === "idle" ? 0 : 1 }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .premium-flip-container {
          perspective: 2000px;
          z-index: 50;
        }
        .premium-flipper {
          width: 320px;
          height: 320px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stage-appearing .premium-flipper {
          animation: popIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .stage-flipping .premium-flipper {
          transform: rotateY(180deg) scale(1.1);
        }
        .stage-expanding .premium-flipper {
          transform: rotateY(180deg) scale(20);
          opacity: 0;
          transition: transform 0.7s cubic-bezier(0.7, 0, 0.84, 0), opacity 0.5s 0.2s;
        }

        @keyframes popIn {
          0% { transform: scale(0.3) translateY(100px); opacity: 0; filter: blur(20px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }

        .premium-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
        }
        .premium-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          box-shadow: 0 0 100px rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.1);
        }
      `}} />

      <div className={`premium-flip-container stage-${stage}`}>
        <div className="premium-flipper">
          
          {/* FRONT FACE (Deadraon) */}
          <div className="premium-face">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0070F3] to-[#8A2BE2] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,112,243,0.6)] mb-8">
              <Code2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              <span className="bg-gradient-to-r from-white via-[#80C0FF] to-[#0070F3] bg-clip-text text-transparent">Dead</span>raon
            </h2>
          </div>

          {/* BACK FACE (GitHub) */}
          <div className="premium-face premium-back">
            <FaGithub className="w-32 h-32 text-white mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]" />
            <h2 className="text-xl font-bold text-white/80 tracking-[0.3em] uppercase">Redirecting</h2>
          </div>

        </div>
      </div>
    </div>
  );
}
