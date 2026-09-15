/** Guest-book storage: a Supabase Postgres table reached through its REST
    layer with the service role key. Server-only (never import from a client
    component). Everything degrades to "disabled" when the env is missing,
    so the card simply does not render. */

export type FeedbackRow = {
  id: number;
  created_at: string;
  note: string;
  name: string | null;
  night: string | null;
  path: string | null;
  ua: string | null;
  approved: boolean;
};

export type FeedbackInsert = Omit<FeedbackRow, "id" | "created_at" | "approved"> & {
  ip_hash: string | null;
};

const TABLE = "feedback";

function env() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export function feedbackEnabled(): boolean {
  return env() !== null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/** Insert one note. Throws on any failure so the route can answer 503. */
export async function insertFeedback(row: FeedbackInsert): Promise<void> {
  const e = env();
  if (!e) throw new Error("feedback disabled");
  const res = await fetch(`${e.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers(e.key, { Prefer: "return=minimal" }),
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`supabase insert ${res.status}: ${await res.text()}`);
}

/** How many notes this visitor left in the last `windowMs`. */
export async function recentCount(ipHash: string, windowMs: number): Promise<number> {
  const e = env();
  if (!e) return 0;
  const since = new Date(Date.now() - windowMs).toISOString();
  const q = new URLSearchParams({
    select: "id",
    ip_hash: `eq.${ipHash}`,
    created_at: `gte.${since}`,
  });
  const res = await fetch(`${e.url}/rest/v1/${TABLE}?${q}`, {
    headers: headers(e.key, { Prefer: "count=exact", Range: "0-0" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`supabase count ${res.status}`);
  // Content-Range: 0-0/N  (or */0 when empty)
  const total = res.headers.get("content-range")?.split("/")[1];
  return Number(total ?? 0) || 0;
}

/** Newest first. `approvedOnly` is what a public showcase page would use. */
export async function listFeedback(opts: { approvedOnly?: boolean; limit?: number } = {}): Promise<FeedbackRow[]> {
  const e = env();
  if (!e) return [];
  const q = new URLSearchParams({
    select: "id,created_at,note,name,night,path,ua,approved",
    order: "created_at.desc",
    limit: String(Math.min(opts.limit ?? 500, 1000)),
  });
  if (opts.approvedOnly) q.set("approved", "eq.true");
  const res = await fetch(`${e.url}/rest/v1/${TABLE}?${q}`, {
    headers: headers(e.key),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`supabase list ${res.status}`);
  return (await res.json()) as FeedbackRow[];
}

/** Cheapest possible query, for the weekly keep-alive (free projects pause
    after a week without traffic). */
export async function pingFeedback(): Promise<boolean> {
  const e = env();
  if (!e) return false;
  const res = await fetch(`${e.url}/rest/v1/${TABLE}?select=id&limit=1`, {
    headers: headers(e.key),
    cache: "no-store",
  });
  return res.ok;
}

/** Salted, one-way. Good enough to rate-limit; useless for identifying anyone. */
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.FEEDBACK_SALT ?? process.env.SUPABASE_URL ?? "guest-book";
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
