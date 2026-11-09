import PDFDocument from "pdfkit";
import path from "path";
import { Listing, MATT } from "./data";

const F = (n: string) => path.join(process.cwd(), "lib", "fonts", n);
const RED = "#ED1C24",
  INK = "#1A1A1A",
  MUT = "#555555";
const IN = 72;

export async function flyerPdf(
  l: Listing,
  getImage: (u: string) => Promise<Buffer | null>,
): Promise<Buffer> {
  const doc = new PDFDocument({ size: "LETTER", margin: 0, info: { Title: `${l.addr} — Lang Real Estate Services` } });
  doc.registerFont("serif", F("libre-caslon-text-latin-400-normal.woff"));
  doc.registerFont("sans", F("libre-franklin-latin-400-normal.woff"));
  doc.registerFont("sans6", F("libre-franklin-latin-600-normal.woff"));
  doc.registerFont("sansB", F("libre-franklin-latin-700-normal.woff"));
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((r) => doc.on("end", () => r(Buffer.concat(chunks))));

  const W = 612,
    H = 792,
    M = 0.7 * IN,
    CW = W - 2 * M;
  const center = (t: string, y: number, font: string, size: number, color: string, cs = 0) => {
    doc.font(font).fontSize(size).fillColor(color);
    doc.text(t, M, y, { width: CW, align: "center", characterSpacing: cs, lineBreak: true });
    return doc.y;
  };

  // top bar + header
  doc.rect(0, 0, W, 7.5).fill(RED);
  const logo = await getImage("/logo.png");
  let y = 0.45 * IN;
  if (logo) {
    const lw = 2.1 * IN;
    // PNG header holds width/height at bytes 16-23
    const lh = (logo.readUInt32BE(20) / logo.readUInt32BE(16)) * lw;
    doc.image(logo, (W - lw) / 2, y, { width: lw });
    y += lh + 14;
  }
  y = center("FOR LEASE", y, "sansB", 10, RED, 4) + 10;
  y = center(l.addr, y, "serif", 28, INK) + 6;
  y = center(l.city.toUpperCase(), y, "sans", 11, MUT, 2) + 0.22 * IN;

  // measure the features block so the photo can give up room when the list is long
  const gap = 0.4 * IN,
    colW = (CW - gap) / 2;
  const half = Math.ceil(l.feats.length / 2);
  const cols = [l.feats.slice(0, half), l.feats.slice(half)];
  doc.font("sans").fontSize(10.5);
  const colH = (items: string[]) => items.reduce((h, f) => h + doc.heightOfString(f, { width: colW - 14, lineGap: 2 }) + 10, 0);
  const featsH = l.feats.length ? 9 * 1.3 + 8 + Math.max(colH(cols[0]), colH(cols[1])) : 0;
  const footH = 34;
  const contactTop = H - 7.5 - footH - 0.3 * IN - 62;
  const sh = 62;

  // photo or type band
  const photo = l.photos[0] ? await getImage(l.photos[0]) : null;
  if (photo) {
    const room = contactTop - 18 - y - 0.3 * IN - sh - 0.3 * IN - featsH;
    const ph = Math.max(1.6 * IN, Math.min(3.4 * IN, room));
    doc.save();
    doc.rect(M, y, CW, ph).clip();
    doc.image(photo, M, y, { cover: [CW, ph], align: "center", valign: "center" });
    doc.restore();
    y += ph;
  } else {
    const bh = 1.1 * IN;
    doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(INK).stroke();
    doc.moveTo(M, y + bh).lineTo(M + CW, y + bh).stroke();
    doc.font("serif").fontSize(18).fillColor(INK).text(l.type, M, y + bh / 2 - 12, { width: CW, align: "center" });
    y += bh;
  }

  // stats
  y += 0.3 * IN;
  const stats: [string, string, number][] = [
    [l.sf, l.sfNote.toUpperCase(), 16],
    [l.rate, "ASKING", 16],
    [l.type, "TYPE", 12],
  ];
  const cw = CW / 3;
  doc.lineWidth(1.5).strokeColor(INK);
  doc.moveTo(M, y).lineTo(M + CW, y).stroke();
  doc.moveTo(M, y + sh).lineTo(M + CW, y + sh).stroke();
  stats.forEach(([v, lab, size], i) => {
    const x = M + i * cw;
    if (i) doc.lineWidth(1).strokeColor("#CCCCCC").moveTo(x, y + 8).lineTo(x, y + sh - 8).stroke();
    doc.font("sansB").fontSize(size).fillColor(INK);
    const vh = doc.heightOfString(v, { width: cw - 12, align: "center" });
    doc.font("sans").fontSize(8);
    const lh = doc.heightOfString(lab, { width: cw - 12, align: "center", characterSpacing: 2 });
    const top = y + (sh - vh - lh - 5) / 2;
    doc.font("sansB").fontSize(size).fillColor(INK).text(v, x + 6, top, { width: cw - 12, align: "center" });
    doc.font("sans").fontSize(8).fillColor(MUT).text(lab, x + 6, top + vh + 5, { width: cw - 12, align: "center", characterSpacing: 2 });
  });
  y += sh + 0.3 * IN;

  // features, two columns
  if (l.feats.length) {
    y = center("FEATURES", y, "sansB", 9, RED, 3) + 8;
    let maxY = y;
    cols.forEach((items, ci) => {
      let cy = y;
      const x = M + ci * (colW + gap);
      for (const f of items) {
        doc.font("sans").fontSize(10.5);
        const th = doc.heightOfString(f, { width: colW - 14, lineGap: 2 });
        doc.rect(x, cy + 9, 5, 5).fill(RED);
        doc.fillColor(INK).text(f, x + 14, cy + 5, { width: colW - 14, lineGap: 2 });
        cy += th + 10;
        doc.lineWidth(0.75).strokeColor("#E6E6E6").moveTo(x, cy).lineTo(x + colW, cy).stroke();
      }
      maxY = Math.max(maxY, cy);
    });
    y = maxY;
  }

  // contact + footer pinned to bottom
  const cy = contactTop;
  center(MATT.name, cy, "serif", 16, INK);
  center(MATT.title, cy + 24, "sansB", 8, RED, 2);
  center(`${MATT.phones} · ${MATT.email}`, cy + 40, "sans", 10, INK);
  const fy = H - 7.5 - footH;
  doc.rect(0, fy, W, footH).fill(INK);
  doc
    .font("sans")
    .fontSize(8)
    .fillColor("#FFFFFF")
    .text("LANG REAL ESTATE SERVICES · 6115 OWENS ST, SUITE 113 · DALLAS, TX 75235 · LANGREALESTATESERVICES.COM", 0, fy + 13, {
      width: W,
      align: "center",
      characterSpacing: 1.2,
    });
  doc.rect(0, H - 7.5, W, 7.5).fill(RED);

  doc.end();
  return done;
}
