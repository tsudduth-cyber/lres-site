import { Doc, Listing, GROUPS, MATT, ADDRESS, sorted, gid, monthYear, flyerUrl, esc as E } from "./data";

const MAILTO =
  "mailto:mmiller@langrealestateservices.com?subject=Client%20requirement%20-%20LRES%20availabilities&amp;body=Size%3A%20%0AUse%3A%20%0AArea%3A%20%0ATiming%3A%20";

const abs = (u: string, base: string) => (/^https?:/.test(u) ? u : base + u);

function counts(L: Listing[]) {
  const c: Record<string, number> = {};
  for (const g of GROUPS) c[g] = L.filter((l) => l.group === g).length;
  return c;
}

function featStats(l: Listing): [string, string][] {
  const s: [string, string][] = [[l.sf, "AVAILABLE"]];
  if (l.stat2Value) s.push([l.stat2Value, l.stat2Label || ""]);
  else if (l.sfNote) s.push([l.type, "TYPE"]);
  s.push([l.rate.replace(" / SF", ""), "ASKING"]);
  return s;
}

function featDesc(l: Listing) {
  return l.blurb || l.feats.slice(0, 3).join(". ") + (l.feats.length ? "." : "");
}

export function featuredOf(doc: Doc) {
  return doc.settings.featured
    .map((id) => doc.listings.find((l) => l.id === id))
    .filter(Boolean) as Listing[];
}

