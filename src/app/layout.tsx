import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import CursorWater from "@/components/CursorWater";

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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Kunal Chauhan",
                url: "https://deadraon.dev",
                jobTitle: "Full Stack Developer",
                sameAs: [
                  "https://github.com/Deadraon",
                  "https://twitter.com/Deadraon",
                ],
              }),
            }}
          />
          {gaId && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
        </head>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <CursorWater />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
