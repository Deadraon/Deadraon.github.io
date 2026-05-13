import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore the projects and work of Kunal Chauhan, a Full Stack Developer specializing in React, Next.js, and Flutter.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
