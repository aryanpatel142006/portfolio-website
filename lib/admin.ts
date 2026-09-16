import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** The owner's door to /admin. Sign in with ADMIN_PASSWORD (or the read
    token); what the httpOnly cookie holds is a digest derived from the
    read token, never the password itself. Server-only. */

export const ADMIN_COOKIE = "admin";
const MONTH = 60 * 60 * 24 * 30;

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The bearer token for the JSON route: the read token only. */
export function tokenMatches(given: string | undefined | null): boolean {
  const want = process.env.FEEDBACK_READ_TOKEN;
  return !!want && !!given && same(given, want);
}

/** The /admin sign-in: the password, or the read token as a fallback. */
export function passwordMatches(given: string | undefined | null): boolean {
  if (!given) return false;
  const pw = process.env.ADMIN_PASSWORD;
  return (!!pw && same(given, pw)) || tokenMatches(given);
}

/** Session value: a digest of the read token, so the cookie is useless
    without the server's secret and never carries the password. */
function sessionValue(): string | null {
  const secret = process.env.FEEDBACK_READ_TOKEN;
  if (!secret) return null;
  return createHash("sha256").update(`${secret}:admin-session`).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const want = sessionValue();
  const got = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!want && !!got && same(got, want);
}

export async function grantAdmin(): Promise<void> {
  const value = sessionValue();
  if (!value) return;
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MONTH,
  });
}

export async function revokeAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
