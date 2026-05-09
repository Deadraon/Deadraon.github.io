import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { GithubTransition } from "@/components/ui/github-transition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Deadraon | Full Stack App & Web Developer",
    template: "%s | Deadraon",
  },
  description:
    "Deadraon — Premium Full Stack Developer specializing in modern web and mobile apps. React, Next.js, Node.js, Flutter. Hire for your next project.",
  keywords: [
    "Full Stack Developer", "Web Developer", "App Developer",
    "React", "Next.js", "Flutter", "Freelance Developer", "Deadraon",
  ],
  authors: [{ name: "Deadraon" }],
  creator: "Deadraon",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Deadraon | Full Stack App & Web Developer",
    description: "Premium Full Stack Developer — React, Next.js, Node.js, Flutter.",
    siteName: "Deadraon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deadraon | Full Stack App & Web Developer",
    description: "Premium Full Stack Developer for hire.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
            <GithubTransition />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
