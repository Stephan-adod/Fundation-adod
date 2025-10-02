#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArg(flag, defVal = "") {
  const i = process.argv.findIndex((arg) => arg === flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : defVal;
}

const args = process.argv.slice(2);
let summary = "";
let explicitTicket = null;
let ticketFromBranch = false;

function extractTicket(str) {
  if (!str) return null;
  const m = String(str).match(/(AT-(?:PATCH-)?\d+)/i);
  return m ? m[1].toUpperCase() : null;
}

function detectTicketFromEnv() {
  const branchCand =
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    process.env.GITHUB_REF ||
    "";
  let ticket = extractTicket(branchCand);

  if (
    !ticket &&
    process.env.GITHUB_EVENT_PATH &&
    fs.existsSync(process.env.GITHUB_EVENT_PATH)
  ) {
    try {
      const ev = JSON.parse(
        fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"),
      );
      const title = ev?.pull_request?.title || ev?.issue?.title || "";
      ticket = extractTicket(title) || ticket;
    } catch {}
  }

  return ticket;
}

function runUrl() {
  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repo = process.env.GITHUB_REPOSITORY || "";
  const runId = process.env.GITHUB_RUN_ID || "";
  return `${server}/${repo}/actions/runs/${runId}`;
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
}

export function writeMarkdownSummary() {
  const outcome = (parseArg("--outcome", "success") || "success").toLowerCase();
  const prettierFixArg = (
    parseArg("--prettier-fix", "false") || "false"
  ).toLowerCase();
  const prettierFix = prettierFixArg === "true" ? "true" : "false";
  const envTicket = detectTicketFromEnv();
  const ticket = envTicket ? envTicket.toUpperCase() : "unknown";
  const timestamp = new Date().toISOString();
  const fileStamp = nowStamp();
  const summaryLines = [
    "# Loop Summary",
    "",
    `- **Ticket:** ${ticket}`,
    `- **Outcome:** ${outcome === "success" ? "✅ success" : "❌ failure"}`,
    `- **Prettier Fix applied:** ${prettierFix}`,
    `- **Run:** ${runUrl()}`,
    `- **Timestamp (UTC):** ${timestamp}`,
    "",
  ];

  const dir = path.join("artefacts", "loop_logs");
  fs.mkdirSync(dir, { recursive: true });
  const filename = path.join(dir, `${ticket}_${fileStamp}.md`);
  fs.writeFileSync(filename, summaryLines.join("\n"), "utf8");
  return filename;
}

if (args.includes("--write-md-summary")) {
  const file = writeMarkdownSummary();
  console.log("loop-summary:", file);
  process.exit(0);
}

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--summary") {
    summary = args[++i] || "";
  } else if (args[i] === "--ticket" && args[i + 1]) {
    explicitTicket = args[++i].toUpperCase();
  } else if (args[i] === "--ticket-from-branch") {
    ticketFromBranch = true;
  }
}

let detectedTicket = null;
if (ticketFromBranch) {
  detectedTicket = detectTicketFromEnv();
}

const ticket = explicitTicket || detectedTicket;
const runId = process.env.GITHUB_RUN_ID || String(Date.now());
const logDir = path.join("artefacts", "loop_logs");
fs.mkdirSync(logDir, { recursive: true });

const filename = `${ticket || "_unknown"}_${runId}.md`;
const file = path.join(logDir, filename);
const now = new Date().toISOString();

const body = [
  "# Loop Log",
  "",
  `- ts: ${now}`,
  `- run_id: ${runId}`,
  `- ticket: ${ticket || "unknown"}`,
  `- workflow: ${process.env.GITHUB_WORKFLOW || "local"}`,
  "",
  "## Summary",
  summary || "(none)",
  "",
].join("\n");

try {
  fs.writeFileSync(file, body, "utf8");
  console.log("loop-log:", file);
  process.exit(0);
} catch (e) {
  console.log("non-blocking:", e.message);
  process.exit(0);
}
