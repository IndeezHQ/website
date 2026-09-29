import { globSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { readSupportedCharacters } from "../helpers/font";

/**
 * `--font-display` resolves to Indeez-Regular, which sets every heading on
 * the site. It is a display face with a partial character set: a heading
 * containing a bracket or a slash falls back to Space Grotesk silently,
 * mid-word.
 *
 * These tests read the real coverage out of the font file, so they keep
 * working if the face is ever replaced with a fuller one.
 */

const SUPPORTED = readSupportedCharacters(
  "src/assets/fonts/Indeez-Regular.ttf"
);

function unsupported(text: string): string[] {
  return [...new Set([...text].filter((c) => !SUPPORTED.has(c)))];
}

function headingsInMarkdown(): { where: string; text: string }[] {
  return globSync("src/content/**/*.md").flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .map((line, i) => ({ line, i }))
      .filter(({ line }) => /^#{2,3} /.test(line))
      .map(({ line, i }) => ({
        where: `${file}:${i + 1}`,
        text: line.replace(/^#+\s*/, "").trim(),
      }))
  );
}

function headingsInSource(): { where: string; text: string }[] {
  const found: { where: string; text: string }[] = [];
  for (const file of globSync("src/**/*.{ts,tsx}")) {
    const source = readFileSync(file, "utf8");

    // `title:` fields feed headings and <title> tags.
    for (const match of source.matchAll(/\btitle:\s*"([^"]+)"/g)) {
      found.push({ where: file, text: match[1] });
    }
    // Literal text inside a heading element, skipping JSX expressions.
    for (const match of source.matchAll(
      /<h[123][^>]*>\s*([^<{][^<]*?)\s*<\/h[123]>/g
    )) {
      const text = match[1].replace(/\s+/g, " ").trim();
      if (text && !text.includes("{")) found.push({ where: file, text });
    }
  }
  return found;
}

describe("the heading face can draw every heading", () => {
  it("covers the characters the site actually uses", () => {
    expect(SUPPORTED.size).toBeGreaterThan(60);
    for (const c of "ABCabc019 .,") expect(SUPPORTED.has(c)).toBe(true);
  });

  it.each(headingsInMarkdown())(
    "renders the markdown heading at $where",
    ({ text }) => {
      expect(unsupported(text), `"${text}"`).toEqual([]);
    }
  );

  it("renders every heading and title in the source", () => {
    const broken = headingsInSource()
      .map((h) => ({ ...h, missing: unsupported(h.text) }))
      .filter((h) => h.missing.length > 0);

    expect(
      broken.map((h) => `${h.where}: "${h.text}" lacks ${h.missing.join(" ")}`)
    ).toEqual([]);
  });
});
