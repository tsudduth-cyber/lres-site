import { adminPassword, token, COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const pw = adminPassword();
  if (!pw) return Response.json({ error: "Password isn't set up yet." }, { status: 503 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== pw) return Response.json({ error: "Wrong password." }, { status: 401 });
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `${COOKIE}=${token(pw)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure}`,
    },
  });
}
