#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    }
    const [rawKey, inlineValue] = arg.split("=", 2);
    const key = rawKey.slice(2);
    if (!key) {
      throw new Error("Empty flag detected");
    }
    if (inlineValue !== undefined) {
      flags[key] = inlineValue;
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      throw new Error(`Missing value for flag --${key}`);
    }
    flags[key] = next;
    i += 1;
  }
  return flags;
}

function validateFlags(flags) {
  const requiredFlags = ["ticket", "input", "outputPath", "ci"];
  for (const flag of requiredFlags) {
    if (!flags[flag]) {
      throw new Error(`Missing required flag --${flag}`);
    }
  }
  const ciState = flags.ci.toLowerCase();
  if (ciState !== "success" && ciState !== "failure") {
    throw new Error("--ci must be either 'success' or 'failure'");
  }
  return { ...flags, ci: ciState };
}

function getGitCommit() {
  try {
    const output = execSync("git rev-parse HEAD", {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    return output.trim();
  } catch (error) {
    return null;
  }
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getLogFilePath(ticket) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const baseDir = path.resolve(__dirname, "..", "artefacts", "loop_logs", `${year}-${month}`);
  ensureDirectory(baseDir);
  return path.join(baseDir, `${ticket}.jsonl`);
}

function buildLogEntry(flags) {
  const timestamp = new Date().toISOString();
  const user = process.env.USER || process.env.USERNAME || null;
  const gitCommit = getGitCommit();
  return {
    timestamp,
    gitCommit,
    user,
    ticket: flags.ticket,
    input: flags.input,
    outputPath: flags.outputPath,
    ci: flags.ci,
    notes: flags.notes ?? null,
  };
}

function appendLog(filePath, entry) {
  const line = `${JSON.stringify(entry)}\n`;
  fs.appendFileSync(filePath, line, { encoding: "utf8" });
}

function main() {
  try {
    const flags = validateFlags(parseArgs(process.argv.slice(2)));
    const logPath = getLogFilePath(flags.ticket);
    const entry = buildLogEntry(flags);
    appendLog(logPath, entry);
    console.log(`Log entry appended to ${path.relative(process.cwd(), logPath)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
