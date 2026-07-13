import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

import test from "node:test";

const rootDir = new URL("../src/", import.meta.url);
const scenesDir = new URL("scenes/", rootDir);

const readRoot = () => readFile(new URL("Root.tsx", rootDir), "utf8");

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

const durationForComponent = (root, componentName) => {
  const match = root.match(
    new RegExp(
      `component=\\{${componentName}\\}[\\s\\S]*?durationInFrames=\\{(\\d+)\\}`,
    ),
  );
  assert.ok(match, `${componentName} has a Root.tsx duration`);
  return Number(match[1]);
};

const constRangeEnd = (source, constName) => {
  const match = source.match(new RegExp(`const ${constName} = \\[\\d+, (\\d+)\\] as const;`));
  assert.ok(match, `${constName} exists`);
  return Number(match[1]);
};

const finalStoryboardSampleFadeOutEnd = (source) => {
  const matches = [...source.matchAll(/fadeOut: \[\d+, (\d+)\]/g)];
  assert.ok(matches.length > 0, "STORYBOARD_SAMPLES has fadeOut ranges");
  return Number(matches.at(-1)[1]);
};

test("Ch2 ending fade-out ranges end on the final rendered frame", async () => {
  const root = await readRoot();
  const scenes = [
    ["Ch2Page1S01Opening", "Ch2Page1S01Opening.tsx", "CONTENT_OUT"],
    ["Ch2Page2S06Question", "Ch2Page2S06Question.tsx", "CONTENT_OUT"],
    ["Ch2Page3S09ConstraintMethod", "Ch2Page3S09ConstraintMethod.tsx", "CONTENT_OUT"],
    ["Ch2Page4S12ActionsOverlay", "Ch2Page4S12ActionsOverlay.tsx", "CONTENT_OUT"],
    // S14 刻意不淡出（保持原樣到最後），故不列入結尾淡出檢查。
    // S15 已拆成 -01／-02，真正做結尾淡出的是 -02。
    ["Ch2Page5S15MonsterLoop02", "Ch2Page5S15MonsterLoop-02.tsx", "CONTENT_OUT"],
    // S17 已拆成 -01（Celeste 實機 alpha overlay，結尾用 END_FILL 填底）／-02。
    ["Ch2Page6S17CelesteLoop02", "Ch2Page6S17CelesteLoop-02.tsx", "CONTENT_OUT"],
    ["Ch2Page7S21Consensus01", "Ch2Page7S21Consensus-01.tsx", "CONTENT_OUT"],
    ["Ch2Page7S21Consensus02", "Ch2Page7S21Consensus-02.tsx", "CONTENT_OUT"],
    ["Ch2Page7S21Consensus03", "Ch2Page7S21Consensus-03.tsx", "CONTENT_OUT"],
    ["Ch2Page7S22Checklist", "Ch2Page7S22Checklist.tsx", "CONTENT_OUT"],
  ];

  for (const [componentName, fileName, constName] of scenes) {
    const source = await readCh2Scene(fileName);
    assert.equal(
      constRangeEnd(source, constName),
      durationForComponent(root, componentName) - 1,
      `${componentName} fades to zero on the final rendered frame`,
    );
  }

  const shared = await readCh2Scene("Ch2Page7StoryboardShared.tsx");
  assert.equal(
    finalStoryboardSampleFadeOutEnd(shared),
    durationForComponent(root, "Ch2Page7S19Examples") - 1,
    "Ch2Page7S19Examples last storyboard image fades to zero on the final rendered frame",
  );
});
