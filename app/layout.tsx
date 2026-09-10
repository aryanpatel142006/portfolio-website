import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import SiteHeader from "@/components/SiteHeader";
import Cursor from "@/components/fx/Cursor";
import Spotlight from "@/components/fx/Spotlight";
import Sparks from "@/components/fx/Sparks";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// arcade face for the off-duty world's score counters
const arcade = Press_Start_2P({
  weight: "400",
  variable: "--font-arcade",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aryan.is-a.dev"),
  title: profile.name,
  description: profile.tagline,
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: "website",
    url: "https://aryan.is-a.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description: profile.tagline,
  },
  alternates: { canonical: "/" },
};

// Browser chrome (mobile address bar, PWA title bar) matches the paper/ink
// theme instead of defaulting to white.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
};

/* Runs before paint: honors a saved choice, else the system preference.
   Keeping it inline (not a module) is what prevents the theme flash. */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${arcade.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full bg-background">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a
          href="#top"
          className="sr-only z-[100] rounded-md border border-border-strong bg-surface px-4 py-2 font-mono text-[12px] text-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          skip to content
        </a>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon@2.16.0/devicon.min.css"
        />
        <Spotlight />
        <ScrollProgress />
        <SiteHeader />
        <div className="page-rails mx-auto w-[94%] sm:w-[90%] lg:w-[82%] xl:w-[70%] 2xl:w-[58%]">
          {children}
        </div>
        <CommandPalette />
        <Cursor />
        <Sparks />
      </body>
    </html>
  );
}
