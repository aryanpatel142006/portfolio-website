import { offDuty } from "@/lib/content";
import { getTracks } from "@/lib/spotify";

// Song metadata rarely changes — cache the resolved cards for a day.
// Prerendered at build and refreshed in the background, so the first visitor
// after a deploy never waits on the upstream resolvers.
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const tracks = await getTracks(offDuty.nonMainstream);
  return Response.json({ tracks });
}
