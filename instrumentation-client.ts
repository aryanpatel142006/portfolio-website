import posthog from "posthog-js";

/** PostHog boots only when a project key exists — without it the site runs
    zero analytics code, same graceful-absence rule as every other
    API-backed feature. Events go through the first-party /ingest proxy
    (see next.config.ts rewrites) so ad blockers don't eat them. */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Only the canonical production host reports — localhost, LAN phone tests,
// and Vercel preview deployments stay out of the dashboard, so the numbers
// are real visitors only.
const isCanonicalHost =
  typeof location !== "undefined" &&
  /(^|\.)aryan\.is-a\.dev$/.test(location.hostname);

if (key && isCanonicalHost) {
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2025-05-24",
      // a portfolio has no business screen-recording its visitors
      disable_session_recording: true,
    });
  } catch {
    // analytics must never take the page down with it
  }
}
