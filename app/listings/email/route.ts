import { loadDoc } from "@/lib/data";
import { emailPage } from "@/lib/render";
import { origin, html } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const doc = await loadDoc();
  const preview = new URL(req.url).searchParams.has("preview");
  return html(emailPage(doc, origin(req)), preview ? "no-store" : undefined);
}
