import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const srcDir = new URL("../src/", import.meta.url);
const scenesDir = new URL("scenes/", srcDir);

const readSource = (name) => readFile(new URL(name, srcDir), "utf8");
const readRoot = () => readSource("Root.tsx");

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

test("DefinitionCard can delay all content while keeping the opening background blank", async () => {
  const source = await readSource("components/DefinitionCard.tsx");

  assert.match(source, /openingHoldFrames\?: number;/);
  assert.match(source, /openingHoldFrames = 0,/);
  assert.match(source, /const localFrame = frame - openingHoldFrames;/);
  assert.match(source, /frame: localFrame - 8,/);
  assert.match(source, /interpolate\(localFrame, \[44, 70\]/);
});

test("Ch2 definition intro pages use DefinitionCard with a 30-frame opening hold", async () => {
  const root = await readRoot();
  const pages = [
    ["Ch2Page2S04Constraint.tsx", "Ch2Page2S04Constraint", 270, "限制設計"],
    ["Ch2Page4S10CorePlay.tsx", "Ch2Page4S10CorePlay", 250, "核心玩法"],
    ["Ch2Page5S13CoreLoop.tsx", "Ch2Page5S13CoreLoop", 316, "核心循環"],
    ["Ch2Page7S18StoryboardIntro.tsx", "Ch2Page7S18StoryboardIntro", 270, "Storyboard"],
  ];

  for (const [fileName, componentName, duration, title] of pages) {
    const scene = await readCh2Scene(fileName);
    assert.match(scene, /DefinitionCard/);
    assert.match(scene, /openingHoldFrames=\{30\}/);
    assert.match(scene, new RegExp(`title="${title}"`));
    assert.match(
      root,
      new RegExp(
        `component=\\{${componentName}\\}[\\s\\S]*?durationInFrames=\\{${duration}\\}`,
      ),
    );
  }
});
