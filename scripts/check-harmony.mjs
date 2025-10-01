#!/usr/bin/env node
/**
 * check-harmony.mjs
 * Verifiziert die inhaltliche Konsistenz zwischen:
 *  - artefacts/project_plan_v*.md   (Tickets + Loop-Zuordnung)
 *  - artefacts/systemkarte.md       (Loops → Artefakte → Tickets/Patches)
 *  - artefacts/loops/*.md           (Loop-Detaildokumente)
 *
 * Flags:
 *   --plan <path>           Pfad zum Projektplan (Default: artefacts/project_plan_v0.4.md)
 *   --system <path>         Pfad zur Systemkarte (Default: artefacts/systemkarte.md)
 *   --loops <dir>           Verzeichnis der Loop-Dokumente (Default: artefacts/loops)
 *   --strict                Exit 1 bei Fehlern
 *   --write-report          Schreibt JSON+MD Report nach artefacts/reports/
 *
 * Output:
 *   - Konsolenreport (kompakt)
 *   - optional JSON/MD Report mit Diffs
 *
 * Keine externen Dependencies.
 */

import fs from "node:fs";
import path from "node:path";

const args = (() => {
  const a = {
    plan: "artefacts/project_plan_v0.4.md",
    system: "artefacts/systemkarte.md",
    loops: "artefacts/loops",
    strict: false,
    writeReport: false,
  };
  for (let i = 2; i < process.argv.length; i++) {
    const t = process.argv[i];
    if (t === "--strict") a.strict = true;
    else if (t === "--write-report") a.writeReport = true;
    else if (t === "--plan") a.plan = process.argv[++i];
    else if (t === "--system") a.system = process.argv[++i];
    else if (t === "--loops") a.loops = process.argv[++i];
  }
  return a;
})();

function readFile(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}

function normalizeLoopName(s) {
  if (!s) return s;
  return s
    .replace(/^\s*#+\s*/g, "")
    .replace(/^[🔹\-\*\s]*/g, "")
    .replace(/\s*Loop\s*$/i, "")
    .replace(/\s*Diagnose\/Systemic\s*/i, "Diagnose/Systemic")
    .trim();
}

// --- Parser: Projektplan v0.4  ---------------------------------------------
function parsePlan(md) {
  const tickets = new Set();
  const loopMap = {}; // loopName -> Set of tickets
  const ticketLoopRegex = /\*\*?(AT-(?:PATCH-)?\d+)\s*\(Loop:\s*([^)]+)\)\*?\s*:/g;
  let m;
  while ((m = ticketLoopRegex.exec(md))) {
    const t = m[1];
    const loop = m[2].trim();
    tickets.add(t);
    const L = normalizeLoopName(loop);
    if (!loopMap[L]) loopMap[L] = new Set();
    loopMap[L].add(t);
  }
  // Fallback: catch plain ticket mentions (without explicit Loop) to ensure coverage metrics
  const plainTicketRegex = /\b(AT-(?:PATCH-)?\d+)\b/g;
  let p;
  while ((p = plainTicketRegex.exec(md))) tickets.add(p[1]);
  return { tickets, loopMap };
}

