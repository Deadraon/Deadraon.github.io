"use client";
 
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SlideToMessage } from "@/components/ui/slide-to-message";
import { QuickMessageModal } from "@/components/ui/quick-message-modal";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
 
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  return (
    <div className="relative min-h-screen text-foreground font-sans antialiased selection:bg-primary/30 overflow-x-hidden flex flex-col bg-[#070814]">
      {/* State-of-the-Art Interactive Canvas & Particle Mesh Background */}
      <InteractiveBackground />

      {/* Fixed Navbar — always visible on all pages */}
      <Navbar />
 
      <div className="relative z-10 flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
        {!isHome && <Footer />}
      </div>

      {/* Mobile Slide-to-Message */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <SlideToMessage
          onSlideComplete={() => setIsModalOpen(true)}
          className="md:hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Quick Message Dialog Form */}
      <QuickMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}


