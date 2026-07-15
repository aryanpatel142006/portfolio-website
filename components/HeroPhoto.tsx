"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { unlockOffDuty } from "@/lib/offduty";

const CLICKS_TO_UNLOCK = 5;

/** The hero portrait with its cat-crossfade — and a secret: tap it 5× to unlock off-duty. */
export default function HeroPhoto({
  photo,
  photoHover,
  name,
}: {
  photo: string;
  photoHover?: string;
  name: string;
}) {
  const count = useRef(0);
  const [purring, setPurring] = useState(false);

  function onClick() {
    count.current += 1;
    if (count.current >= CLICKS_TO_UNLOCK) {
      count.current = 0;
      setPurring(true);
      unlockOffDuty();
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${name} — portrait`}
      className="group relative w-40 shrink-0 cursor-pointer select-none sm:w-44"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 shadow-lg transition-shadow duration-500 group-hover:shadow-2xl">
        <Image
          src={photo}
          alt={name}
          fill
          priority
          sizes="(max-width: 640px) 160px, 176px"
          className="object-cover opacity-100 transition-opacity duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-50"
        />
        {photoHover && (
          <Image
            src={photoHover}
            alt=""
            fill
            sizes="(max-width: 640px) 160px, 176px"
            className={`object-cover transition-opacity duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-80 ${
              purring ? "opacity-80" : "opacity-0"
            }`}
          />
        )}
      </div>
    </button>
  );
}
