import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readHighlightWord = () =>
  readFile(new URL("../src/components/HighlightWord.tsx", import.meta.url), "utf8");

test("HighlightWord does not animate text stroke width during highlight reveal", async () => {
  const source = await readHighlightWord();

  assert.doesNotMatch(source, /WebkitTextStrokeWidth:\s*interpolate/);
  assert.doesNotMatch(source, /import \{ interpolate,/);
  assert.doesNotMatch(source, /WebkitTextStrokeWidth/);
});
