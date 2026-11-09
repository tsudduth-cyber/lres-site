import { loadDoc, loadRentRoll, saveRentRoll } from "@/lib/data";
import { rentRoll, review } from "@/lib/appfolio";
import { isAdmin, deny } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Upload a rent roll. Admins upload from the page; an automation can POST the raw CSV with header x-key.
export async function POST(req: Request) {
  const key = process.env.APPFOLIO_KEY;
  const viaKey = !!key && req.headers.get("x-key") === key;
  if (!viaKey && !isAdmin(req)) return deny();
  const csv = await req.text();
  try {
    rentRoll(csv);
    await saveRentRoll(csv);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return deny();
  const rr = await loadRentRoll();
  if (!rr) return Response.json({ none: true });
  const doc = await loadDoc();
  return Response.json({ at: rr.at, ...review(doc, rentRoll(rr.csv)) });
}
