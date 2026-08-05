import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import {
  profile,
  bio,
  statusBadges,
  experiences,
  projects,
  awards,
} from "@/lib/content";

// Model is a Vercel AI Gateway string. Override with CHAT_MODEL if desired.
// const MODEL = process.env.CHAT_MODEL ?? "anthropic/claude-haiku-4.5";
// const MODEL = process.env.CHAT_MODEL ?? "anthropic/claude-3-haiku";
const MODEL = process.env.CHAT_MODEL ?? "google/gemini-2.5-flash";

// Allow streaming responses up to 30s
export const maxDuration = 30;

function buildSystemPrompt(): string {
  const badges = statusBadges
    .map((b) => `${b.role} at ${b.org}`)
    .join(", ");

  const exp = experiences
    .map((e) => `- ${e.role} at ${e.org} (${e.period})`)
    .join("\n");

  const proj = projects
    .map((p) => {
      const wins = p.badges?.map((b) => b.label).join(", ");
      return `- ${p.title} (${p.date})${p.description ? `: ${p.description}` : ""}${
        wins ? ` [${wins}]` : ""
      }`;
    })
    .join("\n");

  const awardList = awards.map((a) => a.name).join(", ");

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
    experiences.length ? `=== EXPERIENCE ===\n${exp}` : ``,
    ``,
    projects.length ? `=== PROJECTS ===\n${proj}` : ``,
    ``,
    awards.length ? `=== AWARDS / RECOGNITION ===\n${awardList}` : ``,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      // Surface the real provider error to the client (helps diagnose setup,
      // e.g. missing key or AI Gateway billing). Trim noisy prefixes.
      onError: (error) => {
        const msg =
          error instanceof Error ? error.message : String(error ?? "");
        return msg || "The model request failed.";
      },
    }),
  });
}
