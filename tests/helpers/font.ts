import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Reads the characters an OpenType/TrueType file can actually draw, straight
 * out of its `cmap` table.
 *
 * Indeez-Regular is a display face with a partial character set, and it now
 * sets every heading on the site. A heading using a glyph it lacks does not
 * error: it silently falls back to Space Grotesk mid-word, which reads as a
 * bug. Parsing the font is the only way to assert against the real coverage
 * rather than a hand-maintained list that will drift.
 */
export function readSupportedCharacters(fontPath: string): Set<string> {
  const data = readFileSync(path.resolve(fontPath));
  const tableCount = data.readUInt16BE(4);

  let cmapOffset = -1;
  for (let i = 0; i < tableCount; i += 1) {
    const record = 12 + i * 16;
    if (data.toString("latin1", record, record + 4) === "cmap") {
      cmapOffset = data.readUInt32BE(record + 8);
    }
  }
  if (cmapOffset < 0) throw new Error(`No cmap table in ${fontPath}`);

  const subtableCount = data.readUInt16BE(cmapOffset + 2);
  let format4Offset = -1;
  for (let i = 0; i < subtableCount; i += 1) {
    const record = cmapOffset + 4 + i * 8;
    const offset = cmapOffset + data.readUInt32BE(record + 4);
    if (data.readUInt16BE(offset) === 4) format4Offset = offset;
  }
  if (format4Offset < 0) throw new Error(`No format 4 cmap in ${fontPath}`);

  const segCount = data.readUInt16BE(format4Offset + 6) / 2;
  const endsAt = format4Offset + 14;
  const startsAt = endsAt + segCount * 2 + 2;
  const deltasAt = startsAt + segCount * 2;
  const rangesAt = deltasAt + segCount * 2;

  const characters = new Set<string>();
  for (let i = 0; i < segCount; i += 1) {
    const end = data.readUInt16BE(endsAt + i * 2);
    const start = data.readUInt16BE(startsAt + i * 2);
    const delta = data.readInt16BE(deltasAt + i * 2);
    const rangeOffset = data.readUInt16BE(rangesAt + i * 2);
    if (start === 0xffff) continue;

    for (let code = start; code <= end; code += 1) {
      let glyph: number;
      if (rangeOffset === 0) {
        glyph = (code + delta) & 0xffff;
      } else {
        const at = rangesAt + i * 2 + rangeOffset + (code - start) * 2;
        if (at + 2 > data.length) continue;
        glyph = data.readUInt16BE(at);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== 0) characters.add(String.fromCodePoint(code));
    }
  }

  return characters;
}
