import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE = "lres_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.VERCEL ? "" : "lres");
}

export function token(pw: string) {
  return createHmac("sha256", pw).update("lres-listings-admin").digest("hex");
}

function cookieVal(req: Request, name: string) {
  const c = req.headers.get("cookie") || "";
  const m = c.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export function isAdmin(req: Request) {
  const pw = adminPassword();
  if (!pw) return false;
  const got = Buffer.from(cookieVal(req, COOKIE));
  const want = Buffer.from(token(pw));
  return got.length === want.length && timingSafeEqual(got, want);
}

export function deny() {
  return Response.json({ error: "Not signed in" }, { status: 401 });
}
