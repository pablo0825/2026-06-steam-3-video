import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const srcDir = new URL("../src/", import.meta.url);
const scenesDir = new URL("scenes/", srcDir);

const readRoot = () => readFile(new URL("Root.tsx", srcDir), "utf8");

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

test("Ch2 S03 holds the white opening background before KnowledgeNav appears", async () => {
  const scene = await readCh2Scene("Ch2Page1S03KnowledgeNav.tsx");
  const root = await readRoot();

  assert.match(
    scene,
    /const TAGS = \["限制設計", "核心玩法", "核心循環", "Storyboard"\] as const;/,
  );
  assert.match(scene, /const OPENING_HOLD = 30;/);
  assert.match(scene, /const CONTENT_IN = \[OPENING_HOLD, OPENING_HOLD \+ 20\] as const;/);
  assert.match(scene, /const TAG_FIRST = OPENING_HOLD \+ 38;/);
  assert.match(scene, /const HILITE = \[OPENING_HOLD \+ 186, OPENING_HOLD \+ 218\] as const;/);
  assert.match(
    root,
    /component=\{Ch2Page1S03KnowledgeNav\}[\s\S]*?durationInFrames=\{300\}/,
  );
});

test("Ch2 S03 copied variants enter together, highlight the requested tag, and fade out fully", async () => {
  const root = await readRoot();
  const variants = [
    ["02", "Ch2Page1S03KnowledgeNav02", 1],
    ["03", "Ch2Page1S03KnowledgeNav03", 2],
    ["04", "Ch2Page1S03KnowledgeNav04", 3],
  ];

  for (const [suffix, componentName, highlightIndex] of variants) {
    const scene = await readCh2Scene(`Ch2Page1S03KnowledgeNav-${suffix}.tsx`);

    assert.match(
      scene,
      /const TAGS = \["限制設計", "核心玩法", "核心循環", "Storyboard"\] as const;/,
    );
    assert.match(scene, /const HOLD = 30;/);
    assert.match(scene, /const OPENING_FADE = \[0, 20\] as const;/);
    assert.match(scene, /const HIGHLIGHT = \[50, 90\] as const;/);
    assert.match(scene, /const ENDING_FADE = \[245, 269\] as const;/);
    assert.match(scene, new RegExp(`highlightIndex=\\{${highlightIndex}\\}`));
    assert.match(scene, /animateIn=\{false\}/);
    assert.match(
      root,
      new RegExp(
        `id="Ch2-Page1-S03-KnowledgeNav-${suffix}"[\\s\\S]*?component=\\{${componentName}\\}[\\s\\S]*?durationInFrames=\\{300\\}`,
      ),
    );
  }
});
