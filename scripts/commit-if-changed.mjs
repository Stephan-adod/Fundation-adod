#!/usr/bin/env node
// Commit and push metrics/log updates for same-repo pull requests.

import fs from "node:fs";
import { execSync } from "node:child_process";

const TRACKED_PATHS = [
  "artefacts/reports/ci-metrics.jsonl",
  "artefacts/loop_logs",
];

const run = (cmd) => execSync(cmd, { stdio: "pipe" }).toString().trim();

function isSameRepoPullRequest(repo) {
  const headRef = process.env.GITHUB_HEAD_REF || "";
  if (!headRef || !repo) {
    return false;
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && fs.existsSync(eventPath)) {
    try {
      const payload = JSON.parse(fs.readFileSync(eventPath, "utf8"));
      const prRepo = payload?.pull_request?.head?.repo?.full_name;
      return prRepo ? prRepo === repo : false;
    } catch {
      // ignore parse errors and fall through to env heuristic
    }
  }

  const owner = process.env.GITHUB_REPOSITORY_OWNER || "";
  const repoName = repo.split("/")[1] || "";
  const derived = owner && repoName ? `${owner}/${repoName}` : "";
  return Boolean(derived && derived === repo);
}

function stageTrackedPaths() {
  const addArgs = TRACKED_PATHS.join(" ");
  try {
    run(`git add -- ${addArgs}`);
  } catch {
    // ignore staging errors, files may not exist yet
  }
}

function getStagedTrackedFiles() {
  const stagedOutput = run("git diff --cached --name-only");
  if (!stagedOutput) {
    return [];
  }
  return stagedOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function allPathsAllowed(staged) {
  return staged.every((file) => {
    if (file === TRACKED_PATHS[0]) {
      return true;
    }
    return file.startsWith(`${TRACKED_PATHS[1]}/`);
  });
}

try {
  const repo = process.env.GITHUB_REPOSITORY || "";
  if (!isSameRepoPullRequest(repo)) {
    console.log("skip commit: fork or missing headRef");
    process.exit(0);
  }

  stageTrackedPaths();
  const staged = getStagedTrackedFiles();
  if (staged.length === 0) {
    console.log("no changes");
    process.exit(0);
  }

  if (!allPathsAllowed(staged)) {
    console.log("skip commit: staged files outside artefacts scope");
    process.exit(0);
  }

  run('git config user.name "github-actions[bot]"');
  run('git config user.email "github-actions[bot]@users.noreply.github.com"');
  run('git commit -m "chore(ci): persist metrics & loop-log [skip ci]"');
  const headRef = process.env.GITHUB_HEAD_REF || "";
  run(`git push origin HEAD:${headRef}`);
  console.log("persisted metrics/logs");
} catch (error) {
  console.log("non-blocking:", error?.message || error);
  process.exit(0);
}
