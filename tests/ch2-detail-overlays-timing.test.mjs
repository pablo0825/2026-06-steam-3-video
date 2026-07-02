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

test("Ch2 detail overlays delay veil until after the lower-third clears", async () => {
  const scenes = [
    ["Ch2Page3S08LimitOverlay.tsx", "const END_FILL = [310, 338] as const;"],
    ["Ch2Page4S12ActionsOverlay.tsx", "const END_FILL = [206, 229] as const;"],
  ];

  for (const [fileName, endFill] of scenes) {
    const source = await readCh2Scene(fileName);

    assert.match(source, /const BAR_OUT = \[48, 72\] as const;/);
    assert.match(source, /const VEIL_IN = \[102, 130\] as const;/);
    assert.ok(source.includes(endFill));
    assert.match(source, /const barOpacity = interpolate\(frame, BAR_OUT, \[1, 0\], clamp\);/);
    assert.match(source, /const endFill = interpolate\(frame, END_FILL, \[0, 1\], clamp\);/);
    assert.match(source, /backgroundColor: withAlpha\(BLACK, 0\.82\),/);
    assert.match(source, /opacity: barOpacity,/);
    assert.match(source, /backgroundColor: NEUTRAL_50, opacity: endFill/);
  }
});

test("Ch2 S12 holds 30 frames after the third action before ending", async () => {
  const root = await readSource("Root.tsx");
  const source = await readCh2Scene("Ch2Page4S12ActionsOverlay.tsx");

  assert.match(source, /const ACTION_START = \[144, 160, 176\] as const;/);
  assert.match(source, /const CONTENT_OUT = \[206, 229\] as const;/);
  assert.match(source, /const END_FILL = \[206, 229\] as const;/);
  assert.match(
    root,
    /id="Ch2-Page4-S12-Actions-Overlay"[\s\S]*?durationInFrames=\{230\}/,
  );
});
