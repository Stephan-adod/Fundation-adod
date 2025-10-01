#!/usr/bin/env node
// Append one JSONL record with minimal CI metrics.
// Usage: node scripts/ci-metrics.mjs <job> <result>

import fs from "node:fs";
import path from "node:path";

const job = process.argv[2] || "unknown";
const result = process.argv[3] || "unknown";

const rec = {
  ts: new Date().toISOString(),
  workflow: process.env.GITHUB_WORKFLOW || "local",
  run_id: process.env.GITHUB_RUN_ID || "local",
  job,
  result,
};

const dir = path.join("artefacts", "reports");
fs.mkdirSync(dir, { recursive: true });
fs.appendFileSync(
  path.join(dir, "ci-metrics.jsonl"),
  JSON.stringify(rec) + "\n",
  "utf8",
);
console.log("metrics:", rec);
