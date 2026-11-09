export const origin = (req: Request) => {
  const u = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") || u.host;
  const proto = req.headers.get("x-forwarded-proto") || u.protocol.replace(":", "");
  return `${proto}://${host}`;
};

export const PUBLIC_CACHE = "public, s-maxage=120, stale-while-revalidate=86400";

export const html = (body: string, cache = PUBLIC_CACHE) =>
  new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache } });
