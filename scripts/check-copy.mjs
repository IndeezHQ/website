#!/usr/bin/env node
/**
 * Fails the build if an em dash or en dash reaches anything a reader sees.
 *
 * House style: no — or – in copy. Hyphens are fine, and so are dashes inside
 * code comments, which is why this cannot be a plain grep. It parses each file
 * with the TypeScript compiler and inspects only the nodes that actually
 * render: string literals, template strings and JSX text. Comments are trivia
 * and never appear as nodes, so they pass untouched.
 *
 * Run by `npm run verify`.
 */

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

const ROOT = process.cwd();
const BANNED = /[—–]/;

/**
 * The legal documents are verbatim ports of the published Privacy Policy,
 * Terms, Child Safety Standards and Support pages. Their punctuation is part
 * of a document people have already agreed to, so it is not ours to restyle —
 * they are checked separately and deliberately excluded here.
 */
const EXCLUDED = ["src/content/legal/"];

const isExcluded = (file) =>
  EXCLUDED.some((prefix) => file.replaceAll(path.sep, "/").startsWith(prefix));

const violations = [];

function record(file, source, position, text) {
  const { line, character } = source.getLineAndCharacterOfPosition(position);
  violations.push({
    file,
    line: line + 1,
    column: character + 1,
    text: text.trim().replace(/\s+/g, " ").slice(0, 90),
  });
}

for (const file of globSync("src/**/*.{ts,tsx}", { cwd: ROOT })) {
  if (isExcluded(file)) continue;

  const contents = readFileSync(path.join(ROOT, file), "utf8");
  const source = ts.createSourceFile(
    file,
    contents,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const visit = (node) => {
    const rendered =
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node);

    if (rendered && BANNED.test(node.text)) {
      record(file, source, node.getStart(source), node.text);
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
}

// Markdown outside the legal documents is copy too.
for (const file of globSync("src/content/**/*.md", { cwd: ROOT })) {
  if (isExcluded(file)) continue;

  const contents = readFileSync(path.join(ROOT, file), "utf8");
  contents.split("\n").forEach((text, index) => {
    if (BANNED.test(text)) {
      violations.push({
        file,
        line: index + 1,
        column: text.search(BANNED) + 1,
        text: text.trim().slice(0, 90),
      });
    }
  });
}

if (violations.length === 0) {
  console.log("check-copy: no em or en dashes in user-facing copy");
  process.exit(0);
}

console.error(
  `check-copy: found ${violations.length} em/en dash${
    violations.length === 1 ? "" : "es"
  } in user-facing copy.\n` +
    "House style is to use none. A hyphen, a comma, a colon or two sentences " +
    "will all do the job.\n"
);

for (const v of violations) {
  console.error(`  ${v.file}:${v.line}:${v.column}`);
  console.error(`    ${v.text}\n`);
}

process.exit(1);
