import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const decoder = new TextDecoder('utf-8', { fatal: true });

function parseArgs(argv) {
  let root = '.';
  let fix = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--root') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --root');
      }
      root = argv[i + 1];
      i += 1;
    } else if (arg === '--fix') {
      fix = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { root, fix };
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      const nested = await collectMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function analyzeBuffer(buffer) {
  const issues = [];
  let text;
  try {
    text = decoder.decode(buffer);
  } catch (error) {
    issues.push({ type: 'encoding', message: 'is not valid UTF-8' });
    return { issues, fixable: false, text: '' };
  }

  const hasBom = buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
  if (hasBom) {
    issues.push({ type: 'bom', message: 'contains UTF-8 BOM' });
  }
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const check = analyzeText(text);
  issues.push(...check.issues);

  return { issues, fixable: true, text };
}

function analyzeText(text) {
  const issues = [];
  const trailingLines = [];
  const consecutiveBlankLines = [];
  const endsWithNewline = text.endsWith('\n');

  const lines = text.split('\n');
  if (endsWithNewline) {
    lines.pop();
  }

  let blankRun = 0;
  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index];
    if (line.endsWith('\r')) {
      line = line.slice(0, -1);
    }
    if (/[ \t]+$/.test(line)) {
      trailingLines.push(index + 1);
    }
    const isBlank = line.trim() === '';
    if (isBlank) {
      blankRun += 1;
      if (blankRun > 1) {
        consecutiveBlankLines.push(index + 1);
      }
    } else {
      blankRun = 0;
    }
  }

  if (trailingLines.length > 0) {
    issues.push({
      type: 'trailing-spaces',
      message: `trailing spaces on lines ${formatLineList(trailingLines)}`,
    });
  }
  if (consecutiveBlankLines.length > 0) {
    issues.push({
      type: 'blank-lines',
      message: `multiple consecutive blank lines around line ${consecutiveBlankLines[0]}`,
    });
  }
  if (text.length > 0 && !endsWithNewline) {
    issues.push({ type: 'final-newline', message: 'missing final newline' });
  }

  return { issues };
}

function formatLineList(lines) {
  if (lines.length <= 5) {
    return lines.join(', ');
  }
  return `${lines[0]}, ${lines[1]}, …, ${lines[lines.length - 1]}`;
}

function applyFixes(text) {
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }
  if (text === '') {
    return '';
  }

  const segments = text.split(/\r?\n/);
  const endsWithNewline = text.endsWith('\n');
  if (endsWithNewline) {
    segments.pop();
  }

  const fixedLines = [];
  let blankRun = 0;
  for (let segment of segments) {
    if (segment.endsWith('\r')) {
      segment = segment.slice(0, -1);
    }
    const withoutTrailing = segment.replace(/[ \t]+$/g, '');
    const isBlank = withoutTrailing.trim() === '';
    if (isBlank) {
      if (blankRun === 0) {
        fixedLines.push('');
      }
      blankRun += 1;
    } else {
      blankRun = 0;
      fixedLines.push(withoutTrailing);
    }
  }

  const normalized = fixedLines.join('\n');
  const shouldEndWithNewline = text.length > 0 || endsWithNewline;
  if (normalized === '') {
    return shouldEndWithNewline ? '\n' : '';
  }
  return shouldEndWithNewline ? `${normalized}\n` : normalized;
}

function displayPath(file, root) {
  const relativeToCwd = path.relative(process.cwd(), file);
  if (!relativeToCwd.startsWith('..')) {
    return relativeToCwd || path.basename(file);
  }
  const relativeToRoot = path.relative(root, file);
  return relativeToRoot || path.basename(file);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const root = path.resolve(process.cwd(), options.root);
  let rootStat;
  try {
    rootStat = await fs.stat(root);
  } catch (error) {
    console.error(`Cannot access root ${root}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  if (!rootStat.isDirectory()) {
    console.error(`Root path is not a directory: ${root}`);
    process.exitCode = 1;
    return;
  }

  const files = await collectMarkdownFiles(root);
  files.sort((a, b) => a.localeCompare(b));
  const violations = [];

  for (const file of files) {
    const buffer = await fs.readFile(file);
    const analysis = analyzeBuffer(buffer);
    let issues = analysis.issues;

    if (options.fix && issues.length > 0 && analysis.fixable) {
      const fixedContent = applyFixes(analysis.text);
      await fs.writeFile(file, fixedContent, 'utf8');
      const verification = analyzeBuffer(Buffer.from(fixedContent, 'utf8'));
      if (verification.issues.length === 0) {
        issues = [];
        console.log(`Fixed ${displayPath(file, root)}`);
      } else {
        issues = verification.issues;
      }
    }

    if (issues.length > 0) {
      violations.push({ file, issues });
    }
  }

  if (violations.length > 0) {
    for (const { file, issues } of violations) {
      const message = issues.map((issue) => issue.message).join('; ');
      console.error(`${displayPath(file, root)}: ${message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
