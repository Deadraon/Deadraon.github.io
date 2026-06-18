import { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { StatsSection } from "@/components/sections/stats";
import { AdminRequestAlert } from "@/components/admin/AdminRequestAlert";

export const metadata: Metadata = {
  title: "Deadraon | Premium Full Stack App & Web Developer",
  description: "Kunal Chauhan (@Deadraon) is a professional Senior Full Stack App & Web Developer. Hire for modern React, Next.js web systems, Flutter mobile app development, scalable Node.js backends, and custom integrations.",
  keywords: ["Kunal Chauhan", "Deadraon", "Full Stack Developer India", "Nextjs React Developer", "Flutter App Developer", "Hire Freelance Developer", "Custom Software Development"],
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <AdminRequestAlert />
    </>
  );
}
