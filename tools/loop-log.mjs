#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ARG_SUMMARY = "--summary";
const ARG_TICKET = "--ticket";
const ARG_TICKET_INLINE = "--ticket=";
const ARG_SUMMARY_INLINE = "--summary=";
const ARG_TICKET_FROM_BRANCH = "--ticket-from-branch";

function parseArgs(argv) {
  const result = {
    summary: "",
    ticket: null,
    ticketFromBranch: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === ARG_SUMMARY) {
      const next = argv[i + 1];
      if (next !== undefined) {
        result.summary = next;
        i += 1;
      } else {
        result.summary = "";
      }
      continue;
    }

    if (arg.startsWith(ARG_SUMMARY_INLINE)) {
      result.summary = arg.slice(ARG_SUMMARY_INLINE.length);
      continue;
    }

    if (arg === ARG_TICKET) {
      const next = argv[i + 1];
      if (next !== undefined) {
        result.ticket = next.toUpperCase();
        i += 1;
      }
      continue;
    }

    if (arg.startsWith(ARG_TICKET_INLINE)) {
      result.ticket = arg.slice(ARG_TICKET_INLINE.length).toUpperCase();
      continue;
    }

    if (arg === ARG_TICKET_FROM_BRANCH) {
      result.ticketFromBranch = true;
      continue;
    }
  }

  return result;
}

function extractTicket(value) {
  if (typeof value !== "string" || !value) {
    return null;
  }
  const match = value.match(/\b(AT-(?:PATCH-)?\d+)\b/i);
  return match ? match[1].toUpperCase() : null;
}

function getTicketFromEnvBranch() {
  const envCandidates = [
    process.env.GITHUB_HEAD_REF,
    process.env.GITHUB_REF_NAME,
  ];

  if (process.env.GITHUB_REF) {
    const parts = process.env.GITHUB_REF.split("/");
    envCandidates.push(parts[parts.length - 1]);
  }

  for (const candidate of envCandidates) {
    const ticket = extractTicket(candidate);
    if (ticket) {
      return ticket;
    }
  }

  const title = getTicketFromPrTitle();
  return extractTicket(title);
}

function getTicketFromPrTitle() {
  const titleEnvOrder = [
    "GITHUB_PR_TITLE",
    "PR_TITLE",
    "PULL_REQUEST_TITLE",
    "GITHUB_EVENT_PULL_REQUEST_TITLE",
    "GH_PR_TITLE",
  ];

  for (const name of titleEnvOrder) {
    const value = process.env[name];
    if (typeof value === "string" && value) {
      return value;
    }
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    return null;
  }

  try {
    const raw = fs.readFileSync(eventPath, "utf8");
    const payload = JSON.parse(raw);
    if (
      payload &&
      typeof payload === "object" &&
      payload.pull_request &&
      typeof payload.pull_request.title === "string"
    ) {
      return payload.pull_request.title;
    }
    if (
      payload &&
      typeof payload === "object" &&
      payload.issue &&
      typeof payload.issue.title === "string"
    ) {
      return payload.issue.title;
    }
  } catch (error) {
    // ignore errors when reading/parsing event payload
  }

  return null;
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildLogBody({ runId, ticket, summary }) {
  const now = new Date().toISOString();
  return [
    "# Loop Log",
    "",
    `- ts: ${now}`,
    `- run_id: ${runId}`,
    `- ticket: ${ticket || "unknown"}`,
    `- workflow: ${process.env.GITHUB_WORKFLOW || "local"}`,
    "",
    "## Summary",
    summary ? summary : "(none)",
    "",
  ].join("\n");
}

function writeLogFile({ ticket, runId, body }) {
  const dir = path.join("artefacts", "loop_logs");
  ensureDirectory(dir);
  const ticketSegment = ticket || "_unknown";
  const fileName = `${ticketSegment}_${runId}.md`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, body, "utf8");
  return filePath;
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    let ticket = args.ticket;
    if (!ticket && args.ticketFromBranch) {
      ticket = getTicketFromEnvBranch();
    }

    const runId = process.env.GITHUB_RUN_ID || String(Date.now());
    const body = buildLogBody({
      runId,
      ticket,
      summary: args.summary,
    });
    const filePath = writeLogFile({ ticket, runId, body });
    console.log("loop-log written:", filePath);
    process.exit(0);
  } catch (error) {
    console.error("loop-log failed:", error.message);
    process.exit(0);
  }
}

main();