// --- Parser: Systemkarte ----------------------------------------------------
function sectionBetween(md, startIdx) {
  // returns slice until next "### " heading or end
  const rest = md.slice(startIdx);
  const idx = rest.search(/\n#{3}\s/); // next H3
  if (idx === -1) return rest;
  return rest.slice(0, idx);
}

function parseSystem(md) {
  const loopBlocks = []; // [{loop, artefacts:Set, tickets:Set}]
  // Find Loop headings like "### 🔹 Execution Loop"
  const re = /(^|\n)#{3}\s+[^\n]*?Loop[^\n]*\n/gi;
  let m;
  while ((m = re.exec(md))) {
    const headLine = md.slice(m.index, md.indexOf("\n", m.index) + 1);
    const loopName = normalizeLoopName(headLine.replace(/^#+\s+/, "").replace(/^[🔹\s]*/, ""));
    const block = sectionBetween(md, m.index);
    const artefacts = new Set();
    const tickets = new Set();

    // Artefakte list: after "- **Artefakte**" or "- **Tickets/Patches**" sections
    // simpler: collect bullet lines and match paths / names
    const bulletRegex = /^\s*-\s+(.*)$/gm;
    let b;
    while ((b = bulletRegex.exec(block))) {
      const line = b[1].trim();
      // tickets
      const ts = line.match(/\bAT-(?:PATCH-)?\d+\b/g);
      if (ts) ts.forEach((t) => tickets.add(t));
      // artefact heuristic: code-like or known names
      if (
        /`[^`]+`/.test(line) ||
        /(\.md|\.yml|\.yaml|\.mjs|\.jsonl|\.json|\.mdx)\b/.test(line) ||
        /(Registry|Guide|Dashboard|Systemkarte|Report|Policy|Config|Template|Workflow)/i.test(
          line
        )
      ) {
        artefacts.add(line.replace(/^`|`$/g, ""));
      }
    }

    loopBlocks.push({ loop: loopName, artefacts, tickets });
  }
  return loopBlocks;
}

// --- Parser: Loop-Dokumente -------------------------------------------------
function parseLoopDoc(md) {
  const titleMatch = md.match(/^#\s+(.+?)\s*$/m);
  const loopTitle = titleMatch ? titleMatch[1].trim() : "Unknown";
  const loop = normalizeLoopName(loopTitle);
  const tickets = new Set();
  const artefacts = new Set();

  // Extract "## Tickets/Patches" section
  const tpIdx = md.search(/^\s*##\s+Tickets\/Patches\s*$/m);
  if (tpIdx >= 0) {
    const block = sectionBetween(md, tpIdx);
    const tRe = /\bAT-(?:PATCH-)?\d+\b/g;
    let t;
    while ((t = tRe.exec(block))) tickets.add(t[0]);
  }

  // Extract "## Artefakte" section
  const artIdx = md.search(/^\s*##\s+Artefakte\s*$/m);
  if (artIdx >= 0) {
    const block = sectionBetween(md, artIdx);
    const bulletRegex = /^\s*-\s+(.*)$/gm;
    let b;
    while ((b = bulletRegex.exec(block))) {
      const line = b[1].trim();
      artefacts.add(line.replace(/^`|`$/g, ""));
    }
  }

  return { loop, tickets, artefacts };
}

// --- Diff Helpers -----------------------------------------------------------
function diffSets(a = new Set(), b = new Set()) {
  const onlyA = [...a].filter((x) => !b.has(x));
  const onlyB = [...b].filter((x) => !a.has(x));
  const both = [...a].filter((x) => b.has(x));
  return { onlyA, onlyB, both };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

// --- Main -------------------------------------------------------------------
function main() {
  const planMd = readFile(args.plan);
  const sysMd = readFile(args.system);
  const loopsDir = args.loops;

  const errors = [];
  const warnings = [];
  const info = [];

  if (!planMd) errors.push(`Plan nicht gefunden: ${args.plan}`);
  if (!sysMd) errors.push(`Systemkarte nicht gefunden: ${args.system}`);
  if (!fs.existsSync(loopsDir)) errors.push(`Loops-Verzeichnis nicht gefunden: ${loopsDir}`);
  if (errors.length) return finalize({ errors, warnings, info });

  const plan = parsePlan(planMd);
  const sysBlocks = parseSystem(sysMd);

  // Parse loop docs
  const loopDocs = {};
  const files = fs
    .readdirSync(loopsDir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();
  for (const f of files) {
    const md = readFile(path.join(loopsDir, f));
    if (!md) continue;
    const parsed = parseLoopDoc(md);
    loopDocs[parsed.loop] = loopDocs[parsed.loop] || { tickets: new Set(), artefacts: new Set(), files: [] };
    parsed.files = [f];
    // merge
    for (const t of parsed.tickets) loopDocs[parsed.loop].tickets.add(t);
    for (const a of parsed.artefacts) loopDocs[parsed.loop].artefacts.add(a);
    loopDocs[parsed.loop].files.push(f);
  }

  // 1) Existiert zu jedem Loop der Systemkarte ein Loop-Dokument?
  for (const b of sysBlocks) {
    if (!loopDocs[b.loop]) {
      errors.push(`Loop-Dokument fehlt: "${b.loop}" (Systemkarte führt es auf, aber kein passendes MD in ${loopsDir}/)`);
    }
  }

  // 2) Ticket-Deckungsgleichheit: Plan ↔ Systemkarte ↔ Loop-Dokumente (pro Loop)
  const loopNames = new Set([
    ...sysBlocks.map((b) => b.loop),
    ...Object.keys(loopDocs),
    ...Object.keys(plan.loopMap || {}),
  ]);

  const loopDiffs = [];
  for (const ln of loopNames) {
    const sysT = new Set((sysBlocks.find((b) => b.loop === ln)?.tickets) || []);
    const docT = new Set(loopDocs[ln]?.tickets || []);
    const planT = new Set(plan.loopMap[ln] || []);

    const d_sys_doc = diffSets(sysT, docT);
    const d_sys_plan = diffSets(sysT, planT);
    const d_doc_plan = diffSets(docT, planT);

    const anyDiff =
      d_sys_doc.onlyA.length || d_sys_doc.onlyB.length || d_sys_plan.onlyA.length || d_sys_plan.onlyB.length || d_doc_plan.onlyA.length || d_doc_plan.onlyB.length;

    if (anyDiff) {
      loopDiffs.push({ loop: ln, d_sys_doc, d_sys_plan, d_doc_plan });
      warnings.push(`Ticket-Diff in Loop "${ln}" (Details im Report).`);
    }
  }

  // 3) Vollständigkeit: alle Tickets aus dem Plan in mind. Systemkarte ODER Loop-Doc?
  const allInSys = new Set(sysBlocks.flatMap((b) => [...b.tickets]));
  const allInDocs = new Set(Object.values(loopDocs).flatMap((x) => [...x.tickets]));
  const uncovered = [...plan.tickets].filter((t) => !allInSys.has(t) && !allInDocs.has(t));
  if (uncovered.length) {
    errors.push(`Tickets im Plan, aber weder Systemkarte noch Loop-Dokument: ${uncovered.join(", ")}`);
  }

  // 4) Artefakt-Abgleich (weich, nur Warnung): Systemkarte vs. Loop-Dokumente
  const artefactDiffs = [];
  for (const ln of loopNames) {
    const sysA = new Set((sysBlocks.find((b) => b.loop === ln)?.artefacts) || []);
    const docA = new Set(loopDocs[ln]?.artefacts || []);
    const d = diffSets(sysA, docA);
    if (d.onlyA.length || d.onlyB.length) {
      artefactDiffs.push({ loop: ln, diff: d });
      warnings.push(`Artefakt-Diff in Loop "${ln}" (Details im Report).`);
    }
  }

  info.push(`Loops (Systemkarte): ${sysBlocks.map((b) => b.loop).join(", ")}`);
  info.push(`Loops (Docs): ${Object.keys(loopDocs).join(", ")}`);
  info.push(`Tickets (Plan gesamt): ${plan.tickets.size}`);

  return finalize({ errors, warnings, info, loopDiffs, artefactDiffs });
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function finalize(result) {
  const { errors = [], warnings = [], info = [], loopDiffs = [], artefactDiffs = [] } = result;

  // Console summary
  console.log("• Harmony Report");
  info.forEach((l) => console.log("  [info]", l));
  warnings.forEach((w) => console.log("  [warn]", w));
  errors.forEach((e) => console.log("  [err] ", e));

  // Write report if requested
  if (args.writeReport) {
    const dir = path.join("artefacts", "reports");
    ensureDir(dir);
    const base = path.join(dir, `harmony-${nowStamp()}`);
    const json = {
      summary: { errors: errors.length, warnings: warnings.length, info: info.length },
      info,
      warnings,
      errors,
      loopDiffs,
      artefactDiffs,
      inputs: { plan: args.plan, system: args.system, loops: args.loops },
    };
    fs.writeFileSync(base + ".json", JSON.stringify(json, null, 2), "utf8");

    const md = [];
    md.push("# Harmony Report");
    md.push("");
    md.push(`**Inputs:** plan=${args.plan}, system=${args.system}, loops=${args.loops}`);
    md.push("");
    md.push("## Summary");
    md.push(`- Errors: **${errors.length}**`);
    md.push(`- Warnings: **${warnings.length}**`);
    md.push(`- Info: **${info.length}**`);
    if (info.length) {
      md.push("\n## Info");
      md.push(...info.map((x) => `- ${x}`));
    }
    if (warnings.length) {
      md.push("\n## Warnings");
      md.push(...warnings.map((x) => `- ${x}`));
    }
    if (errors.length) {
      md.push("\n## Errors");
      md.push(...errors.map((x) => `- ${x}`));
    }
    if (loopDiffs.length) {
      md.push("\n## Ticket Diffs per Loop");
      for (const ld of loopDiffs) {
        md.push(`### ${ld.loop}`);
        md.push(`- Systemkarte ∖ Loop-Docs: ${ld.d_sys_doc.onlyA.join(", ") || "—"}`);
        md.push(`- Loop-Docs ∖ Systemkarte: ${ld.d_sys_doc.onlyB.join(", ") || "—"}`);
        md.push(`- Systemkarte ∖ Plan: ${ld.d_sys_plan.onlyA.join(", ") || "—"}`);
        md.push(`- Plan ∖ Systemkarte: ${ld.d_sys_plan.onlyB.join(", ") || "—"}`);
        md.push(`- Loop-Docs ∖ Plan: ${ld.d_doc_plan.onlyA.join(", ") || "—"}`);
        md.push(`- Plan ∖ Loop-Docs: ${ld.d_doc_plan.onlyB.join(", ") || "—"}`);
        md.push("");
      }
    }
    if (artefactDiffs.length) {
      md.push("\n## Artefact Diffs per Loop");
      for (const ad of artefactDiffs) {
        md.push(`### ${ad.loop}`);
        md.push(`- Systemkarte ∖ Loop-Docs: ${ad.diff.onlyA.join(", ") || "—"}`);
        md.push(`- Loop-Docs ∖ Systemkarte: ${ad.diff.onlyB.join(", ") || "—"}`);
        md.push("");
      }
    }
    fs.writeFileSync(base + ".md", md.join("\n"), "utf8");
    console.log(`  [info] Report geschrieben: ${base}.{json,md}`);
  }

  const hasErrors = errors.length > 0;
  process.exit(args.strict && hasErrors ? 1 : 0);
}

main();
