import {
  generateText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type LanguageModel,
} from "ai";
import { google } from "@ai-sdk/google";
import {
  profile,
  bio,
  statusBadges,
  experiences,
  projects,
  awards,
  certifications,
  education,
  socials,
} from "@/lib/content";

/**
 * Model failover chain — ranked best → worst, all Vercel AI Gateway strings.
 * The Gateway free tier rate-limits per model, so when the top model is
 * limited we fall through the chain and put the limited one in a cooldown;
 * once the cooldown lapses the next request tries the best model again.
 * Override with CHAT_MODELS (comma-separated) without touching code.
 *
 * As of 2026-08 these are the only two models this account's free tier
 * actually serves — everything else returns rate-limited immediately.
 */
type ChainEntry = { id: string; model: string | LanguageModel };

const MODEL_CHAIN: ChainEntry[] = (
  process.env.CHAT_MODELS ??
  process.env.CHAT_MODEL ??
  "google/gemini-2.5-flash,google/gemini-2.5-flash-lite"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)
  .map((id) => ({ id, model: id }));

// Independent free pool: a direct Google AI Studio key (free tier: ~10 req/min,
// hundreds/day) sits below the Gateway models. Zero config here — just add
// GOOGLE_GENERATIVE_AI_API_KEY to the env and these activate.
if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  MODEL_CHAIN.push(
    { id: "google-direct/gemini-2.5-flash", model: google("gemini-2.5-flash") },
    { id: "google-direct/gemini-2.5-flash-lite", model: google("gemini-2.5-flash-lite") },
  );
}

// How long a rate-limited model sits out before we try it again.
const COOLDOWN_MS = 90_000;

// Module-level ledger: modelId → epoch-ms until which it's benched.
// Best-effort by design — it resets on cold starts and isn't shared across
// serverless instances, which only costs us one extra failed attempt.
const benchedUntil = new Map<string, number>();

// Allow streaming responses up to 30s
export const maxDuration = 30;

function isRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /rate.?limit/i.test(msg) || /429/.test(msg);
}

function buildSystemPrompt(): string {
  const badges = statusBadges
    .map((b) => `${b.role} at ${b.org}`)
    .join(", ");

  const exp = experiences
    .map((e) => {
      const bullets = e.bullets?.length
        ? `\n${e.bullets.map((b) => `    • ${b}`).join("\n")}`
        : "";
      return `- ${e.role} at ${e.org} (${e.period})${bullets}`;
    })
    .join("\n");

  const proj = projects
    .map((p) => {
      const wins = p.badges?.map((b) => b.label).join(", ");
      return `- ${p.title} (${p.date})${p.description ? `: ${p.description}` : ""}${
        wins ? ` [${wins}]` : ""
      }`;
    })
    .join("\n");

  const awardList = awards
    .map((a) => (a.detail ? `${a.name} (${a.detail})` : a.name))
    .join(", ");

  const certList = certifications
    .map((c) => `${c.name} — ${c.issuer}`)
    .join(", ");

  const edu = `${education.degree} at ${education.school} (${education.period}, GPA ${education.gpa}, ${education.honors.join(", ")})`;

  return [
    `You are ${profile.name}'s personal website assistant. You answer questions about ${profile.name} in the first person, as if you are ${profile.name} speaking casually.`,
    ``,
    `Style: warm, concise, lowercase, friendly — matching a minimalist personal site. Keep answers short (1-4 sentences unless asked for detail). Never invent facts. If something isn't covered below, say you're not sure and point them to the contact links.`,
    ``,
    `=== ABOUT ME ===`,
    bio,
    ``,
    badges ? `Currently: ${badges}.` : ``,
    ``,
    `=== EDUCATION ===\n${edu}`,
    ``,
    experiences.length ? `=== EXPERIENCE ===\n${exp}` : ``,
    ``,
    projects.length ? `=== PROJECTS ===\n${proj}` : ``,
    ``,
    awards.length ? `=== AWARDS / RECOGNITION ===\n${awardList}` : ``,
    ``,
    certifications.length ? `=== CERTIFICATIONS ===\n${certList}` : ``,
  ]
    .filter(Boolean)
    .join("\n");
}

/** In-character response for the worst case: every model is benched. */
function exhaustedMessage(): string {
  const email = socials
    .find((s) => s.type === "email")
    ?.href.replace("mailto:", "");
  return `whoa — i'm getting a lot of questions right now and my free-tier brain needs a minute to cool down. try me again in a bit${
    email ? `, or just email the real me: ${email}` : ""
  } 🙂`;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);
  const system = buildSystemPrompt();

  // Walk the chain: best model first, skipping anything still cooling down.
  // Benched models are only skipped, never removed — the ledger entry
  // expiring is what promotes traffic back to the top model.
  let text: string | null = null;
  let modelUsed = "none";
  const now = Date.now();
  const eligible = MODEL_CHAIN.filter((e) => (benchedUntil.get(e.id) ?? 0) < now);
  // If literally everything is benched, still try the full chain — the
  // ledger may be stale (limits can reset before our cooldown lapses).
  const attempts = eligible.length > 0 ? eligible : MODEL_CHAIN;

  for (const entry of attempts) {
    try {
      const result = await generateText({
        model: entry.model,
        system,
        messages: modelMessages,
        maxRetries: 0, // fail fast — the fallback IS the retry strategy
      });
      text = result.text;
      modelUsed = entry.id;
      benchedUntil.delete(entry.id);
      break;
    } catch (err) {
      if (isRateLimit(err)) {
        benchedUntil.set(entry.id, Date.now() + COOLDOWN_MS);
        continue; // next model in the chain
      }
      // A non-rate-limit error on one provider can still be worth retrying
      // on the next entry (e.g. gateway outage vs direct key) — log and move on.
      console.error("chat: failure on", entry.id, err);
      continue;
    }
  }

  const finalText = text ?? exhaustedMessage();

  // Stream the answer to the client in small chunks so the terminal keeps
  // its typing feel even though generation happened in one shot.
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "0";
      writer.write({ type: "text-start", id });
      const words = finalText.split(/(?<=\s)/);
      for (let i = 0; i < words.length; i += 3) {
        writer.write({
          type: "text-delta",
          id,
          delta: words.slice(i, i + 3).join(""),
        });
        if (i + 3 < words.length) {
          await new Promise((r) => setTimeout(r, 24));
        }
      }
      writer.write({ type: "text-end", id });
    },
  });

  // Debug-friendly: which model (if any) produced this answer.
  return createUIMessageStreamResponse({
    stream,
    headers: { "x-chat-model": modelUsed },
  });
}
