"use client";
 
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { SlideToMessage } from "@/components/ui/slide-to-message";
import { QuickMessageModal } from "@/components/ui/quick-message-modal";
import { Home, User, Briefcase, Wrench, Terminal, HardDrive, Mail, CreditCard } from "lucide-react";
 
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const tabs = [
    { title: "Home", icon: Home, href: "/" },
    { title: "About", icon: User, href: "/about" },
    { title: "Portfolio", icon: Briefcase, href: "/portfolio" },
    { title: "Services", icon: Wrench, href: "/services" },
    { title: "Tools", icon: Terminal, href: "/tools" },
    { title: "Drive", icon: HardDrive, href: "/drive" },
    { type: "separator" as const },
    { title: "Contact", icon: Mail, href: "/contact" },
    { title: "Pay", icon: CreditCard, href: "/pay" },
  ];
 
  return (
    <div className="relative min-h-screen bg-[#030308] bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.06),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.06),_transparent_45%)] text-foreground font-sans antialiased selection:bg-primary/30 overflow-x-hidden flex flex-col">

      {/* Soft Ambient Overlay with Gradient Glows */}
      <div className="fixed inset-0 bg-black/25 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_50%)] z-5 pointer-events-none" />
 
      {/* Fixed Navbar — always visible on all pages */}
      <Navbar />
 
      <div className="relative z-10 flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
        {!isHome && <Footer />}
      </div>

      {/* Floating Bottom Navigation & Mobile Slide-to-Message */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-3">
        <SlideToMessage
          onSlideComplete={() => setIsModalOpen(true)}
          className="md:hidden"
        />
        <ExpandableTabs tabs={tabs} activeColor="text-purple-400" />
      </div>

      {/* Quick Message Dialog Form */}
      <QuickMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}


