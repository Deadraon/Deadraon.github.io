import { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ContactSection } from "@/components/sections/contact";
import { StatsSection } from "@/components/sections/stats";

export const metadata: Metadata = {
  title: "Deadraon | Full Stack App & Web Developer",
  description: "Premium Full Stack Developer — React, Next.js, Node.js, Flutter. Building high-quality web & mobile applications that scale.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <SkillsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
