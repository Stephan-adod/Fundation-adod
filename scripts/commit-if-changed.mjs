#!/usr/bin/env node
// Commit and push metrics/log updates for same-repo pull requests.

import { execSync } from "node:child_process";

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe" }).toString().trim();
}

try {
  const repo = process.env.GITHUB_REPOSITORY || "";
  const owner = process.env.GITHUB_REPOSITORY_OWNER || "";
  const repoName = repo.split("/")[1] || "";
  const prRepo = owner && repoName ? `${owner}/${repoName}` : "";
  const headRef = process.env.GITHUB_HEAD_REF || "";
  const isSameRepo = Boolean(headRef && prRepo && prRepo === repo);

  if (!isSameRepo) {
    console.log("skip commit: fork or missing headRef");
    process.exit(0);
  }

  try {
    sh(
      "git add artefacts/reports/ci-metrics.jsonl artefacts/loop_logs || true",
    );
  } catch {
    // ignore staging errors
  }

  const status = sh("git status --porcelain");
  if (!status) {
    console.log("no changes to commit");
    process.exit(0);
  }

  sh('git config user.name "github-actions[bot]"');
  sh('git config user.email "github-actions[bot]@users.noreply.github.com"');
  sh('git commit -m "chore(ci): persist metrics & loop-log [skip ci]"');
  sh(`git push origin HEAD:${headRef}`);
  console.log("persisted metrics/logs");
} catch (error) {
  console.log("non-blocking:", error?.message || error);
  process.exit(0);
}
