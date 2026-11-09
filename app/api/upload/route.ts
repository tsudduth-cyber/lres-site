import { saveFile } from "@/lib/data";
import { isAdmin, deny } from "@/lib/auth";

export async function POST(req: Request) {
  if (!isAdmin(req)) return deny();
  const form = await req.formData();
  const f = form.get("file");
  if (!(f instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ok = ["image/jpeg", "image/png", "application/pdf"];
  if (!ok.includes(f.type)) return Response.json({ error: "Photos must be JPG or PNG; flyers must be PDF." }, { status: 400 });
  try {
    const url = await saveFile(f.name || "upload", Buffer.from(await f.arrayBuffer()), f.type);
    return Response.json({ url });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 503 });
  }
}
