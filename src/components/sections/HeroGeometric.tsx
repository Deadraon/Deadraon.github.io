"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  borderColor?: string;
  bgColor?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  borderColor = "border-blue-500/30",
  bgColor = "bg-blue-950/20",
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
            "absolute inset-0 rounded-full border backdrop-blur-md shadow-md",
            borderColor,
            bgColor
          )}
        />
      </motion.div>
    </motion.div>
  );
}

interface HeroGeometricBackgroundProps {
  isHovered?: boolean;
  mousePos?: { x: number; y: number };
  glowColors?: { color1: string; color2: string };
}

export function HeroGeometricBackground({}: HeroGeometricBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#090b12]">
      {/* Floating Animated Solid Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={620}
          height={145}
          rotate={12}
          borderColor="border-blue-500/40"
          bgColor="bg-blue-950/30"
          className="left-[-10%] md:left-[-4%] top-[12%] md:top-[18%]"
        />

        <ElegantShape
          delay={0.5}
          width={520}
          height={125}
          rotate={-15}
          borderColor="border-slate-700"
          bgColor="bg-slate-900/40"
          className="right-[-5%] md:right-[0%] top-[60%] md:top-[65%]"
        />

        <ElegantShape
          delay={0.4}
          width={320}
          height={85}
          rotate={-8}
          borderColor="border-cyan-500/40"
          bgColor="bg-cyan-950/30"
          className="left-[4%] md:left-[8%] bottom-[8%] md:bottom-[12%]"
        />

        <ElegantShape
          delay={0.6}
          width={220}
          height={65}
          rotate={20}
          borderColor="border-sky-500/40"
          bgColor="bg-sky-950/30"
          className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
        />
      </div>
    </div>
  );
}

