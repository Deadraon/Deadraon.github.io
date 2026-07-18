"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Inline implementation of useOnClickOutside to avoid adding external npm package dependencies
function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

interface Tab {
  title: string;
  icon: LucideIcon;
  href: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

const MotionLink = motion.create(Link);

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandableTabsProps) {
  const pathname = usePathname();
  const [selected, setSelected] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  // When pathname changes, keep the matching tab active
  React.useEffect(() => {
    const activeIndex = tabs.findIndex(
      (tab) => tab.type !== "separator" && tab.href === pathname
    );
    setSelected(activeIndex !== -1 ? activeIndex : null);
  }, [pathname, tabs]);

  // Clicking outside collapses the hover/click state back to the active page
  useOnClickOutside(outsideClickRef, () => {
    const activeIndex = tabs.findIndex(
      (tab) => tab.type !== "separator" && tab.href === pathname
    );
    setSelected(activeIndex !== -1 ? activeIndex : null);
    onChange?.(activeIndex !== -1 ? activeIndex : null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const SeparatorComponent = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-white/10" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "expandable-tabs flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-1.5 shadow-lg pointer-events-auto",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <SeparatorComponent key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isSelected = selected === index;

        return (
          <MotionLink
            key={tab.title}
            href={tab.href}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-2 text-sm font-medium transition-colors duration-300",
              isSelected
                ? cn("bg-white/10 border border-white/5", activeColor)
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Icon size={20} className="shrink-0" />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </MotionLink>
        );
      })}
    </div>
  );
}
