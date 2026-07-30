"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-purple-500/[0.2]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -120,
        rotate: rotate - 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 18, 0],
          rotate: [rotate, rotate + 3, rotate],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[12px] border border-white/[0.18]",
            "shadow-[0_8px_32px_0_rgba(124,58,237,0.15)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

interface HeroGeometricBackgroundProps {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColors: { color1: string; color2: string };
}

export function HeroGeometricBackground({
  isHovered,
  mousePos,
  glowColors,
}: HeroGeometricBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* SaaS Geometric Background Base Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.05] to-cyan-500/[0.08] blur-3xl" />

      {/* Floating Glassmorphic Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={620}
          height={145}
          rotate={12}
          gradient="from-indigo-500/[0.22] via-purple-500/[0.12]"
          className="left-[-10%] md:left-[-4%] top-[12%] md:top-[18%]"
        />

        <ElegantShape
          delay={0.5}
          width={520}
          height={125}
          rotate={-15}
          gradient="from-pink-500/[0.2] via-rose-500/[0.1]"
          className="right-[-5%] md:right-[0%] top-[60%] md:top-[65%]"
        />

        <ElegantShape
          delay={0.4}
          width={320}
          height={85}
          rotate={-8}
          gradient="from-violet-500/[0.22] via-indigo-500/[0.12]"
          className="left-[4%] md:left-[8%] bottom-[8%] md:bottom-[12%]"
        />

        <ElegantShape
          delay={0.6}
          width={220}
          height={65}
          rotate={20}
          gradient="from-cyan-500/[0.2] via-blue-500/[0.1]"
          className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
        />

        <ElegantShape
          delay={0.7}
          width={160}
          height={45}
          rotate={-25}
          gradient="from-amber-400/[0.18] via-purple-500/[0.1]"
          className="left-[18%] md:left-[24%] top-[4%] md:top-[8%]"
        />
      </div>

      {/* Interactive Mouse Spotlight Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(circle 550px at ${mousePos.x}px ${mousePos.y}px, ${glowColors.color1}, ${glowColors.color2}, transparent 80%)`,
        }}
      />

      {/* Top and bottom subtle overlay gradients for seamless blending */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070814]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070814]/60 to-transparent pointer-events-none" />
    </div>
  );
}

