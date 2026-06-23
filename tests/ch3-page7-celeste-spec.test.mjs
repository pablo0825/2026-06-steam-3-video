import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dir = new URL("../src/scenes/03-程式實作/", import.meta.url);
const read = (name) => readFile(new URL(name, dir), "utf8");
const readRoot = () => readFile(new URL("../src/Root.tsx", import.meta.url), "utf8");

test("S16 overlay 顯示 Spec 案例 / Celeste / 跳躍功能 標題群組", async () => {
  const overlay = await read("Ch3Page7CelesteSpecOverlay.tsx");
  assert.match(overlay, /Spec 案例/);
  assert.match(overlay, />\s*Celeste\s*</);
  assert.match(overlay, /跳躍功能/);
  // S16 標題進出場沿用 S06 時間
  assert.match(overlay, /const TITLE_IN = \[10, 38\]/);
  assert.match(overlay, /const TITLE_OUT = \[196, 222\]/);
});

test("預覽容器 = GameplayPlaceholder + Overlay", async () => {
  const preview = await read("Ch3Page7CelesteSpec.tsx");
  assert.match(preview, /GameplayPlaceholder/);
  assert.match(preview, /Ch3Page7CelesteSpecOverlay/);
  assert.match(preview, /title="Celeste"/);
});

test("Root 註冊預覽與透明 Overlay 兩個 composition（780 frame）", async () => {
  const root = await readRoot();
  assert.match(root, /id="Ch3-Page7-CelesteSpec"/);
  assert.match(root, /id="Ch3-Page7-CelesteSpec-Overlay"/);
  assert.match(root, /component=\{Ch3Page7CelesteSpec\}/);
  assert.match(root, /component=\{Ch3Page7CelesteSpecOverlay\}/);
  // 透明 overlay 必須掛 alpha metadata
  assert.match(
    root,
    /component=\{Ch3Page7CelesteSpecOverlay\}[\s\S]*?calculateMetadata=\{calculateAlphaOverlayMetadata\}/,
  );
  assert.match(root, /component=\{Ch3Page7CelesteSpec\}[\s\S]*?durationInFrames=\{780\}/);
});
