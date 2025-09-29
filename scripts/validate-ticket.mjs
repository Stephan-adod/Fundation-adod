// scripts/validate-ticket.mjs
// ESM CLI: validates tickets/AT-*.md for naming, H1, DoR/DoD, required DoD bullets,
// and (in --strict) presence of Automatisierung/Governance/Feedback-Loop mentions.
// No external deps.

import { promises as fs } from "fs";
import path from "path";
import process from "process";
import os from "os";

const ROOT = process.cwd();

function parseArgs(argv) {
  const args = { strict: false, file: null, json: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--strict") args.strict = true;
    else if (a === "--json") args.json = true;
    else if (a === "--file") {
      const next = argv[i + 1];
      if (!next) {
        console.error("Error: --file requires a path");
        process.exit(2);
      }
      args.file = next;
      i++;
    }
  }
  return args;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip common noise
      if (e.name === ".git" || e.name === "node_modules") continue;
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

function isTicketPath(p) {
  if (!p.replaceAll("\\", "/").startsWith("tickets/")) return false;
  const base = path.basename(p);
  return /^AT-\d{3,}\.md$/.test(base);
}

function extractFirstNonEmptyLine(text) {
  const lines = text.split(/\r?\n/);
  for (const l of lines) {
    if (l.trim().length > 0) return l;
  }
  return "";
}

function containsDoR(text) {
  return /(^|\n)##\s*DoR(\s|$)/i.test(text);
}

function containsDoD(text) {
  return /(^|\n)##\s*DoD(\s|$)/i.test(text);
}

function getSection(text, headingRegex) {
  // naive section extractor: from heading to next "## "
  const lines = text.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headingRegex.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function hasDoDBullets(doDText) {
  // Require bullets referencing: CI grün, lint/format/test/docs/changelog, Evidence
  // We'll accept case-insensitive substrings anywhere in DoD section.
  const t = doDText.toLowerCase();
  const required = [
    "ci",
    "lint",
    "format",
    "test",
    "docs",
    "changelog",
    "evidence",
  ];
  return required.every((k) => t.includes(k));
}

function hasProjectBullets(text) {
  const t = text.toLowerCase();
  return (
    t.includes("automatisierung") &&
    t.includes("governance") &&
    (t.includes("feedback-loop") ||
      t.includes("feedback loop") ||
      t.includes("feedback-loop") ||
      t.includes("feedback"))
  );
}

function validateH1(h1Line, baseFile) {
  // Expect "# AT-XXX: "
  const re = /^#\s+AT-\d{3,}:\s+.+/;
  const ok = re.test(h1Line.trim());
  const expectedHint = `"# AT-###: <Titel>" (z. B. "# AT-${baseFile.replace(/^AT-(\d+)\.md$/, "$1")}: <Titel>")`;
  return { ok, expectedHint };
}

async function validateFile(filePath, opts) {
  const rel = path.relative(ROOT, filePath).replaceAll("\\", "/");
  const errors = [];
  const warnings = [];

  if (!isTicketPath(rel)) {
    errors.push(`Dateiname/Pfad ungültig (erwartet tickets/AT-###.md)`);
  }

  let text = "";
  try {
    const buf = await fs.readFile(filePath);
    // Basic UTF-8 BOM detection
    if (
      buf.length >= 3 &&
      buf[0] === 0xef &&
      buf[1] === 0xbb &&
      buf[2] === 0xbf
    ) {
      warnings.push("BOM gefunden (sollte entfernt werden)");
      text = buf.slice(3).toString("utf8");
    } else {
      text = buf.toString("utf8");
    }
  } catch (e) {
    errors.push(`Lesefehler: ${e.message}`);
    return { file: rel, ok: false, errors, warnings };
  }

  const firstLine = extractFirstNonEmptyLine(text);
  const { ok: h1Ok, expectedHint } = validateH1(firstLine, path.basename(rel));
  if (!h1Ok) {
    errors.push(`Erste Zeile muss H1 im Format ${expectedHint} sein`);
  }

  const hasR = containsDoR(text);
  const hasD = containsDoD(text);
  if (!hasR) errors.push('Sektion "## DoR" fehlt');
  if (!hasD) errors.push('Sektion "## DoD" fehlt');

  if (hasD) {
    const dod = getSection(text, /^##\s*DoD(\s|$)/i);
    if (!hasDoDBullets(dod)) {
      errors.push(
        "DoD muss Bullets zu CI, lint, format, test, docs, changelog und Evidence enthalten (Stichwort-basiert)",
      );
    }
  }

  if (opts.strict) {
    if (!hasProjectBullets(text)) {
      errors.push(
        "Strict: Ticket erwähnt nicht alle Projektspezifika: Automatisierung, Governance, Feedback-Loop",
      );
    }
  }

  return { file: rel, ok: errors.length === 0, errors, warnings };
}

async function main() {
  const args = parseArgs(process.argv);

  let targets = [];
  if (args.file) {
    const abs = path.isAbsolute(args.file)
      ? args.file
      : path.join(ROOT, args.file);
    targets = [abs];
  } else {
    // collect all tickets/AT-*.md
    const ticketDir = path.join(ROOT, "tickets");
    try {
      for await (const p of walk(ticketDir)) {
        if (p.endsWith(".md")) targets.push(p);
      }
    } catch (e) {
      console.error("Fehler beim Scannen von tickets/:", e.message);
      process.exit(2);
    }
    // Filter to AT-*.md only
    targets = targets.filter((p) => /^AT-\d{3,}\.md$/.test(path.basename(p)));
  }

  if (targets.length === 0) {
    console.error("Keine Ticket-Dateien gefunden.");
    process.exit(1);
  }

  const results = [];
  for (const f of targets) {
    const res = await validateFile(f, { strict: args.strict });
    results.push(res);
  }

  const okAll = results.every((r) => r.ok);
  if (args.json) {
    // machine-readable
    await fs
      .writeFile(
        path.join(
          ROOT,
          "artefacts",
          "reports",
          `${new Date().toISOString().slice(0, 10)}-ticket-validate.json`,
        ),
        JSON.stringify({ ok: okAll, results }, null, 2),
      )
      .catch(() => {});
    console.log(JSON.stringify({ ok: okAll, results }));
  } else {
    for (const r of results) {
      const status = r.ok ? "OK" : "FAIL";
      console.log(`\n• ${r.file} — ${status}`);
      if (r.warnings?.length) {
        for (const w of r.warnings) console.log(`  [warn] ${w}`);
      }
      if (!r.ok) {
        for (const e of r.errors) console.log(`  [err] ${e}`);
      }
    }
    console.log(
      `\nSummary: ${okAll ? "ALL OK" : "ERRORS FOUND"} (${results.filter((r) => !r.ok).length} failing file(s))`,
    );
  }

  process.exit(okAll ? 0 : 1);
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(2);
});
