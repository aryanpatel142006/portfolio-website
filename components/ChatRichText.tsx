"use client";

import { socials } from "@/lib/content";
import { SocialGlyph } from "./icons";

/**
 * Renders assistant chat text with embed tags expanded into link chips.
 * The model emits tokens like [[email]] / [[github]] / [[linkedin]] /
 * [[website]] / [[resume]] (taught in the system prompt); each resolves
 * against the real `socials` data, so URLs can never be hallucinated.
 */

// Split-with-capture keeps the tokens in the output array, no regex state.
const TOKEN_SPLIT_RE = /(\[\[(?:email|github|linkedin|website|resume|x|devpost)\]\])/g;
// A token still streaming in at the end of the text ("[[ema") — hide it
// until it completes so chips never flash as raw text.
const PARTIAL_RE = /\[\[[a-z]*\]?$/;

function Chip({ type }: { type: string }) {
  const social = socials.find((s) => s.type === type);
  if (!social) return <span>{type}</span>;

  const label =
    social.type === "email"
      ? social.href.replace("mailto:", "")
      : social.label.toLowerCase();

  return (
    <a
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="mx-0.5 inline-flex translate-y-[-1px] items-center gap-1.5 rounded-md border border-accent/40 bg-accent/[0.08] px-2 py-0.5 align-middle font-mono text-[11px] text-accent transition-all duration-200 hover:border-accent hover:bg-accent hover:text-accent-contrast"
    >
      <SocialGlyph type={social.type} width={11} height={11} aria-hidden />
      {label}
    </a>
  );
}

// **bold** spans from the model's (allowed) markdown emphasis.
const BOLD_SPLIT_RE = /(\*\*[^*]+\*\*)/g;

function TextWithBold({ text }: { text: string }) {
  const parts = text.split(BOLD_SPLIT_RE);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function ChatRichText({ text }: { text: string }) {
  const clean = text.replace(PARTIAL_RE, "");
  const parts = clean.split(TOKEN_SPLIT_RE);

  return (
    <span className="whitespace-pre-wrap text-foreground">
      {parts.map((part, i) =>
        part.startsWith("[[") && part.endsWith("]]") ? (
          <Chip key={i} type={part.slice(2, -2)} />
        ) : (
          <TextWithBold key={i} text={part} />
        ),
      )}
    </span>
  );
}
