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
  certifications,
  education,
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
