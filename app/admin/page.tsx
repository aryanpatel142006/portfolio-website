import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import { feedbackEnabled, listFeedback, type FeedbackRow } from "@/lib/feedback";
import { NIGHT_PALETTES } from "@/lib/night-palettes";
import DeleteButton from "./DeleteButton";
import { removeNote, signIn, signOut, toggleApproved } from "./actions";

/* The owner's reading room for the guest book. One token gets in; every
   note is listed newest first with its night, page and browser; approve
   marks a note for the future showcase page; delete is two clicks. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "admin · guest book",
  robots: { index: false, follow: false },
};

type Show = "all" | "pending" | "approved";

const NIGHT_COLOR = Object.fromEntries(NIGHT_PALETTES.map((p) => [p.id, p.swatch[0]]));

function when(iso: string) {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  const rel = days === 0 ? "today" : days === 1 ? "yesterday" : days < 7 ? `${days} days ago` : "";
  const abs = d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return rel ? `${rel} · ${abs}` : abs;
}

function countThisWeek(rows: FeedbackRow[]) {
  const cutoff = Date.now() - 7 * 86_400_000;
  return rows.filter((r) => new Date(r.created_at).getTime() > cutoff).length;
}

function browser(ua: string | null) {
  if (!ua) return "";
  const os = /iPhone/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "";
  return [os, br].filter(Boolean).join(" · ");
}

function Gate({ wrong }: { wrong: boolean }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-[92%] max-w-md flex-col justify-center py-16 sm:w-[88%]">
      <p className="kicker mb-3">admin</p>
      <h1 className="display text-3xl text-foreground">guest book</h1>
      <form action={signIn} className="mt-8 flex flex-col gap-3">
        <label htmlFor="token" className="font-mono text-[11px] uppercase tracking-wider text-muted">
          password
        </label>
        <div className="field-focus flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5">
          <span className="font-mono text-accent" aria-hidden>
            &gt;
          </span>
          <input
            id="token"
            name="token"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-foreground placeholder:text-muted"
            placeholder="••••••••"
          />
        </div>
        {wrong && (
          <p role="alert" className="font-mono text-[11px] text-accent">
            that is not it.
          </p>
        )}
        <button
          type="submit"
          className="pressable mt-1 self-start rounded-full border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-[11px] text-foreground transition-colors hover:bg-accent hover:text-accent-contrast"
        >
          open the book
        </button>
      </form>
    </main>
  );
}

function Note({ row }: { row: FeedbackRow }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] text-muted">
          <span className="text-foreground">{row.name || "anonymous"}</span>
          <span>{when(row.created_at)}</span>
          {row.night && (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: NIGHT_COLOR[row.night] ?? "currentColor" }}
              />
              {row.night}
            </span>
          )}
        </p>
        {row.approved && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            approved
          </span>
        )}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">{row.note}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-[10px] text-muted">
          {[row.path, browser(row.ua)].filter(Boolean).join(" · ")}
        </p>
        <div className="flex items-center gap-4">
          <form action={toggleApproved}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="next" value={row.approved ? "0" : "1"} />
            <button
              type="submit"
              className="font-mono text-[11px] text-muted transition-colors hover:text-foreground"
            >
              {row.approved ? "unapprove" : "approve for showcase"}
            </button>
          </form>
          <form action={removeNote}>
            <input type="hidden" name="id" value={row.id} />
            <DeleteButton />
          </form>
        </div>
      </div>
    </li>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string; wrong?: string }>;
}) {
  const sp = await searchParams;
  if (!(await isAdmin())) return <Gate wrong={sp.wrong === "1"} />;

  const show: Show = sp.show === "pending" || sp.show === "approved" ? sp.show : "all";
  const enabled = feedbackEnabled();
  let rows: FeedbackRow[] = [];
  let error = false;
  if (enabled) {
    try {
      rows = await listFeedback({ limit: 1000 });
    } catch {
      error = true;
    }
  }
  const week = countThisWeek(rows);
  const approved = rows.filter((r) => r.approved).length;
  const visible = show === "all" ? rows : show === "approved" ? rows.filter((r) => r.approved) : rows.filter((r) => !r.approved);

  return (
    <main className="mx-auto w-[92%] max-w-3xl py-10 sm:w-[88%] sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker mb-3">admin</p>
          <h1 className="display text-3xl text-foreground sm:text-4xl">guest book</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="font-mono text-[11px] text-muted transition-colors hover:text-foreground">
            sign out
          </button>
        </form>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          ["notes", rows.length],
          ["this week", week],
          ["approved", approved],
        ].map(([label, n]) => (
          <div key={label} className="rounded-xl border border-border bg-card px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</dt>
            <dd className="display mt-1 text-2xl text-foreground tabular-nums">{n}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter notes" className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider">
          {(["all", "pending", "approved"] as Show[]).map((s) => (
            <a
              key={s}
              href={s === "all" ? "/admin" : `/admin?show=${s}`}
              aria-current={show === s ? "page" : undefined}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                show === s ? "bg-accent text-accent-contrast" : "text-muted hover:text-foreground"
              }`}
            >
              {s}
            </a>
          ))}
        </nav>
        <a
          href="/api/feedback"
          className="draw-link font-mono text-[11px] text-muted transition-colors hover:text-foreground"
        >
          raw json
        </a>
      </div>

      {!enabled && (
        <p className="mt-10 font-mono text-[12px] text-muted">storage is not configured on this deployment.</p>
      )}
      {error && <p className="mt-10 font-mono text-[12px] text-accent">could not reach the database. try again in a minute.</p>}
      {enabled && !error && visible.length === 0 && (
        <p className="mt-10 font-serif text-[15px] italic text-muted">
          {show === "all" ? "nothing yet. the book is open." : `no ${show} notes.`}
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {visible.map((r) => (
          <Note key={r.id} row={r} />
        ))}
      </ul>
    </main>
  );
}
