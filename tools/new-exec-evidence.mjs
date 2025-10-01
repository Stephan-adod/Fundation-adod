#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  const k = args[i];
  if (k.startsWith("--")) {
    const key = k.replace(/^--/, "");
    opt[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
}

function nowSlug() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes())
  );
}

const slug = nowSlug() + "_" + Math.random().toString(36).slice(2, 6);
const dir = path.join("artefacts", "execution", slug);
fs.mkdirSync(dir, { recursive: true });

const meta = [
  `Ticket: ${opt.ticket || "(none)"}`,
  `Prompt-Provenance: ${opt.prompt || "(unknown)"}`,
  `Commit: ${process.env.GITHUB_SHA || "(local)"}`,
  `Source: ${opt.source || "(n/a)"}`,
  `Note: ${opt.note || ""}`,
].join("\n");

fs.writeFileSync(path.join(dir, "meta.txt"), meta + "\n", "utf8");

const out = `# Execution Output\n\n(Insert real result here)\n`;
fs.writeFileSync(path.join(dir, "output.md"), out, "utf8");

console.log("execution evidence written:", dir);
