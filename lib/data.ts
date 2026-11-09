import { promises as fs } from "fs";
import path from "path";
import { head, put } from "@vercel/blob";
import seed from "../data/seed.json";

export type Listing = {
  id: string;
  addr: string;
  city: string;
  type: string;
  group: string;
  sf: string;
  sfNote: string;
  rate: string;
  sub: string;
  tag: string;
  loopnet: string;
  feats: string[];
  photos: string[];
  blurb: string;
  stat2Value: string;
  stat2Label: string;
  flyerPdf: string;
  appfolio: { property: string; unit: string } | null;
  hold: boolean;
  updated?: number;
};

export type Doc = {
  rev: number;
  listings: Listing[];
  settings: { featured: string[]; coop: string };
  watch: Record<string, boolean>;
  dismissed: string[];
};

export const GROUPS = [
  "Warehouse & Industrial",
  "Showroom & Flex",
  "Office",
  "Retail & Restaurant",
  "Commercial Kitchens",
];

export const MATT = {
  name: "Matt Miller",
  title: "VICE PRESIDENT OF BROKERAGE & LEASING",
  phones: "M 972-672-4037 · D 972-744-6439",
  email: "mmiller@langrealestateservices.com",
};
export const ADDRESS = "LANG REAL ESTATE SERVICES · 6115 OWENS ST, SUITE 113 · DALLAS, TX 75235";

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL = path.join(process.cwd(), ".data");

export function storageMode(): "blob" | "local" | "readonly" {
  if (hasBlob()) return "blob";
  return process.env.VERCEL ? "readonly" : "local";
}

const urls: Record<string, string> = {};

async function blobUrl(name: string) {
  if (urls[name]) return urls[name];
  try {
    const h = await head(name);
    urls[name] = h.url;
    return h.url;
  } catch {
    return "";
  }
}

async function blobRead(name: string) {
  const u = await blobUrl(name);
  if (!u) return null;
  const r = await fetch(`${u}?t=${Date.now()}`, { cache: "no-store" });
  return r.ok ? r : null;
}

async function blobWrite(name: string, body: string | Buffer, contentType: string) {
  const b = await put(name, body, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  urls[name] = b.url;
}

async function readLocal(name: string) {
  try {
    return await fs.readFile(path.join(LOCAL, name), "utf8");
  } catch {
    return null;
  }
}

async function writeLocal(name: string, body: string) {
  await fs.mkdir(LOCAL, { recursive: true });
  await fs.writeFile(path.join(LOCAL, name), body);
}

export async function loadDoc(): Promise<Doc> {
  const mode = storageMode();
  if (mode === "blob") {
    const r = await blobRead("data/current.json");
    if (r) return (await r.json()) as Doc;
  } else if (mode === "local") {
    const t = await readLocal("doc.json");
    if (t) return JSON.parse(t);
  }
  return structuredClone(seed) as Doc;
}

export async function saveDoc(doc: Doc) {
  const mode = storageMode();
  if (mode === "readonly") throw new Error("Storage isn't connected yet.");
  const body = JSON.stringify(doc);
  if (mode === "local") return writeLocal("doc.json", body);
  await blobWrite("data/current.json", body, "application/json");
  await put(`data/history/${Date.now()}.json`, body, { access: "public", contentType: "application/json", addRandomSuffix: true });
}

export async function saveFile(name: string, data: Buffer, contentType: string) {
  const mode = storageMode();
  if (mode === "readonly") throw new Error("Storage isn't connected yet.");
  const clean = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  if (mode === "local") {
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    const fn = `${Date.now()}-${clean}`;
    await fs.writeFile(path.join(dir, fn), data);
    return `/uploads/${fn}`;
  }
  const b = await put(`files/${clean}`, data, { access: "public", contentType, addRandomSuffix: true });
  return b.url;
}

export async function saveRentRoll(csv: string) {
  const mode = storageMode();
  if (mode === "readonly") throw new Error("Storage isn't connected yet.");
  const body = JSON.stringify({ csv, at: new Date().toISOString() });
  if (mode === "local") return writeLocal("rent-roll.json", body);
  await blobWrite("appfolio/latest.json", body, "application/json");
}

export async function loadRentRoll(): Promise<{ csv: string; at: string } | null> {
  const mode = storageMode();
  if (mode === "blob") {
    const r = await blobRead("appfolio/latest.json");
    return r ? await r.json() : null;
  }
  if (mode === "local") {
    const t = await readLocal("rent-roll.json");
    return t ? JSON.parse(t) : null;
  }
  return null;
}

export function sfNum(l: Listing) {
  return parseInt(l.sf.split(/[–-]/)[0].replace(/[^0-9]/g, "") || "0", 10);
}

export function sorted(doc: Doc) {
  return [...doc.listings].sort(
    (a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || sfNum(b) - sfNum(a),
  );
}

export const gid = (g: string) => g.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

export function monthYear(d = new Date()) {
  return d
    .toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "America/Chicago" })
    .toUpperCase();
}

export function flyerUrl(l: Listing, base = "") {
  if (l.flyerPdf) return l.flyerPdf;
  return `${base}/listings/flyers/${l.id}.pdf?v=${l.updated || 1}`;
}

export const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
