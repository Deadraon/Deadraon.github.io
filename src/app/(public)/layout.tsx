"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen bg-[#030308] bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.06),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.06),_transparent_45%)] text-foreground font-sans antialiased selection:bg-primary/30 overflow-x-hidden flex flex-col">
      {/* Stable Background Video */}
      <video
        src="/background_combined.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-85"
      />
      {/* Soft Ambient Overlay with Gradient Glows */}
      <div className="fixed inset-0 bg-black/25 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_50%)] z-5 pointer-events-none" />



      {/* Fixed Navbar — always visible on all pages */}
      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
        {!isHome && <Footer />}
      </div>
    </div>
  );
}


