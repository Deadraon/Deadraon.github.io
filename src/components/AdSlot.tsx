"use client";

import { useEffect, useRef } from "react";

// Supported standard IAB ad sizes
const SIZES = {
  rectangle: { width: 336, height: 280 },   // Medium Rectangle — best RPM for tool pages
  leaderboard: { width: 728, height: 90 },  // Leaderboard — above/below content on desktop
  banner: { width: 320, height: 50 },        // Mobile Banner
} as const;

type AdSize = keyof typeof SIZES;

interface AdSlotProps {
  size: AdSize;
  slot: string;        // AdSense data-ad-slot value — fill in once you have a publisher ID
  className?: string;
}

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "";

export function AdSlot({ size, slot, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const { width, height } = SIZES[size];

  useEffect(() => {
    if (!ADS_ENABLED || !PUBLISHER_ID) return;
    try {
      // @ts-expect-error — adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silently ignore if ad blocker prevents this
    }
  }, []);

  // Always reserve the space to prevent layout shift (CLS)
  if (!ADS_ENABLED || !PUBLISHER_ID) {
    return (
      <div
        aria-hidden
        style={{ width, height, minWidth: width, minHeight: height }}
        className={`bg-transparent ${className}`}
      />
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className}`}
      style={{ display: "block", width, height }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format="fixed"
    />
  );
}
