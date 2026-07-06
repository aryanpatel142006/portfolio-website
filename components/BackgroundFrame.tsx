"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { backgroundOverlay } from "@/lib/content";

const lightOverlay = 0.6;
const darkOverlay = 0.9;
const storageKey = "portfolio-background-overlay";

export default function BackgroundFrame() {
  const [overlay, setOverlay] = useState(backgroundOverlay);

  useEffect(() => {
    const savedOverlay = window.localStorage.getItem(storageKey);
    if (savedOverlay === "0.6" || savedOverlay === "0.9") {
      setOverlay(Number(savedOverlay));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(overlay));
  }, [overlay]);

  const toggleOverlay = () => {
    setOverlay((current) => (current === lightOverlay ? darkOverlay : lightOverlay));
  };

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url("/bg2.png")',
          backgroundPosition: "center top",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0d1011] via-[#101414] to-[#0e1212] transition-opacity duration-300 ease-out"
        style={{ opacity: overlay }}
      />
      <button
        type="button"
        onClick={toggleOverlay}
        aria-label={overlay === lightOverlay ? "Switch to darker background" : "Switch to lighter background"}
        aria-pressed={overlay === darkOverlay}
        title={overlay === lightOverlay ? "Darker theme" : "Lighter theme"}
        className="fixed right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/25 text-foreground shadow-lg backdrop-blur-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/35 sm:right-6 sm:top-6"
      >
        {overlay === lightOverlay ? (
          <Moon className="h-5 w-5" aria-hidden />
        ) : (
          <SunMedium className="h-5 w-5" aria-hidden />
        )}
      </button>
    </>
  );
}