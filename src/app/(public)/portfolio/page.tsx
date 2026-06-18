import type { Metadata } from "next";
import PortfolioPageContent from "./PortfolioPageContent";

export const metadata: Metadata = {
  title: "Software Showcase & GitHub Repositories | Deadraon Portfolio",
  description: "Browse completed client showcase systems and open-source GitHub repositories built by Kunal Chauhan (@Deadraon). Includes mobile applications, web apps, SaaS dashboards, and utilities.",
  keywords: ["Kunal Chauhan Portfolio", "Deadraon github repos", "Next.js projects example", "Flutter app designs showcase", "Software engineer portfolio"],
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
