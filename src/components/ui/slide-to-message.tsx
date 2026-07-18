"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideToMessageProps {
  onSlideComplete: () => void;
  className?: string;
}

export function SlideToMessage({ onSlideComplete, className }: SlideToMessageProps) {
  const x = useMotionValue(0);
  // Transform x position to opacity of the helper text (fades as you slide)
  const textOpacity = useTransform(x, [0, 160], [1, 0]);
  const handleBg = useTransform(
    x,
    [0, 180],
    ["rgba(255, 255, 255, 0.08)", "rgba(124, 58, 237, 0.8)"] // turns purple when dragged
  );

  const dragWidth = 190; // drag limit inside the 250px container

  const handleDragEnd = () => {
    if (x.get() >= dragWidth - 15) {
      // Trigger callback
      onSlideComplete();
    }
    // Snap back to starting position
    x.set(0);
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-[250px] h-[48px] rounded-full bg-black/60 backdrop-blur-xl border border-white/10 p-1 overflow-hidden select-none pointer-events-auto shadow-lg",
        className
      )}
    >
      {/* Background text */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-semibold text-white/50 tracking-wider pl-8"
      >
        <span>Slide to Message</span>
        <ArrowRight size={12} className="ml-1 animate-pulse" />
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: dragWidth }}
        dragElastic={0.05}
        dragMomentum={false}
        style={{ x, backgroundColor: handleBg }}
        onDragEnd={handleDragEnd}
        className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-white/10 cursor-grab active:cursor-grabbing text-white shadow-md z-10"
      >
        <MessageSquare size={16} />
      </motion.div>
    </div>
  );
}
