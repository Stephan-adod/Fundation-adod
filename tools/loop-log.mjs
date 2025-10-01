#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
let summary = "";
let explicitTicket = null;
let ticketFromBranch = false;

function extractTicket(str) {
  if (!str) return null;
  const m = String(str).match(/(AT-(?:PATCH-)?\d+)/i);
  return m ? m[1].toUpperCase() : null;
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
  const branchCand =
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    process.env.GITHUB_REF ||
    "";
  detectedTicket = extractTicket(branchCand);

  if (
    !detectedTicket &&
    process.env.GITHUB_EVENT_PATH &&
    fs.existsSync(process.env.GITHUB_EVENT_PATH)
  ) {
    try {
      const ev = JSON.parse(
        fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"),
      );
      const title = ev?.pull_request?.title || ev?.issue?.title || "";
      detectedTicket = extractTicket(title) || detectedTicket;
    } catch {}
  }
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
