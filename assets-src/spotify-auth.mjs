/**
 * One-time Spotify auth helper — mints a SPOTIFY_REFRESH_TOKEN for the
 * "now listening" widget. Run it locally, log in once, paste the printed token
 * into .env.local. It never touches the app at runtime.
 *
 *   1. In https://developer.spotify.com/dashboard, open your app → Settings and
 *      add this Redirect URI:  http://127.0.0.1:8888/callback
 *   2. Export your app credentials, then run:
 *
 *        SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node assets-src/spotify-auth.mjs
 *
 *   3. A browser opens; approve access. The refresh token prints in the
 *      terminal. Add it to .env.local as SPOTIFY_REFRESH_TOKEN.
 *
 * Node 18+ (uses the built-in fetch + http server). No dependencies.
 */

import http from "node:http";
import { URL } from "node:url";
import { execFile } from "node:child_process";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-read-currently-playing user-read-recently-played user-read-playback-state";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing env. Run:\n  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node assets-src/spotify-auth.mjs",
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
  }).toString();

function open(url) {
  // Pass the URL as an argv entry (no shell) to avoid any injection surface.
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  execFile(cmd, [url], () => {});
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/html" }).end(
      `<h2>Auth failed: ${error ?? "no code"}</h2>`,
    );
    server.close();
    process.exit(1);
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const json = await tokenRes.json();

    if (!json.refresh_token) {
      throw new Error(JSON.stringify(json));
    }

    res.writeHead(200, { "Content-Type": "text/html" }).end(
      "<h2>Done — check your terminal, then close this tab.</h2>",
    );

    console.log("\n✅ Add this to .env.local:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/html" }).end("<h2>Token exchange failed.</h2>");
    console.error("\n❌ Token exchange failed:\n", e);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log(`\nOpening Spotify authorization…\nIf it doesn't open, visit:\n${authUrl}\n`);
  open(authUrl);
});
