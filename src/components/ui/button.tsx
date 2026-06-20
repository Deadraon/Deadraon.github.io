"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   SVG filter that creates the liquid-glass wavy distortion.
   Mount once per page (GlassCard includes it automatically).
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   GlassCard — liquid glass card wrapper for any content.
   Usage:
     <GlassCard className="p-6 rounded-3xl">content</GlassCard>
───────────────────────────────────────────────────────────── */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: string
  hoverScale?: boolean
  contentClassName?: string
}

export function GlassCard({
  children,
  className,
  rounded = "rounded-3xl",
  hoverScale = false,
  contentClassName,
  style,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        rounded,
        hoverScale && "transition-transform duration-300 hover:scale-[1.02]",
        className
      )}
      style={style}
      {...props}
    >
      {/* Glassmorphic backdrop blur layer */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backdropFilter: 'blur(12px) brightness(1.04) saturate(1.1)' }}
      />
      {/* Glass rim — light top edge + subtle shadow */}
      <div
        className={cn("absolute inset-0 pointer-events-none", rounded)}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.06) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      />
      {/* Content */}
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Standard Button — unchanged variants retained
───────────────────────────────────────────────────────────── */
const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
        outline: "border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/10 hover:text-white text-white/80",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]",
        glass:
          "bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 shadow-lg transition-all duration-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

/* ─────────────────────────────────────────────────────────────
   LiquidButton — pill-shaped liquid glass button
───────────────────────────────────────────────────────────── */
interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  size?: "sm" | "default" | "lg" | "xl"
}

export function LiquidButton({
  className,
  size = "default",
  asChild = false,
  children,
  ...props
}: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button"
  const sizeClasses = {
    sm: "h-8 px-4 text-xs",
    default: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-base",
    xl: "h-14 px-9 text-lg font-semibold",
  }[size]

  return (
    <div className="relative inline-flex rounded-full p-[1px] bg-gradient-to-b from-white/15 to-white/3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Glassmorphic backdrop blur layer */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden -z-10"
        style={{ backdropFilter: 'blur(10px) brightness(1.04) saturate(1.1)' }}
      />
      {/* Rim light */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 60%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.05), 0 0 20px rgba(255,255,255,0.05)",
        }}
      />
      <Comp
        className={cn(
          "relative z-10 rounded-full inline-flex items-center justify-center gap-2 font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
          sizeClasses,
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </div>
  )
}

export { Button, buttonVariants }
