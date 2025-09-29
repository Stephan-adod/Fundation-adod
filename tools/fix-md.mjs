import fs from "fs";
import path from "path";

const root = process.cwd();
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.toLowerCase().endsWith(".md")) files.push(p);
  }
}
walk(root);

const toLF = (s) => s.replace(/\r\n/g, "\n");
const stripBOM = (s) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);

for (const file of files) {
  let txt = fs.readFileSync(file, "utf8");
  const original = txt;
  txt = toLF(stripBOM(txt));
  const lines = txt.split("\n");

  // sichere H1 (MD041): erste nicht-leere Zeile beginnt mit "# "
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  const first = lines[i] ?? "";
  if (!first.startsWith("# ")) {
    const base = path
      .basename(file)
      .replace(/[_-]+/g, " ")
      .replace(/\.md$/i, "");
    const title = base.charAt(0).toUpperCase() + base.slice(1);
    lines.splice(i, 0, `# ${title}`);
  }

  // max. eine Leerzeile (MD012), trailing spaces
  let out = lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "");
  if (out !== original) {
    fs.writeFileSync(file, out, "utf8");
    console.log("fixed:", file);
  }
}
