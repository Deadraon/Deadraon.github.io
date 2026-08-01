"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth mouse coordinates
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [smoothMouse, setSmoothMouse] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  // Lerp mouse tracking for smooth spotlight & particle interaction
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Lerp loop for ultra-fluid cursor movement
  useEffect(() => {
    let animId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const updateSmoothMouse = () => {
      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.08);

      setSmoothMouse({ x: mouseRef.current.x, y: mouseRef.current.y });
      animId = requestAnimationFrame(updateSmoothMouse);
    };

    animId = requestAnimationFrame(updateSmoothMouse);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Particle Canvas System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Professional color palette for particles (Ice Sapphire, Steel Blue, Cyan, Silver, White)
    const particleColors = [
      "rgba(59, 130, 246, ",  // Sapphire Blue
      "rgba(14, 165, 233, ",  // Sky/Steel Blue
      "rgba(6, 182, 212, ",   // Ice Cyan
      "rgba(148, 163, 184, ", // Slate Silver
      "rgba(255, 255, 255, ", // Pure White
    ];

    // Spawn particles based on screen size
    const particleCount = Math.min(Math.floor((width * height) / 19000), 70);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.8 + 0.9;
      const alpha = Math.random() * 0.35 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        baseRadius: radius,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha,
        baseAlpha: alpha,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Canvas render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw particle nodes and physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Distance to cursor
        const dx = mx - p.x;
        const dy = my - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        // Magnetic hover interaction
        const maxDist = 160;
        if (distToMouse < maxDist) {
          const force = (1 - distToMouse / maxDist);
          p.radius = p.baseRadius + force * 2.2;
          p.alpha = Math.min(0.9, p.baseAlpha + force * 0.4);

          // Draw dynamic line to mouse
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(59, 130, 246, ${force * 0.35})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        } else {
          p.radius = Math.max(p.baseRadius, p.radius - 0.05);
          p.alpha = Math.max(p.baseAlpha, p.alpha - 0.01);
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          const maxPdist = 110;

          if (pdist < maxPdist) {
            const lineAlpha = (1 - pdist / maxPdist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#090b12]"
    >
      {/* Crisp Solid Tech Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating Animated Solid Tech Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full border border-purple-500/25 bg-purple-950/15 pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[35%] -right-32 w-[600px] h-[600px] rounded-full border border-blue-500/20 bg-blue-950/15 pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.04, 0.96, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 left-[15%] w-[500px] h-[500px] rounded-full border border-purple-500/20 bg-purple-950/15 pointer-events-none"
      />

      {/* Interactive HTML5 Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
}
