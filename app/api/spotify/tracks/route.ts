import { offDuty } from "@/lib/content";
import { getTracks } from "@/lib/spotify";

// Song metadata rarely changes — cache the resolved cards for a day.
export const revalidate = 86400;

export async function GET() {
  const tracks = await getTracks(offDuty.nonMainstream);
  return Response.json({ tracks });
}
