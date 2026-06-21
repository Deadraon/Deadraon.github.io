"use client";

import React, { useEffect, useRef } from "react";

export default function CursorWater() {
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

    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      active: false,
    };

    class Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 35 + 40; // Expands to 40-75px radius
        this.maxLife = 55;
        this.life = this.maxLife;
        this.color = "202, 85%"; // Aqua/Blue HSL base
      }

      update() {
        this.life--;
        // Expand wave radius using sine interpolation for clean water wave physics
        const progress = 1 - this.life / this.maxLife;
        this.radius = this.maxRadius * Math.sin((progress * Math.PI) / 2);
      }

      draw(c: CanvasRenderingContext2D) {
        const alpha = (this.life / this.maxLife) * 0.4;
        c.save();

        // 1. Primary Ripple Ring
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.strokeStyle = `hsla(${this.color}, 75%, ${alpha})`;
        c.lineWidth = (this.life / this.maxLife) * 2.2;
        c.stroke();

        // 2. Faint secondary interior ring for wave depth
        if (this.radius > 12) {
          c.beginPath();
          c.arc(this.x, this.y, this.radius - 10, 0, Math.PI * 2);
          c.strokeStyle = `hsla(${this.color}, 75%, ${alpha * 0.35})`;
          c.lineWidth = (this.life / this.maxLife) * 1.1;
          c.stroke();
        }

        c.restore();
      }
    }

    class Droplet {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        // Explode outward relative to cursor velocity
        this.vx = (Math.random() - 0.5) * 1.8 + vx * 0.18;
        this.vy = (Math.random() - 0.5) * 1.8 + vy * 0.18 - 1.2; // Initial splash upward
        this.size = Math.random() * 2 + 1;
        this.maxLife = Math.random() * 25 + 15;
        this.life = this.maxLife;
        this.color = "197, 95%, 70%";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.09; // Downward gravity acceleration
        this.life--;
      }

      draw(c: CanvasRenderingContext2D) {
        const alpha = (this.life / this.maxLife) * 0.65;
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `hsla(${this.color}, ${alpha})`;
        c.fill();
        c.restore();
      }
    }

    let ripples: Ripple[] = [];
    let droplets: Droplet[] = [];
    let lastSpawnTime = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest("header") || target.closest(".animated-dock"))) {
        mouse.active = false;
        return;
      }

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const now = performance.now();
      // Limit frequency of ripple generation to keep visual balance
      if (now - lastSpawnTime > 40) {
        ripples.push(new Ripple(mouse.x, mouse.y));

        const vx = mouse.x - mouse.px;
        const vy = mouse.y - mouse.py;
        const speed = Math.hypot(vx, vy);

        // Spawn droplets on fast cursor movements
        if (speed > 5) {
          const dropCount = Math.min(4, Math.floor(speed / 4) + 1);
          for (let i = 0; i < dropCount; i++) {
            droplets.push(new Droplet(mouse.x, mouse.y, vx, vy));
          }
        }

        lastSpawnTime = now;
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Render all active ripples
      ripples = ripples.filter((r) => {
        r.update();
        r.draw(ctx);
        return r.life > 0;
      });

      // Render all active droplets
      droplets = droplets.filter((d) => {
        d.update();
        d.draw(ctx);
        return d.life > 0;
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
