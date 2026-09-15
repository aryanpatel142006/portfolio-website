import { feedbackEnabled, pingFeedback } from "@/lib/feedback";

/* Weekly touch so the free Supabase project never pauses for inactivity
   (schedule in vercel.json). Vercel signs cron calls with CRON_SECRET when
   that env var is set; anything else is turned away. */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  if (!feedbackEnabled()) return Response.json({ ok: true, skipped: "feedback disabled" });
  const ok = await pingFeedback();
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
