"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Code2, LayoutDashboard, FolderOpen, Users, MessageSquare, Star, Settings, Briefcase, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "All Projects", icon: FolderOpen },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/contacts", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/tool-requests", label: "Tool Requests", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none"><span className="gradient-text">Dead</span>raon</p>
            <p className="text-xs text-amber-500 mt-0.5 font-medium">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <div>
          <p className="text-sm font-medium">Deadraon</p>
          <p className="text-xs text-amber-500 font-medium">Administrator</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg">
        <Menu className="w-5 h-5" />
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-card border-r border-border h-full flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
