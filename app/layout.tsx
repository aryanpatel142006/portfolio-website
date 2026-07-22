import type { Metadata } from "next";
import { EB_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import BackgroundFrame from "@/components/BackgroundFrame";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";

const serif = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: profile.name,
  description: profile.tagline,
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full bg-background">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon@2.16.0/devicon.min.css"
        />
        <BackgroundFrame />
        <ScrollProgress />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
