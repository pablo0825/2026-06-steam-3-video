import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const scenesDir = new URL("../src/scenes/", import.meta.url);

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

test("Ch2 S06 question is centered plain text without follow-up prompt", async () => {
  const source = await readCh2Scene("Ch2Page2S06Question.tsx");

  assert.match(source, /fontSize: 100,/);
  assert.match(source, /fontWeight: 800,/);
  assert.match(source, /textAlign: "center",/);
  assert.match(source, /Easing\.bezier\(0\.16, 1, 0\.3, 1\)/);
  assert.match(source, /const TITLE_IN = \[5, 28\] as const;/);
  assert.match(source, /const titleIn = interpolate\(frame, TITLE_IN, \[0, 1\]/);
  assert.match(source, /easing: EASE_OUT/);
  assert.match(source, /const titleScale = interpolate\(titleIn, \[0, 1\], \[0\.9, 1\]\);/);
  assert.match(source, /position: "absolute",/);
  assert.match(source, /left: 960,/);
  assert.match(source, /top: 540,/);
  assert.match(source, /translate\(-50%, -50%\) scale/);
  assert.doesNotMatch(source, /來看下一個案例/);
  assert.doesNotMatch(source, /<span style=\{KEY\}>/);
  assert.doesNotMatch(source, /\bYELLOW\b/);
  assert.doesNotMatch(source, /\bBLUE\b/);
});
