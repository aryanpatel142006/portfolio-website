import { feedbackEnabled, listFeedback } from "@/lib/feedback";

/* The public face of the guest book: only notes the owner approved, and
   only the fields a visitor should see (no browser, path or hash). Static
   and refreshed every five minutes; approving a note in /admin revalidates
   it at once. */

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  if (!feedbackEnabled()) return Response.json({ notes: [] });
  try {
    const rows = await listFeedback({ approvedOnly: true, limit: 24 });
    return Response.json({
      notes: rows.map((r) => ({ id: r.id, note: r.note, name: r.name, night: r.night, at: r.created_at })),
    });
  } catch {
    return Response.json({ notes: [] });
  }
}
