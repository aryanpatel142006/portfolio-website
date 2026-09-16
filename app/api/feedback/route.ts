import { isNight } from "@/lib/night-palettes";
import { feedbackEnabled, hashIp, insertFeedback, listFeedback, recentCount } from "@/lib/feedback";
import { isAdmin, tokenMatches } from "@/lib/admin";

/* The off-duty guest book.
   POST: one note from a visitor (no login; length caps, a honeypot, and a
         per-visitor hourly limit stand in for auth).
   GET:  the owner's private read, only with the FEEDBACK_READ_TOKEN. Nothing
         here is ever public; a future showcase page reads approved rows
         server-side. */

export const dynamic = "force-dynamic";

const NOTE_MIN = 3;
const NOTE_MAX = 800;
const NAME_MAX = 40;
const PER_HOUR = 3;

type Body = { note?: unknown; name?: unknown; night?: unknown; path?: unknown; website?: unknown };

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

export async function POST(req: Request) {
  if (!feedbackEnabled()) return Response.json({ ok: false, reason: "disabled" }, { status: 503 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, reason: "bad json" }, { status: 400 });
  }

  // honeypot: real visitors never see this field, bots fill everything
  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const note = typeof body.note === "string" ? body.note.replace(/\s+/g, " ").trim() : "";
  if (note.length < NOTE_MIN || note.length > NOTE_MAX) {
    return Response.json({ ok: false, reason: "note length" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim().slice(0, NAME_MAX) : "";
  const night = typeof body.night === "string" && isNight(body.night) ? body.night : null;
  const path = typeof body.path === "string" ? body.path.slice(0, 120) : null;
  const ua = req.headers.get("user-agent")?.slice(0, 200) ?? null;

  try {
    const ip_hash = await hashIp(clientIp(req));
    if ((await recentCount(ip_hash, 60 * 60 * 1000)) >= PER_HOUR) {
      return Response.json({ ok: false, reason: "slow down" }, { status: 429 });
    }
    await insertFeedback({ note, name: name || null, night, path, ua, ip_hash });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[feedback]", err);
    return Response.json({ ok: false, reason: "storage" }, { status: 503 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? url.searchParams.get("token");
  // the bearer token, or the /admin cookie
  if (!tokenMatches(given) && !(await isAdmin())) {
    return new Response("not found", { status: 404 });
  }
  if (!feedbackEnabled()) return Response.json({ enabled: false, rows: [] });
  try {
    const rows = await listFeedback({ approvedOnly: url.searchParams.get("approved") === "1" });
    return Response.json({ enabled: true, count: rows.length, rows });
  } catch (err) {
    console.error("[feedback]", err);
    return Response.json({ enabled: true, error: "storage" }, { status: 503 });
  }
}
