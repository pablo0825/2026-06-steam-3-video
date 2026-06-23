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

test("S17 蓋半透明黑遮罩並置中顯示六欄位 Spec 表格", async () => {
  const overlay = await read("Ch3Page7CelesteSpecOverlay.tsx");
  // 半透明黑遮罩
  assert.match(overlay, /const VEIL_IN = \[248, 276\]/);
  assert.match(overlay, /const VEIL_OUT = \[756, 780\]/);
  assert.match(overlay, /backgroundColor: BLACK/);
  // 標題
  assert.match(overlay, /跳躍功能 <span/);
  // 六個欄位名
  for (const field of [
    "User Story",
    "Input / Output",
    "Rules",
    "Non-goals",
    "Acceptance Criteria",
    "Notes",
  ]) {
    assert.ok(overlay.includes(field), `缺少欄位 ${field}`);
  }
  // 內容抽樣
  assert.match(overlay, /身為玩家，我想要控制角色跳上平台、越過障礙。/);
  assert.match(overlay, /滯空時不可連續跳躍/);
  // Acceptance Criteria 三項用核取方塊
  assert.match(overlay, /☑/);
  assert.match(overlay, /落地後可再次跳躍/);
  // 六列逐列 stagger
  assert.match(overlay, /const ROW_START = \[320, 372, 424, 476, 528, 580\]/);
});
