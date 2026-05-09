"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";

export function GithubTransition() {
  const [stage, setStage] = useState<"idle" | "moving" | "shattering">("idle");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTrigger = () => {
      // Find the real logo
      const realLogo = document.getElementById("navbar-logo");
      if (realLogo) {
        const rect = realLogo.getBoundingClientRect();
        setStartPos({ x: rect.left, y: rect.top });
        // Hide real logo temporarily to sell the effect
        realLogo.style.opacity = "0";
      }

      setStage("moving");
      
      // Shatter after 800ms
      setTimeout(() => {
        setStage("shattering");
        
        // Ensure real logo comes back if user hits back button
        if (realLogo) {
          setTimeout(() => {
            realLogo.style.opacity = "1";
          }, 800);
        }

        // Redirect after shatter animation
        setTimeout(() => {
          window.location.href = "https://github.com/Deadraon";
        }, 800);
      }, 800);
    };

    window.addEventListener("triggerGithubTransition", handleTrigger);
    return () => window.removeEventListener("triggerGithubTransition", handleTrigger);
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
        @keyframes shatter1 { 100% { transform: translate(-200px, -200px) rotate(-45deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter2 { 100% { transform: translate(200px, -200px) rotate(45deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter3 { 100% { transform: translate(-200px, 200px) rotate(-90deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter4 { 100% { transform: translate(200px, 200px) rotate(90deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter5 { 100% { transform: translate(0, -300px) rotate(180deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter6 { 100% { transform: translate(0, 300px) rotate(-180deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter7 { 100% { transform: translate(-300px, 0) rotate(-120deg) scale(0.5); opacity: 0; filter: blur(8px); } }
        @keyframes shatter8 { 100% { transform: translate(300px, 0) rotate(120deg) scale(0.5); opacity: 0; filter: blur(8px); } }
      `}} />

      {/* The animated logo wrapper */}
      <div 
        className="absolute top-0 left-0"
        style={{
          animation: stage === "moving" ? "moveToCenter 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards" : "none",
          transform: stage === "shattering" ? `translate(${endX}px, ${endY}px) scale(4)` : "none",
        }}
      >
        {stage === "moving" && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0070F3] to-[#8A2BE2] rounded-lg flex items-center justify-center shadow-lg">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white flex">
              <span className="bg-gradient-to-r from-white via-[#80C0FF] to-[#0070F3] bg-clip-text text-transparent">Dead</span>
              raon
            </span>
          </div>
        )}

        {stage === "shattering" && (
          <div className="relative w-[120px] h-[40px] flex items-center justify-center">
            {/* Shards of the logo */}
            {[
              { id: 1, clip: 'polygon(0 0, 50% 0, 25% 50%, 0 25%)', anim: 'shatter1' },
              { id: 2, clip: 'polygon(50% 0, 100% 0, 100% 25%, 75% 50%)', anim: 'shatter2' },
              { id: 3, clip: 'polygon(0 25%, 25% 50%, 0 100%, 0 50%)', anim: 'shatter3' },
              { id: 4, clip: 'polygon(100% 25%, 100% 100%, 100% 50%, 75% 50%)', anim: 'shatter4' },
              { id: 5, clip: 'polygon(25% 50%, 50% 0, 75% 50%, 50% 100%)', anim: 'shatter5' },
              { id: 6, clip: 'polygon(0 100%, 50% 100%, 25% 50%)', anim: 'shatter6' },
              { id: 7, clip: 'polygon(50% 100%, 100% 100%, 75% 50%)', anim: 'shatter7' },
              { id: 8, clip: 'polygon(25% 25%, 50% 0, 0 0)', anim: 'shatter8' },
            ].map((shard) => (
              <div 
                key={shard.id}
                className="absolute inset-0 flex items-center gap-2"
                style={{
                  clipPath: shard.clip,
                  animation: `${shard.anim} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0070F3] to-[#8A2BE2] rounded-lg flex items-center justify-center shadow-lg">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white flex whitespace-nowrap">
                  <span className="bg-gradient-to-r from-white via-[#80C0FF] to-[#0070F3] bg-clip-text text-transparent">Dead</span>
                  raon
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
