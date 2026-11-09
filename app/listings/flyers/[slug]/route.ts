import { loadDoc } from "@/lib/data";
import { flyerPdf } from "@/lib/flyer";
import { origin } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const id = slug.replace(/\.pdf$/, "");
  const doc = await loadDoc();
  const l = doc.listings.find((x) => x.id === id);
  if (!l) return new Response("Not found", { status: 404 });
  const base = origin(req);
  const getImage = async (u: string) => {
    try {
      const r = await fetch(/^https?:/.test(u) ? u : base + u);
      return r.ok ? Buffer.from(await r.arrayBuffer()) : null;
    } catch {
      return null;
    }
  };
  const pdf = await flyerPdf(l, getImage);
  const name = l.addr.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return new Response(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="LRES-${name}.pdf"`,
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