/* ---------- web page ---------- */
export function webPage(doc: Doc, base: string) {
  const L = sorted(doc);
  const N = L.length;
  const c = counts(L);
  const groups = GROUPS.filter((g) => c[g]);
  let rows = "",
    cur = "";
  for (const p of L) {
    if (p.group !== cur) {
      cur = p.group;
      rows += `<div class="grp" id="${gid(cur)}">${E(cur)}<span>${c[cur]}</span></div>`;
    }
    const addr = p.loopnet
      ? `<a class="addr" href="${E(p.loopnet)}" target="_blank" rel="noopener">${E(p.addr)}<span class="ln">LoopNet ↗</span></a>`
      : `<span class="addr plain">${E(p.addr)}</span>`;
    const tag = p.tag ? `<span class="tag">${E(p.tag)}</span>` : "";
    rows += `<div class="row"><div class="c1">${addr}${tag}<span class="sub">${E(p.sub)}</span></div>
<div class="t">${E(p.type)}</div><div class="n sf">${E(p.sf.replace(" SF", ""))}<small> SF</small></div>
<div class="n rt">${E(p.rate.replace(" / SF", ""))}<a class="pdf" href="${E(flyerUrl(p))}" target="_blank" rel="noopener">Flyer</a></div></div>`;
  }
  const strip = groups.map((g) => `<a href="#${gid(g)}"><b>${c[g]}</b>${E(g)}</a>`).join("");
  const feats = featuredOf(doc)
    .map((p) => {
      const st = featStats(p).map(([a, b]) => `<div><b>${E(a)}</b><span>${E(b)}</span></div>`).join("");
      const title = p.loopnet ? `<a href="${E(p.loopnet)}" target="_blank" rel="noopener">${E(p.addr)}</a>` : E(p.addr);
      const ln = p.loopnet ? `<a class="btn ghost" href="${E(p.loopnet)}" target="_blank" rel="noopener">LoopNet</a>` : "";
      const ph = p.photos[0]
        ? `<a class="ph" href="${E(flyerUrl(p))}" target="_blank" rel="noopener"><img src="${E(p.photos[0])}" alt="${E(p.addr)}"></a>`
        : `<a class="ph noph" href="${E(flyerUrl(p))}" target="_blank" rel="noopener">${E(p.type)}</a>`;
      return `<article class="feat"><p class="eye">FEATURED · ${E(p.type.toUpperCase())}</p><h2>${title}</h2>${ph}
<div class="stats">${st}</div><p class="desc">${E(featDesc(p))}</p>
<div class="btns"><a class="btn" href="${E(flyerUrl(p))}" target="_blank" rel="noopener">View Flyer</a>${ln}</div></article>`;
    })
    .join("");
  const cols = Math.max(groups.length, 1);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LRES Availabilities</title><link rel="icon" href="/logo.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Libre+Franklin:wght@400;600;700&display=swap">
<style>
:root{--ground:#EDEDED;--paper:#FFFFFF;--ink:#1A1A1A;--muted:#555555;--rule:#DDDDDD;--red:#ED1C24;--band:#F5F5F5;
--serif:'Libre Caslon Text',Georgia,serif;--sans:'Libre Franklin',Arial,sans-serif;color-scheme:light}
*{box-sizing:border-box} html{scroll-behavior:smooth}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--sans);padding:20px 12px}
img{max-width:100%}
.mail{max-width:640px;margin:0 auto;background:var(--paper)}
.redbar{height:6px;background:var(--red)}
header{padding:32px 28px 0;display:flex;flex-direction:column;align-items:center;gap:18px}
header img{width:200px}
.date{width:100%;text-align:center;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);padding:10px 0;font-size:12px;letter-spacing:3px;font-weight:600}
.inv{padding:18px 28px 6px;text-align:center}
.inv h1{margin:0;font-family:var(--serif);font-weight:400;font-size:24px}
.inv h1 b{color:var(--red);font-weight:700}
.strip{margin-top:14px;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));border:1px solid var(--rule)}
.strip a{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;text-decoration:none;color:var(--muted);font-size:10.5px;line-height:1.25;text-align:center}
.strip a+a{border-left:1px solid var(--rule)}
.strip b{font-size:20px;color:var(--ink);font-variant-numeric:tabular-nums}
.strip a:hover{background:var(--band)} .strip a:hover b{color:var(--red)}
.feats{padding:20px 28px 0;display:grid;gap:26px}
.feat{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding-bottom:24px;border-bottom:1px solid var(--rule);min-width:0}
.eye{margin:0;font-size:10.5px;letter-spacing:3px;font-weight:700;color:var(--red)}
h2{margin:0;font-family:var(--serif);font-weight:400;font-size:24px;text-wrap:balance}
h2 a{color:var(--ink);text-decoration:none} h2 a:hover{color:var(--red)}
.ph{display:block;width:100%;margin-top:4px} .ph img{display:block;width:100%;aspect-ratio:600/230;object-fit:cover}
.noph{aspect-ratio:600/230;display:flex;align-items:center;justify-content:center;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);font-family:var(--serif);font-size:20px;color:var(--ink);text-decoration:none;background:var(--band)}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.stats div{padding:10px 4px;display:flex;flex-direction:column;gap:3px} .stats div+div{border-left:1px solid #CCC}
.stats b{font-size:17px;font-variant-numeric:tabular-nums} .stats span{font-size:10px;letter-spacing:1px;color:var(--muted)}
.desc{margin:2px 0 0;font-size:13.5px;line-height:1.55;color:#333;max-width:460px}
.btns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.btn{display:inline-block;background:var(--red);color:#fff;text-decoration:none;font-size:11.5px;font-weight:700;letter-spacing:2px;padding:11px 20px;text-transform:uppercase}
.btn.ghost{background:transparent;color:var(--ink);border:1.5px solid var(--ink)}
.btn:hover{opacity:.88} a:focus-visible{outline:2px solid var(--red);outline-offset:2px}
.all{padding:22px 28px 0;text-align:center}
.all a{display:block;background:var(--ink);color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:14px;text-transform:uppercase}
.listhead{padding:30px 28px 10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
.listhead h3{margin:0;font-family:var(--serif);font-weight:400;font-size:22px} .listhead i{width:48px;height:2px;background:var(--red)}
.list{padding:6px 28px 0;font-size:13px}
.lh,.row{display:grid;grid-template-columns:minmax(0,1fr) 150px 92px 96px;gap:10px;align-items:start}
.lh{background:var(--ink);color:#fff;font-size:10.5px;letter-spacing:1px;font-weight:600;padding:9px 10px}
.row{padding:10px;border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums}
.n{text-align:right} .t{text-align:center} .row .t{color:#333} .row .n{font-weight:600;white-space:nowrap}
.row small{font-weight:400;color:var(--muted);display:none}
.grp{background:var(--band);font-size:10.5px;letter-spacing:2px;font-weight:700;color:var(--red);text-transform:uppercase;padding:8px 10px;display:flex;justify-content:space-between;scroll-margin-top:12px}
.grp span{color:var(--muted)}
.addr{color:var(--ink);font-weight:600;text-decoration:none;border-bottom:1px solid #BBB} .addr.plain{border:0} .addr:hover{color:var(--red);border-color:var(--red)}
.ln{font-size:10px;font-weight:700;letter-spacing:1px;color:var(--red);margin-left:8px;text-transform:uppercase}
.tag{display:inline-block;margin-left:8px;background:var(--red);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:1px;padding:2px 6px;text-transform:uppercase;vertical-align:2px}
.sub{display:block;font-size:11px;color:var(--muted);margin-top:3px}
.pdf{display:block;margin-top:4px;font-size:10px;letter-spacing:1px;font-weight:700;color:var(--red);text-decoration:none;text-transform:uppercase}
.pdf::before{content:"\\2193  "}
.contact{padding:32px 28px;text-align:center;display:flex;flex-direction:column;gap:5px}
.contact .nm{font-family:var(--serif);font-size:20px} .contact .tt{font-size:11px;letter-spacing:2px;color:var(--red);font-weight:700}
.contact p{margin:0;font-size:14px} .contact .note{font-size:12px;color:var(--muted);margin-top:4px}
footer{background:var(--ink);color:#fff;padding:18px 24px;text-align:center;font-size:11px;letter-spacing:1px}
@media (min-width:900px){.mail{max-width:900px} .feats{grid-template-columns:1fr 1fr;gap:28px} .feat{border-bottom:0;padding-bottom:0} .all{padding-top:28px} .inv,.feats,.all,.listhead,.list,.contact,header{padding-left:40px;padding-right:40px}}
@media (max-width:560px){.lh{display:none} .row{grid-template-columns:1fr auto;gap:4px 12px} .row .c1{grid-column:1/-1} .row .t{grid-column:1/-1;text-align:left;font-size:12px;color:var(--muted)} .row .sf{text-align:left} .row small{display:inline} .row .rt{display:flex;gap:12px;align-items:baseline;justify-content:flex-end} .row .pdf{margin-top:0}
header,.inv,.feats,.all,.listhead,.list,.contact{padding-left:16px;padding-right:16px} .strip a{font-size:9.5px;padding:8px 2px} .strip b{font-size:18px} h2{font-size:21px} .stats b{font-size:15px}}
</style></head><body>
<div class="mail">
<div class="redbar"></div>
<header><img src="/logo.png" alt="Lang Real Estate Services"><div class="date">DFW AVAILABILITIES · ${monthYear()}</div></header>
<section class="inv"><h1><b>${N}</b> spaces available</h1>
<nav class="strip" aria-label="Availability by type">${strip}</nav></section>
<div class="feats">${feats}</div>
<div class="all"><a href="${MAILTO}">Client looking? Email Matt your size and use &rarr;</a></div>
<div class="listhead" id="list"><h3>Full Availability List</h3><i></i></div>
<div class="list"><div class="lh"><span>PROPERTY</span><span class="t">TYPE</span><span class="n">SF</span><span class="n">RATE</span></div>${rows}</div>
<div class="contact"><div class="nm">${MATT.name}</div><div class="tt">${E(MATT.title)}</div>
<p>${MATT.phones}</p><p>${MATT.email}</p>${doc.settings.coop ? `<p class="note">${E(doc.settings.coop)}</p>` : ""}</div>
<footer>${ADDRESS}</footer>
<div class="redbar"></div>
</div></body></html>`;
}

/* ---------- email (tables, inline styles, absolute links) ---------- */
export function emailPage(doc: Doc, base: string) {
  const RED = "#ED1C24",
    INK = "#1A1A1A",
    MUT = "#555555";
  const SANS = "Arial,Helvetica,sans-serif",
    SERIF = "Georgia,'Times New Roman',serif";
  const L = sorted(doc);
  const N = L.length;
  const c = counts(L);
  const groups = GROUPS.filter((g) => c[g]);
  const fl = (l: Listing) => E(abs(flyerUrl(l), base));

  const feat = (p: Listing) => {
    const st = featStats(p);
    const cells = st
      .map(
        ([a, b], i) =>
          `<td width="33%" align="center" style="padding:12px 4px;${i ? "border-left:1px solid #CCCCCC;" : ""}font-family:${SANS}"><div style="font-size:18px;font-weight:bold;color:${INK}">${E(a)}</div><div style="font-size:10px;letter-spacing:1px;color:${MUT};padding-top:3px">${E(b)}</div></td>`,
      )
      .join("");
    const title = p.loopnet
      ? `<a href="${E(p.loopnet)}" style="color:${INK};text-decoration:none">${E(p.addr)}</a>`
      : E(p.addr);
    const ln = p.loopnet
      ? `&nbsp;&nbsp;<a href="${E(p.loopnet)}" style="display:inline-block;border:2px solid ${INK};color:${INK};font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:2px;text-decoration:none;padding:11px 20px">LOOPNET</a>`
      : "";
    const img = p.photos[0]
      ? `<tr><td style="padding:0 30px"><a href="${fl(p)}"><img src="${E(abs(p.photos[0], base))}" width="540" alt="${E(p.addr)}" style="display:block;width:100%;max-width:540px;height:auto;border:0"></a></td></tr>`
      : "";
    return `<tr><td align="center" style="padding:22px 30px 0;font-family:${SANS};font-size:11px;letter-spacing:3px;font-weight:bold;color:${RED}">FEATURED · ${E(p.type.toUpperCase())}</td></tr>
<tr><td align="center" style="padding:6px 30px 10px;font-family:${SERIF};font-size:24px;color:${INK}">${title}</td></tr>
${img}
<tr><td style="padding:12px 30px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};border-bottom:1px solid ${INK}"><tr>${cells}</tr></table></td></tr>
<tr><td align="center" style="padding:14px 40px 0;font-family:${SANS};font-size:14px;line-height:22px;color:#333333">${E(featDesc(p))}</td></tr>
<tr><td align="center" style="padding:16px 30px 28px;border-bottom:1px solid #DDDDDD"><a href="${fl(p)}" style="display:inline-block;background:${RED};color:#FFFFFF;font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:2px;text-decoration:none;padding:13px 24px">VIEW FLYER</a>${ln}</td></tr>`;
  };

  let rows = "",
    cur = "";
  for (const p of L) {
    if (p.group !== cur) {
      cur = p.group;
      rows += `<tr><td colspan="2" style="background:#F5F5F5;padding:8px 10px;font-family:${SANS};font-size:10px;letter-spacing:2px;font-weight:bold;color:${RED}"><a name="${gid(cur)}"></a>${E(cur.toUpperCase())} &nbsp;<span style="color:${MUT}">(${c[cur]})</span></td></tr>`;
    }
    const a = p.loopnet
      ? `<a href="${E(p.loopnet)}" style="color:${INK};text-decoration:underline;font-weight:bold">${E(p.addr)}</a>`
      : `<span style="color:${INK};font-weight:bold">${E(p.addr)}</span>`;
    const tag = p.tag
      ? ` <span style="background:${RED};color:#FFFFFF;font-size:9px;font-weight:bold;letter-spacing:1px;padding:2px 5px">${E(p.tag.toUpperCase())}</span>`
      : "";
    rows += `<tr><td valign="top" style="padding:10px;border-bottom:1px solid #DDDDDD;font-family:${SANS};font-size:13px;line-height:18px">${a}${tag}<br><span style="font-size:12px;color:#333333">${E(p.type)}</span><br><span style="font-size:11px;color:${MUT}">${E(p.sub)}</span></td>
<td valign="top" align="right" style="padding:10px;border-bottom:1px solid #DDDDDD;font-family:${SANS};font-size:13px;line-height:18px;white-space:nowrap"><b style="color:${INK}">${E(p.sf)}</b><br><span style="color:${INK}">${E(p.rate)}</span><br><a href="${fl(p)}" style="font-size:11px;font-weight:bold;letter-spacing:1px;color:${RED};text-decoration:none">FLYER (PDF)</a></td></tr>`;
  }
  const w = Math.floor(100 / Math.max(groups.length, 1));
  const strip = groups
    .map(
      (g) =>
        `<td width="${w}%" align="center" style="padding:10px 2px;border:1px solid #DDDDDD;font-family:${SANS}"><div style="font-size:20px;font-weight:bold;color:${INK}">${c[g]}</div><div style="font-size:10px;color:${MUT};line-height:13px">${E(g)}</div></td>`,
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LRES Availabilities</title></head>
<body style="margin:0;padding:0;background:#EDEDED">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEDED"><tr><td align="center" style="padding:20px 10px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF">
<tr><td style="background:${RED};height:6px;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td align="center" style="padding:34px 30px 18px"><img src="${base}/logo.png" width="200" alt="Lang Real Estate Services" style="display:block;width:200px;height:auto;border:0"></td></tr>
<tr><td style="padding:0 30px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="border-top:1px solid ${INK};border-bottom:1px solid ${INK};padding:10px 0;font-family:${SANS};font-size:12px;letter-spacing:3px;font-weight:bold;color:${INK}">DFW AVAILABILITIES · ${monthYear()}</td></tr></table></td></tr>
<tr><td align="center" style="padding:16px 30px 0;font-family:${SERIF};font-size:22px;color:${INK}"><b style="color:${RED}">${N}</b> spaces available</td></tr>
<tr><td style="padding:12px 30px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>${strip}</tr></table></td></tr>
${featuredOf(doc).map(feat).join("\n")}
<tr><td style="padding:22px 30px 0"><a href="${MAILTO}" style="display:block;background:${INK};color:#FFFFFF;text-align:center;font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:2px;text-decoration:none;padding:14px">CLIENT LOOKING? EMAIL MATT YOUR SIZE AND USE &rarr;</a></td></tr>
<tr><td align="center" style="padding:32px 30px 4px;font-family:${SERIF};font-size:22px;color:${INK}"><a name="list"></a>Full Availability List</td></tr>
<tr><td align="center" style="padding:6px 0 14px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:48px;height:2px;background:${RED};font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:0 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
<tr><td align="center" style="padding:32px 30px 4px;font-family:${SERIF};font-size:20px;color:${INK}">${MATT.name}</td></tr>
<tr><td align="center" style="font-family:${SANS};font-size:11px;letter-spacing:2px;font-weight:bold;color:${RED}">${E(MATT.title)}</td></tr>
<tr><td align="center" style="padding:8px 30px 0;font-family:${SANS};font-size:14px;color:${INK}">${MATT.phones}</td></tr>
<tr><td align="center" style="padding:2px 30px 0;font-family:${SANS};font-size:14px"><a href="mailto:${MATT.email}" style="color:${INK}">${MATT.email}</a></td></tr>
<tr><td align="center" style="padding:6px 30px 30px;font-family:${SANS};font-size:12px;color:${MUT}">${E(doc.settings.coop || "")}</td></tr>
<tr><td align="center" style="background:${INK};padding:18px 20px;font-family:${SANS};font-size:11px;letter-spacing:1px;color:#FFFFFF">${ADDRESS}<br><a href="${base}/listings" style="color:#BBBBBB;font-size:11px">View in browser</a></td></tr>
<tr><td style="background:${RED};height:6px;font-size:0;line-height:0">&nbsp;</td></tr>
</table></td></tr></table></body></html>`;
}
