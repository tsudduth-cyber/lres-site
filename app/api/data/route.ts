import { loadDoc, saveDoc, storageMode, Doc } from "@/lib/data";
import { isAdmin, deny } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return deny();
  return Response.json({ doc: await loadDoc(), storage: storageMode() });
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return deny();
  const next = (await req.json()) as Doc;
  const cur = await loadDoc();
  if (next.rev !== cur.rev) return Response.json({ error: "Someone else saved changes. Reload and try again.", doc: cur }, { status: 409 });
  const strip = (l: object) => JSON.stringify({ ...l, updated: undefined });
  const before = new Map(cur.listings.map((l) => [l.id, strip(l)]));
  const now = Date.now();
  for (const l of next.listings) if (before.get(l.id) !== strip(l)) l.updated = now;
  next.rev = cur.rev + 1;
  try {
    await saveDoc(next);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 503 });
  }
  return Response.json({ doc: next });
}
