#!/usr/bin/env node
// Append one JSONL record with CI metrics, including duration and cost estimation.
// Usage: node scripts/ci-metrics.mjs <job> <result> [--duration <seconds>] [--rate <usd_per_min>]

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const job = args[0] || "unknown";
const result = args[1] || "unknown";

// parse optional flags
let duration_s = 0;
let rate = Number(process.env.RATE_PER_MIN || 0);
for (let i = 2; i < args.length; i++) {
  if (args[i] === "--duration" && args[i + 1] !== undefined) {
    duration_s = Number(args[++i] || 0);
  } else if (args[i] === "--rate" && args[i + 1] !== undefined) {
    rate = Number(args[++i] || rate);
  }
}

const duration_min = duration_s / 60;
const est_cost_usd = Number((duration_min * rate).toFixed(4));

const rec = {
  ts: new Date().toISOString(),
  workflow: process.env.GITHUB_WORKFLOW || "local",
  run_id: process.env.GITHUB_RUN_ID || "local",
  job,
  result,
  duration_s,
  duration_min: Number(duration_min.toFixed(2)),
  est_cost_usd,
};

const dir = path.join("artefacts", "reports");
fs.mkdirSync(dir, { recursive: true });
fs.appendFileSync(
  path.join(dir, "ci-metrics.jsonl"),
  JSON.stringify(rec) + "\n",
  "utf8",
);
console.log("metrics:", rec);
