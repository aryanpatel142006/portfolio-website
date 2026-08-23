import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import SiteHeader from "@/components/SiteHeader";

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
    card: "summary",
    title: profile.name,
    description: profile.tagline,
  },
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
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full bg-background">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon@2.16.0/devicon.min.css"
        />
        <ScrollProgress />
        <SiteHeader />
        <div className="page-rails mx-auto w-[94%] sm:w-[90%] lg:w-[82%] xl:w-[70%] 2xl:w-[58%]">
          {children}
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}
