"use client" 

import * as React from "react"
import { useRef } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
 
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
 
const cn = (...args: any[]) => twMerge(clsx(args));
 
export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}
 
export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  target?: string;
  label: string;
}
 
export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);
 
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-16 items-end gap-3 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-lg px-4 pb-3 relative pointer-events-auto",
        className,
      )}
    >
      {/* Background glass rim */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX} label={item.label}>
          <Link
            href={item.link}
            target={item.target}
            className="grow flex items-center justify-center w-full h-full text-white"
          >
            {item.Icon}
          </Link>
        </DockItem>
      ))}
    </motion.div>
  );
};
 
interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  label: string;
}
 
export const DockItem = ({ mouseX, children, label }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 70, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [40, 70], [1, 1.4]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -top-10 px-2 py-1 rounded bg-black/80 border border-white/10 text-white text-[10px] font-medium whitespace-nowrap pointer-events-none select-none animate-fade-in shadow-md">
          {label}
        </div>
      )}

      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className="rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-inner"
      >
        <motion.div
          style={{ scale: iconSpring }}
          className="flex items-center justify-center w-full h-full grow"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};
