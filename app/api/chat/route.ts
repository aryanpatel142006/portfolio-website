import {
  streamText,
  toUIMessageStream,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type LanguageModel,
  type TextStreamPart,
  type ToolSet,
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

// Independent free pool: a direct Google AI Studio key (free tier: ~10
// req/min, hundreds/day — far roomier than the Gateway free tier) LEADS the
// chain, since it also serves a newer model. Gateway entries become backup.
// Zero config here — just set GOOGLE_GENERATIVE_AI_API_KEY in the env.
// (Only gemini-3.6-flash is open to new free keys; lite variants are gated.)
if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  MODEL_CHAIN.unshift({
    id: "google-direct/gemini-3.6-flash",
    model: google("gemini-3.6-flash"),
  });
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
    `EMBED TAGS — when mentioning contact info or links, use these exact tags and they auto-render as clickable chips in the chat: [[email]] [[github]] [[linkedin]] [[website]] [[resume]]. Example: "you can reach me at [[email]] or check my code on [[github]]". Always prefer a tag over writing out a raw email address or URL. Don't repeat a tag you already sent earlier in the conversation unless the visitor asks for it again.`,
    ``,
    `You may use **bold** to emphasize project names, roles, and key numbers — it renders properly. No other markdown (no headings, lists, or links).`,
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
  const hasEmail = socials.some((s) => s.type === "email");
  return `whoa — i'm getting a lot of questions right now and need a minute to catch my breath. try me again in a bit${
    hasEmail ? `, or just email the real me: [[email]]` : ""
  } 🙂`;
}

/** Time to wait for a model's first token before trying the next one. */
const FIRST_TOKEN_TIMEOUT_MS = 15_000;

type Part = TextStreamPart<ToolSet>;

/**
 * Start streaming from a model, but don't commit until the first real
 * content part arrives — that's the moment we know it didn't rate-limit.
 * Returns the (tee'd, unconsumed) stream on success, null on failure.
 */
async function probeStream(
  model: string | LanguageModel,
  system: string,
  messages: Awaited<ReturnType<typeof convertToModelMessages>>,
): Promise<ReadableStream<Part> | null> {
  const result = streamText({
    model,
    system,
    messages,
    maxRetries: 0, // fail fast — the fallback chain IS the retry strategy
  });

  const [probe, rest] = result.stream.tee();
  const reader = probe.getReader();
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("first-token timeout")), FIRST_TOKEN_TIMEOUT_MS),
  );

  try {
    for (;;) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) throw new Error("stream ended with no content");
      if (value.type === "error") throw (value as { error?: unknown }).error ?? new Error("stream error");
      // boilerplate parts arrive before generation actually succeeds
      if (value.type === "start" || value.type === "start-step") continue;
      // any content part (text/reasoning delta) = the model is really talking
      break;
    }
    reader.cancel();
    return rest;
  } catch (err) {
    reader.cancel().catch(() => {});
    rest.cancel().catch(() => {});
    throw err;
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);
  const system = buildSystemPrompt();

  // Walk the chain: best model first, skipping anything still cooling down.
  // Benched models are only skipped, never removed — the ledger entry
  // expiring is what promotes traffic back to the top model.
  let committed: ReadableStream<Part> | null = null;
  let modelUsed = "none";
  const now = Date.now();
  const eligible = MODEL_CHAIN.filter((e) => (benchedUntil.get(e.id) ?? 0) < now);
  // If literally everything is benched, still try the full chain — the
  // ledger may be stale (limits can reset before our cooldown lapses).
  const attempts = eligible.length > 0 ? eligible : MODEL_CHAIN;

  for (const entry of attempts) {
    try {
      committed = await probeStream(entry.model, system, modelMessages);
      modelUsed = entry.id;
      benchedUntil.delete(entry.id);
      break;
    } catch (err) {
      if (isRateLimit(err)) {
        benchedUntil.set(entry.id, Date.now() + COOLDOWN_MS);
      } else {
        // A non-rate-limit error on one provider can still be worth retrying
        // on the next entry (gateway outage vs direct key) — log and move on.
        console.error("chat: failure on", entry.id, err);
      }
    }
  }

  // Real model: pipe its tokens straight through — visitors see live typing.
  // Exhausted: hand-stream the friendly cooldown message instead.
  const stream = committed
    ? toUIMessageStream({
        stream: committed,
        onError: () =>
          "hmm, i lost my train of thought — try asking that again?",
      })
    : createUIMessageStream({
        execute: async ({ writer }) => {
          const id = "0";
          const text = exhaustedMessage();
          writer.write({ type: "text-start", id });
          const words = text.split(/(?<=\s)/);
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
