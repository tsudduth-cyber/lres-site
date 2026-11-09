import { Doc } from "./data";

export type Row = { property: string; unit: string; tenant: string; status: string; sqft: number; rent: string };

export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [],
    f = "",
    q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          f += '"';
          i++;
        } else q = false;
      } else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(f);
      f = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(f);
      out.push(row);
      row = [];
      f = "";
    } else f += ch;
  }
  if (f || row.length) {
    row.push(f);
    out.push(row);
  }
  return out;
}

export function rentRoll(text: string): Row[] {
  const all = parseCsv(text);
  const h = all.findIndex((r) => r[0] === "Property" && r.includes("Unit") && r.includes("Status"));
  if (h < 0) throw new Error("That file doesn't look like an AppFolio rent roll.");
  const head = all[h];
  const ix = (n: string) => head.indexOf(n);
  const [P, U, T, S, Q, R] = ["Property", "Unit", "Tenant", "Status", "Sqft", "Advertised Rent"].map(ix);
  return all
    .slice(h + 1)
    .filter((r) => r[P] && r[S] && r[P] !== "Total")
    .map((r) => ({
      property: r[P].trim(),
      unit: (r[U] || "").trim(),
      tenant: (r[T] || "").trim(),
      status: (r[S] || "").trim(),
      sqft: parseInt((r[Q] || "0").replace(/[^0-9]/g, "") || "0", 10),
      rent: (r[R] || "").trim(),
    }));
}

const OPEN = new Set(["Vacant-Unrented", "Notice-Unrented"]);
export const key = (p: string, u: string) => `${p}|${u}`;
export const shortName = (p: string) => p.split(" - ")[0];

export function review(doc: Doc, rows: Row[]) {
  const byKey = new Map(rows.map((r) => [key(r.property, r.unit), r]));
  const linked = new Set(doc.listings.filter((l) => l.appfolio).map((l) => key(l.appfolio!.property, l.appfolio!.unit)));
  const dismissed = new Set(doc.dismissed);

  const leased: { id: string; addr: string; tenant: string; status: string }[] = [];
  const missing: { id: string; addr: string }[] = [];
  for (const l of doc.listings) {
    if (!l.appfolio) continue;
    const r = byKey.get(key(l.appfolio.property, l.appfolio.unit));
    if (!r) missing.push({ id: l.id, addr: l.addr });
    else if (!OPEN.has(r.status) && !l.hold) leased.push({ id: l.id, addr: l.addr, tenant: r.tenant, status: r.status });
  }

  const vacancies = rows
    .filter(
      (r) =>
        OPEN.has(r.status) &&
        doc.watch[r.property] === true &&
        r.sqft > 0 &&
        !/do not use/i.test(r.unit + r.property) &&
        !linked.has(key(r.property, r.unit)) &&
        !dismissed.has(key(r.property, r.unit)),
    )
    .map((r) => ({ property: r.property, name: shortName(r.property), unit: r.unit, sqft: r.sqft, status: r.status, rent: r.rent }));

  const props = new Map<string, { property: string; name: string; open: number }>();
  for (const r of rows) {
    if (/do not use/i.test(r.property) || r.property.startsWith("Work Orders")) continue;
    const p = props.get(r.property) || { property: r.property, name: shortName(r.property), open: 0 };
    if (OPEN.has(r.status) && r.sqft > 0) p.open++;
    props.set(r.property, p);
  }
  const unknown = [...props.values()].filter((p) => !(p.property in doc.watch)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const firstRun = Object.values(doc.watch).filter((v) => v === false).length === 0 && unknown.length > 20;

  const units = rows.map((r) => ({ property: r.property, unit: r.unit, status: r.status, sqft: r.sqft }));
  return { leased, missing, vacancies, unknown, firstRun, units };
}
