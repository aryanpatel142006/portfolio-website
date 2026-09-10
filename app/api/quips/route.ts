import { generateText, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { offDuty } from "@/lib/content";

/**
 * Fresh "i could've X instead lol" lines, minted by the chatbot's model and
 * cached for twelve hours, so every visitor in that window shares one call.
 * The hours come from the content snapshot (the live figure differs by a
 * rounding error and this is a joke, not a ledger). No key → empty list; the
 * client always has the curated pool to fall back on.
 */
export const revalidate = 43200;
export const maxDuration = 20;

const MODEL: string | LanguageModel | null = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? google("gemini-3.6-flash")
  : process.env.AI_GATEWAY_API_KEY
    ? (process.env.CHAT_MODEL ?? "google/gemini-2.5-flash-lite")
    : null;

function clean(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  const out: string[] = [];
  for (const raw of lines) {
    if (typeof raw !== "string") continue;
    let l = raw.trim().toLowerCase().replace(/[.!\s]+$/g, "").replace(/\s+/g, " ");
    l = l.replace(/^(i |that's .*? hours\.? i )/, "");
    if (!l.startsWith("could've") && !l.startsWith("could have")) continue;
    l = l.replace(/^could have/, "could've");
    if (l.length < 12 || l.length > 90 || /[—–]/.test(l)) continue;
    if (!out.includes(l)) out.push(l);
  }
  return out.slice(0, 12);
}

export async function GET() {
  const minutes = offDuty.anilist.snapshot?.minutesWatched ?? 0;
  const hours = Math.round(minutes / 60 / 50) * 50;
  if (!MODEL || hours <= 0) return Response.json({ lines: [] });

  try {
    const { text } = await generateText({
      model: MODEL,
      temperature: 1.1,
      prompt: [
        `You write one-line jokes for the personal website of a college student who has watched roughly ${hours} hours of anime in total.`,
        `Write 12 different completions for the sentence "that's ${hours} hours. i ___ instead lol".`,
        `Each completion starts with "could've" and names ONE concrete thing that plausibly takes about ${hours} hours: learning a skill, a certification, a journey, a feat, a ridiculous but real comparison.`,
        `Rules: lowercase, no emoji, no em dashes, under 80 characters, no trailing period, specific and funny rather than generic, nothing mean or crude, no repeats of "pilot license", "marathon", "rubik's cube", "walk across the US".`,
        `Return ONLY a JSON array of 12 strings.`,
      ].join("\n"),
    });
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    const lines = start >= 0 && end > start ? clean(JSON.parse(text.slice(start, end + 1))) : [];
    return Response.json({ lines });
  } catch {
    return Response.json({ lines: [] });
  }
}
