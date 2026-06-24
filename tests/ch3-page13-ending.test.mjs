import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sceneDir = new URL("../src/scenes/03-程式實作/", import.meta.url);
const readScene = (name) => readFile(new URL(name, sceneDir), "utf8");
const readRoot = () => readFile(new URL("../src/Root.tsx", import.meta.url), "utf8");

test("S24 ending scene keeps the shared ending layout and host photo", async () => {
  const page = await readScene("Ch3Page13Ending.tsx");
  assert.match(page, /export const Ch3Page13Ending: React\.FC/);
  assert.match(page, /staticFile\("01-實驗介紹\/host-yujia\.jpg"\)/);
  assert.match(page, /感謝各位聆聽！/);
  assert.match(page, /祝大家開發順利/);
  assert.match(page, /製作團隊/);
  assert.match(page, /素材來源/);
});

test("S24 ending credits only keep Rhythm Doctor and Celeste game references", async () => {
  const page = await readScene("Ch3Page13Ending.tsx");
  assert.match(page, /label: "遊戲畫面"/);
  assert.match(page, /title: "Rhythm Doctor"/);
  assert.match(page, /creator: "7th Beat Games"/);
  assert.match(page, /title: "Celeste"/);
  assert.match(page, /creator: "Extremely OK Games"/);

  assert.doesNotMatch(page, /label: "圖片素材"/);
  assert.doesNotMatch(page, /Global Game Jam/);
  assert.doesNotMatch(page, /Storyboard/);
  assert.doesNotMatch(page, /STEM Games/);
  assert.doesNotMatch(page, /NextGen Blog/);
});

test("Root registers Ch3-Page13-Ending", async () => {
  const root = await readRoot();
  assert.match(root, /import \{ Ch3Page13Ending \}/);
  assert.match(root, /id="Ch3-Page13-Ending"/);
  assert.match(root, /component=\{Ch3Page13Ending\}/);
  assert.match(
    root,
    /component=\{Ch3Page13Ending\}[\s\S]*?durationInFrames=\{690\}/,
  );
});
