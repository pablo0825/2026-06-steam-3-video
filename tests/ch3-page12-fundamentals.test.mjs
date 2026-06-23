import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dir = new URL("../src/scenes/03-程式實作/", import.meta.url);
const read = (name) => readFile(new URL(name, dir), "utf8");
const readRoot = () => readFile(new URL("../src/Root.tsx", import.meta.url), "utf8");

test("S23 標題與兩段重點", async () => {
  const page = await read("Ch3Page12Fundamentals.tsx");
  assert.match(page, /提醒：/);
  assert.match(page, /基本功/);
  assert.match(page, /很重要/);
  // 兩段重點關鍵字
  assert.match(page, /不代表程式語法或 Unity 操作不重要/);
  assert.match(page, /更快找到問題/);
  assert.match(page, /並清楚描述給 AI/);
  // 白底
  assert.match(page, /backgroundColor: WHITE/);
});

test("Root 註冊 Ch3-Page12-Fundamentals（315 frame）", async () => {
  const root = await readRoot();
  assert.match(root, /id="Ch3-Page12-Fundamentals"/);
  assert.match(
    root,
    /component=\{Ch3Page12Fundamentals\}[\s\S]*?durationInFrames=\{315\}/,
  );
});
