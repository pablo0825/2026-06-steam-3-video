import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const srcDir = new URL("../src/", import.meta.url);
const scenesDir = new URL("scenes/", srcDir);

const readSource = (name) => readFile(new URL(name, srcDir), "utf8");

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

test("Ch2 S19 uses the Ch4 sprite example viewer style", async () => {
  const root = await readSource("Root.tsx");
  const source = await readCh2Scene("Ch2Page7S19Examples.tsx");

  assert.match(source, /const ENDING_FADE = \[252, 275\] as const;/);
  assert.match(source, /const START = 8;/);
  assert.match(source, /const SEG = 78;/);
  assert.match(source, /const FADE = 18;/);
  assert.match(source, /const VIEW_TOP = 56;/);
  assert.match(source, /const VIEW_BOTTOM = 100;/);
  assert.match(source, /backgroundColor: BLACK, opacity: panelIn/);
  assert.match(source, /objectFit: "contain"/);
  assert.match(source, /STORYBOARD_SAMPLES\.map\(\(sample, i\)/);
  assert.match(source, /width: i === activeIdx \? 34 : 14,/);
  assert.match(source, /此影片僅用於教學實驗/);
  assert.doesNotMatch(source, /FullscreenStoryboardImage/);
  assert.match(
    root,
    /id="Ch2-Page7-S19-Examples"[\s\S]*?durationInFrames=\{276\}/,
  );
});
