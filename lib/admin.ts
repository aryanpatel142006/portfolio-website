import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** The owner's door to /admin: one shared token (FEEDBACK_READ_TOKEN),
    kept in an httpOnly cookie after sign-in. Server-only. */

export const ADMIN_COOKIE = "admin";
const MONTH = 60 * 60 * 24 * 30;

export function tokenMatches(given: string | undefined | null): boolean {
  const want = process.env.FEEDBACK_READ_TOKEN;
  if (!want || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return tokenMatches(jar.get(ADMIN_COOKIE)?.value);
}

export async function grantAdmin(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
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
