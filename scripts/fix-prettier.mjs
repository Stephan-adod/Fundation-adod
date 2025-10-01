#!/usr/bin/env node
import { execSync } from "node:child_process";

try {
  console.log("🔧 Running Prettier...");
  execSync("npx --yes prettier --write .", { stdio: "inherit" });

  console.log("📦 Staging changes...");
  execSync("git add .", { stdio: "inherit" });

  console.log("✅ Committing...");
  execSync('git commit -m "chore(prettier): auto-fix via Codex"', {
    stdio: "inherit",
  });

  console.log("🚀 Pushing...");
  execSync("git push origin HEAD", { stdio: "inherit" });

  console.log("🎉 Done. Auto-format applied and pushed.");
} catch (e) {
  console.error("❌ Prettier fix failed:", e.message);
  process.exit(0);
}
