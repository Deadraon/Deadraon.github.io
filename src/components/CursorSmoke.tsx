"use client";

import React, { useEffect, useRef } from "react";

export default function CursorSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Disable on touch screens (only track cursor hover devices)
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Tracking variables for coordinate interpolation and mouse speed (velocity)
    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      active: false,
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxLife: number;
      life: number;
      color: string;
      alpha: number;

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        // Inherit part of the mouse velocity plus slight random turbulence
        this.vx = (Math.random() - 0.5) * 0.7 + vx * 0.12;
        this.vy = (Math.random() - 0.5) * 0.7 + vy * 0.12 - 0.4; // Drifts upward
        this.size = Math.random() * 10 + 6;
        this.maxLife = Math.random() * 45 + 25;
        this.life = this.maxLife;
        this.alpha = 0.45;

        // Alternate HSL colors between vibrant violet-purple (260) and cyan-blue (200)
        const hue = Math.random() > 0.5 ? 265 : 205;
        this.color = `hsl(${hue}, 90%, 65%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.life--;
        this.size += 0.45; // Smoke particles expand over time
        this.alpha = Math.max(0, (this.life / this.maxLife) * 0.5);
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        // Radial gradient for a beautiful soft glowing smoke orb look
        const gradient = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = gradient;
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let particles: Particle[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.px = e.clientX;
        mouse.py = e.clientY;
        mouse.active = true;
        return;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        mouse.vx = mouse.x - mouse.px;
        mouse.vy = mouse.y - mouse.py;

        const distance = Math.hypot(mouse.vx, mouse.vy);
        // Spawn more particles when the cursor moves faster
        const spawnCount = Math.min(6, Math.floor(distance / 2) + 1);

        for (let i = 0; i < spawnCount; i++) {
          const t = i / spawnCount;
          // Interpolate positions to avoid gaps when mouse moves fast
          const x = mouse.px + (mouse.x - mouse.px) * t;
          const y = mouse.py + (mouse.y - mouse.py) * t;
          particles.push(new Particle(x, y, mouse.vx, mouse.vy));
        }

        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

      // Update and draw particles, removing dead ones
      particles = particles.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.life > 0;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
