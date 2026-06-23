# 第 3 集・第 7 頁（Celeste Spec S16–S18）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 製作第 3 集第 7 頁的 S16（Celeste 標題 Overlay）、S17（半透明黑底＋置中 Spec 表格 Overlay）、S18（白底「一功能一 Spec」＋實作流程圖）。

**Architecture:** 沿用第 3 頁的「透明 Overlay／預覽」雙 composition 慣例：S16–S17 做成一個透明 Overlay（`Ch3Page7CelesteSpecOverlay`，輸出 ProRes 4444 給剪輯軟體疊在 Celeste 影片上）＋一個 Studio 預覽容器（`Ch3Page7CelesteSpec` = `GameplayPlaceholder` + Overlay）。S18 是白底全螢幕動畫，做成獨立 composition（`Ch3Page7SpecPractice`），內部用 `Sequence` 串兩個子場景（`Ch3Page7SpecPerFeature`、`Ch3Page7SpecWorkflow`）。

**Tech Stack:** Remotion 4.0.477、React 19、TypeScript。動態用 `interpolate` / `spring` / `Easing.bezier`。測試用 Node 內建 `node:test`，以讀取 `.tsx` 原始碼字串斷言結構（沿用 `tests/ch3-page6-spec.test.mjs` 模式）。

## Global Constraints

- 畫面尺寸 `width=1920 height=1080`，`fps=30`，逐 frame 對齊。
- 字型常數：`'"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif'`。
- 顏色一律從 `../../theme/colors` import，禁止寫死十六進位（`withAlpha(hex, a)` 疊透明度）。可用：`BLACK WHITE YELLOW BLUE TEXT_DARK SUBTLE NEUTRAL_300 CARD_BORDER GREEN withAlpha`。
- 緩動：`Easing.bezier(0.4, 0, 0.2, 1)`；節點/卡片進場 `spring`。
- 透明 Overlay 的 composition 必須掛 `calculateMetadata={calculateAlphaOverlayMetadata}`（已存在於 `src/Root.tsx`），背景不可有白底。
- 不在 Remotion 內重現實際 Celeste 影片；Studio 預覽用 `GameplayPlaceholder` 佔位。
- 不用紅色製造過度負面；反例警示用灰／黃。
- lint：`npm run lint`（= `eslint src && tsc`）必須通過。
- 檔案路徑一律含中文資料夾 `src/scenes/03-程式實作/`。
- 提交訊息結尾加：`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 檔案結構

```
src/scenes/03-程式實作/
  Ch3Page7CelesteSpec.tsx          // 預覽容器 = GameplayPlaceholder + Overlay（Task 1）
  Ch3Page7CelesteSpecOverlay.tsx   // 透明 Overlay：S16 標題（Task 1）+ S17 遮罩/表格（Task 2）
  Ch3Page7SpecPerFeature.tsx       // S18 前半「一個功能，一份 Spec」（Task 3）
  Ch3Page7SpecWorkflow.tsx         // S18 後半 實作流程圖（Task 4）
  Ch3Page7SpecPractice.tsx         // S18 白底容器（Task 5）
src/Root.tsx                       // 註冊三個 composition（Task 1、Task 5）
tests/ch3-page7-celeste-spec.test.mjs   // 各 Task 累加斷言
```

### Composition / 時間軸（30fps）

| Composition id | component | duration | 內容 |
|---|---|---:|---|
| `Ch3-Page7-CelesteSpec` | `Ch3Page7CelesteSpec` | 780 | 預覽（placeholder + overlay）|
| `Ch3-Page7-CelesteSpec-Overlay` | `Ch3Page7CelesteSpecOverlay` | 780 | 透明 Overlay（剪輯用）|
| `Ch3-Page7-SpecPractice` | `Ch3Page7SpecPractice` | 720 | S18 白底（PerFeature 0–330 + Workflow 330–720）|

Overlay 內部時間：S16 = frame 0–240；S17 = frame 240–780。

---

## Task 1: S16 標題 Overlay ＋ 預覽容器 ＋ 註冊

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page7CelesteSpecOverlay.tsx`
- Create: `src/scenes/03-程式實作/Ch3Page7CelesteSpec.tsx`
- Modify: `src/Root.tsx`（import + 兩個 `<Composition>`）
- Test: `tests/ch3-page7-celeste-spec.test.mjs`

**Interfaces:**
- Produces: `export const Ch3Page7CelesteSpecOverlay: React.FC`（無 props）；`export const Ch3Page7CelesteSpec: React.FC`（無 props）。
- Consumes: `GameplayPlaceholder`（`../02-遊戲設計/GameplayPlaceholder`，props `{ icon: string; title: string; subtitle: string }`）；`calculateAlphaOverlayMetadata`（`src/Root.tsx` 內既有）。

- [ ] **Step 1: 寫失敗測試**

建立 `tests/ch3-page7-celeste-spec.test.mjs`：

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dir = new URL("../src/scenes/03-程式實作/", import.meta.url);
const read = (name) => readFile(new URL(name, dir), "utf8");
const readRoot = () => readFile(new URL("../src/Root.tsx", import.meta.url), "utf8");

test("S16 overlay 顯示 Spec 案例 / Celeste / 跳躍功能 標題群組", async () => {
  const overlay = await read("Ch3Page7CelesteSpecOverlay.tsx");
  assert.match(overlay, /Spec 案例/);
  assert.match(overlay, />Celeste</);
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
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: FAIL（找不到檔案 / 斷言不符）。

- [ ] **Step 3: 建立 Overlay（S16 段）**

建立 `src/scenes/03-程式實作/Ch3Page7CelesteSpecOverlay.tsx`：

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BLACK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 3 集・第 7 頁 透明 Overlay（Celeste Spec）— 真實 gameplay 由剪輯軟體放下層
//   S16（0–240）：放射柔光 ＋ 置中標題群組（Spec 案例／Celeste／跳躍功能／黃線）
//   S17（240–780）：半透明黑遮罩 ＋ 置中「跳躍功能 Spec」表格（Task 2 補上）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: EASE };

// ── S16 標題 ──
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;

export const Ch3Page7CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // ── S16 ──
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* ── S16：標題 ── */}
      {frame < 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 1120,
              height: 620,
              borderRadius: "50%",
              opacity: glowOpacity,
              background: `radial-gradient(ellipse, ${withAlpha(BLACK, 0.7)} 0%, ${withAlpha(BLACK, 0.44)} 38%, ${withAlpha(BLACK, 0)} 72%)`,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${titleY}px)`,
              textShadow: `0 4px 24px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 8,
                color: YELLOW,
              }}
            >
              Spec 案例
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 104,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 12,
                color: WHITE,
              }}
            >
              Celeste
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: 6,
                color: withAlpha(WHITE, 0.78),
              }}
            >
              跳躍功能
            </div>
            <div
              style={{
                marginTop: 30,
                width: 112,
                height: 6,
                borderRadius: 999,
                backgroundColor: YELLOW,
                boxShadow: `0 0 22px ${withAlpha(YELLOW, 0.42)}`,
              }}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 建立預覽容器**

建立 `src/scenes/03-程式實作/Ch3Page7CelesteSpec.tsx`：

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { Ch3Page7CelesteSpecOverlay } from "./Ch3Page7CelesteSpecOverlay";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";

// Studio 預覽版：全螢幕暫代素材模擬 DaVinci 中的 Celeste gameplay，疊上透明 Overlay
export const Ch3Page7CelesteSpec: React.FC = () => {
  return (
    <AbsoluteFill>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page7CelesteSpecOverlay />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 5: 在 Root 註冊兩個 composition**

在 `src/Root.tsx` 的 import 區（緊接 `Ch3Page6Spec` import 之後）加入：

```tsx
import { Ch3Page7CelesteSpec } from "./scenes/03-程式實作/Ch3Page7CelesteSpec";
import { Ch3Page7CelesteSpecOverlay } from "./scenes/03-程式實作/Ch3Page7CelesteSpecOverlay";
```

在 `Ch3-Page6-Spec` 的 `<Composition>` 之後加入：

```tsx
      <Composition
        id="Ch3-Page7-CelesteSpec"
        component={Ch3Page7CelesteSpec}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page7-CelesteSpec-Overlay"
        component={Ch3Page7CelesteSpecOverlay}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
```

- [ ] **Step 6: 跑測試確認通過**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: PASS（3 個 test 全綠）。

- [ ] **Step 7: lint**

Run: `npm run lint`
Expected: 無錯誤。

- [ ] **Step 8: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page7CelesteSpec.tsx" "src/scenes/03-程式實作/Ch3Page7CelesteSpecOverlay.tsx" src/Root.tsx tests/ch3-page7-celeste-spec.test.mjs
git commit -m "feat(ch3-p7): add S16 Celeste Spec title overlay"
```

---

## Task 2: S17 半透明黑底 ＋ 置中 Spec 表格

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page7CelesteSpecOverlay.tsx`
- Test: `tests/ch3-page7-celeste-spec.test.mjs`（新增 test）

**Interfaces:**
- Consumes: 既有 `Ch3Page7CelesteSpecOverlay`（Task 1）。
- Produces: 同一元件，frame ≥ 240 時顯示遮罩與六列表格。

- [ ] **Step 1: 新增失敗測試**

在 `tests/ch3-page7-celeste-spec.test.mjs` 末端追加：

```js
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
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: 新 test FAIL（缺 VEIL/欄位/☑ 等）。

- [ ] **Step 3: 在 Overlay 補上 S17**

改寫 `Ch3Page7CelesteSpecOverlay.tsx`。

(a) 更新 import 與常數區，加入 `spring`、`useVideoConfig`、`NEUTRAL_300`、`TEXT_DARK`，並在 `TITLE_OUT` 之後加入 S17 常數與資料：

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  NEUTRAL_300,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
```

在 `const TITLE_OUT = [196, 222] as const;` 之後加入：

```tsx
// ── S17 半透明黑 ＋ Spec 表格 ──
const VEIL_IN = [248, 276] as const;
const VEIL_OUT = [756, 780] as const;
const HEADING_IN = [284, 314] as const;
const ROW_START = [320, 372, 424, 476, 528, 580] as const;

const AC_ITEMS = [
  "按下空白鍵會跳躍",
  "落地後可再次跳躍",
  "滯空時重複按鍵不會再次跳躍",
] as const;

type SpecRow = { field: string; content: React.ReactNode };
const SPEC_ROWS: SpecRow[] = [
  {
    field: "User Story",
    content: <>身為玩家，我想要控制角色跳上平台、越過障礙。</>,
  },
  {
    field: "Input / Output",
    content: <>按下空白鍵／角色向上跳躍，並受重力影響回到地面。</>,
  },
  {
    field: "Rules",
    content: <>角色接觸地面時才能跳躍；滯空時不可連續跳躍。</>,
  },
  {
    field: "Non-goals",
    content: <>不包含二段跳、攀牆與跳躍動畫。</>,
  },
  {
    field: "Acceptance Criteria",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AC_ITEMS.map((t) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={{ color: YELLOW, fontWeight: 900 }}>☑</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  { field: "Notes", content: <>無。</> },
];
```

(b) 在元件內取得 `fps` 並計算 S17 動態（接在 S16 的 `glowOpacity` 之後）：

```tsx
export const Ch3Page7CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S16 ──（不變）
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  // ── S17 ──
  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, HEADING_IN, [0, 1], ease);
```

(c) 在 S16 標題 `AbsoluteFill` 區塊（`{frame < 240 && (...)}`）之後、元件 `return` 的結尾 `</AbsoluteFill>` 之前，加入 S17 區塊：

```tsx
      {/* ── S17：半透明黑 ── */}
      {frame >= 240 && (
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />
      )}

      {/* ── S17：標題 + Spec 表格 ── */}
      {frame >= 240 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 150,
            transform: "translateX(-50%)",
            width: 1240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              opacity: headingIn * infoOut,
              transform: `translateY(${interpolate(headingIn, [0, 1], [16, 0])}px)`,
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: 4,
              color: WHITE,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            跳躍功能 <span style={{ color: YELLOW }}>Spec</span>
          </div>

          <div
            style={{
              marginTop: 44,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {SPEC_ROWS.map((row, index) => {
              const progress = spring({
                frame: frame - ROW_START[index],
                fps,
                config: { damping: 18, stiffness: 120, overshootClamping: true },
              });
              return (
                <div
                  key={row.field}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 26,
                    transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
                    opacity: progress * infoOut,
                    textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
                  }}
                >
                  <div
                    style={{
                      width: 300,
                      flexShrink: 0,
                      textAlign: "center",
                      padding: "12px 0",
                      borderRadius: 14,
                      fontSize: 26,
                      fontWeight: 800,
                      letterSpacing: 1,
                      color: TEXT_DARK,
                      backgroundColor: NEUTRAL_300,
                      boxShadow: `0 10px 24px ${withAlpha(BLACK, 0.2)}`,
                      textShadow: "none",
                    }}
                  >
                    {row.field}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      paddingTop: 6,
                      textAlign: "left",
                      fontSize: 32,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: WHITE,
                    }}
                  >
                    {row.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: PASS（含新 S17 test）。

- [ ] **Step 5: lint**

Run: `npm run lint`
Expected: 無錯誤（注意 `spring`、`useVideoConfig`、`NEUTRAL_300`、`TEXT_DARK` 都已被使用，無 unused import）。

- [ ] **Step 6: Studio 目視驗證**

Run: `npm run dev`
打開 `Ch3-Page7-CelesteSpec` 預覽：frame 0–240 標題進出場；frame 240+ 出現半透明黑底、置中標題與六列逐列填入，Acceptance Criteria 顯示三個 ☑。打開 `Ch3-Page7-CelesteSpec-Overlay` 確認背景透明（棋盤格，無白底）。

- [ ] **Step 7: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page7CelesteSpecOverlay.tsx" tests/ch3-page7-celeste-spec.test.mjs
git commit -m "feat(ch3-p7): add S17 veil and centered Spec table overlay"
```

---

## Task 3: S18 前半「一個功能，一份 Spec」

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page7SpecPerFeature.tsx`
- Test: `tests/ch3-page7-celeste-spec.test.mjs`（新增 test）

**Interfaces:**
- Produces: `export const Ch3Page7SpecPerFeature: React.FC`（無 props，白底，0–330 frame 自帶結尾淡出）。
- Consumes: `theme/colors`。

設計：白底。左側三個功能膠囊（跳躍／衝刺／攀牆）各自連到右側三份獨立小文件（jump-spec.md / dash-spec.md / climb-spec.md），逐對繪線＝正例。右側另置反例區：三個功能用糾結交叉線連到單一文件（all-spec.md），於 frame 220 起左右震動並淡出。底部結論「一個功能 → 一份 Spec」。frame 310–330 整頁淡出。

- [ ] **Step 1: 新增失敗測試**

在測試檔末端追加：

```js
test("S18 前半呈現一功能一 Spec 的正例與糾結反例", async () => {
  const perFeature = await read("Ch3Page7SpecPerFeature.tsx");
  assert.match(perFeature, /一個功能，一份 Spec/);
  // 三個功能
  for (const f of ["跳躍", "衝刺", "攀牆"]) {
    assert.ok(perFeature.includes(f), `缺少功能 ${f}`);
  }
  // 三份獨立文件 + 反例單一文件
  assert.match(perFeature, /jump-spec\.md/);
  assert.match(perFeature, /dash-spec\.md/);
  assert.match(perFeature, /climb-spec\.md/);
  assert.match(perFeature, /all-spec\.md/);
  // 反例震動
  assert.match(perFeature, /const shake =/);
  // 結論
  assert.match(perFeature, /一個功能 → 一份 Spec/);
  // 白底
  assert.match(perFeature, /backgroundColor: WHITE/);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: 新 test FAIL（檔案不存在）。

- [ ] **Step 3: 建立 PerFeature**

建立 `src/scenes/03-程式實作/Ch3Page7SpecPerFeature.tsx`：

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const FEATURES = ["跳躍", "衝刺", "攀牆"] as const;
const DOC_NAMES = ["jump-spec.md", "dash-spec.md", "climb-spec.md"] as const;
const ROW_Y = [330, 470, 610] as const;

// 小文件卡：藍色標題列 + 檔名 + 兩條內容列
const MiniDoc: React.FC<{ name: string; tone: string }> = ({ name, tone }) => (
  <div
    style={{
      width: 300,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: WHITE,
      border: `3px solid ${CARD_BORDER}`,
      boxShadow: `0 14px 30px ${withAlpha(TEXT_DARK, 0.1)}`,
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        color: WHITE,
        backgroundColor: tone,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 0.5,
      }}
    >
      {name}
    </div>
    <div style={{ padding: "16px 18px", display: "grid", gap: 10 }}>
      <div
        style={{
          height: 10,
          width: "78%",
          borderRadius: 999,
          backgroundColor: withAlpha(tone, 0.3),
        }}
      />
      <div
        style={{
          height: 9,
          width: "60%",
          borderRadius: 999,
          backgroundColor: withAlpha(SUBTLE, 0.24),
        }}
      />
    </div>
  </div>
);

const Pill: React.FC<{ label: string; tone: string }> = ({ label, tone }) => (
  <div
    style={{
      width: 180,
      height: 96,
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 34,
      fontWeight: 900,
      letterSpacing: 2,
      color: WHITE,
      backgroundColor: tone,
      boxShadow: `0 14px 30px ${withAlpha(tone, 0.28)}`,
    }}
  >
    {label}
  </div>
);

export const Ch3Page7SpecPerFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const goodLines = interpolate(frame, [70, 120], [0, 1], ease);
  const badIn = interpolate(frame, [140, 175], [0, 1], ease);
  const badFade = interpolate(frame, [250, 280], [1, 0], clamp);
  const shakeWindow = interpolate(frame, [210, 250], [1, 0], clamp);
  const shake = Math.sin(frame * 1.6) * 10 * shakeWindow * badIn;
  const conclusionIn = interpolate(frame, [285, 320], [0, 1], ease);
  const out = interpolate(frame, [310, 330], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 96,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 64,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
        }}
      >
        一個功能，一份 Spec
      </div>

      {/* 連線（正例：左功能 → 右文件，逐對；反例：三功能 → 單文件，糾結） */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {ROW_Y.map((y) => (
          <path
            key={`good-${y}`}
            d={`M360 ${y + 48} L520 ${y + 48}`}
            fill="none"
            stroke={GREEN}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - goodLines}
          />
        ))}
        {/* 反例：三條交叉線匯入單一文件 */}
        <g opacity={badIn * badFade} transform={`translate(${shake} 0)`}>
          {ROW_Y.map((y) => (
            <path
              key={`bad-${y}`}
              d={`M1400 ${y + 48} C1500 ${y + 48} 1500 470 1560 470`}
              fill="none"
              stroke={withAlpha(YELLOW, 0.85)}
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>

      {/* 正例：左功能膠囊 */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (20 + i * 14),
          fps,
          config: { damping: 17, stiffness: 120 },
        });
        return (
          <div
            key={`f-${label}`}
            style={{
              position: "absolute",
              left: 180,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
            }}
          >
            <Pill label={label} tone={BLUE} />
          </div>
        );
      })}

      {/* 正例：右獨立文件 */}
      {DOC_NAMES.map((name, i) => {
        const p = spring({
          frame: frame - (60 + i * 14),
          fps,
          config: { damping: 18, stiffness: 120 },
        });
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 520,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [26, 0])}px)`,
            }}
          >
            <MiniDoc name={name} tone={BLUE} />
          </div>
        );
      })}

      {/* 反例：三功能膠囊（小）+ 單一文件 */}
      <div
        style={{
          position: "absolute",
          left: 1240,
          top: 280,
          opacity: badIn * badFade,
          transform: `translateX(${shake}px)`,
          fontSize: 26,
          fontWeight: 800,
          color: SUBTLE,
        }}
      >
        ✗ 混在一份
      </div>
      {FEATURES.map((label, i) => (
        <div
          key={`bf-${label}`}
          style={{
            position: "absolute",
            left: 1240,
            top: ROW_Y[i],
            width: 150,
            height: 96,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: SUBTLE,
            backgroundColor: withAlpha(SUBTLE, 0.14),
            border: `2px solid ${withAlpha(SUBTLE, 0.4)}`,
            opacity: badIn * badFade,
            transform: `translateX(${shake}px)`,
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 1560,
          top: 422,
          opacity: badIn * badFade,
          transform: `translateX(${shake}px)`,
        }}
      >
        <MiniDoc name="all-spec.md" tone={withAlpha(SUBTLE, 0.85)} />
      </div>

      {/* 結論 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 860,
          transform: `translateX(-50%) translateY(${interpolate(conclusionIn, [0, 1], [16, 0])}px)`,
          opacity: conclusionIn,
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: 2,
          color: GREEN,
        }}
      >
        一個功能 → 一份 Spec
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: PASS。

- [ ] **Step 5: lint**

Run: `npm run lint`
Expected: 無錯誤。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page7SpecPerFeature.tsx" tests/ch3-page7-celeste-spec.test.mjs
git commit -m "feat(ch3-p7): add S18 one-feature-one-spec animation"
```

---

## Task 4: S18 後半 實作流程圖

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page7SpecWorkflow.tsx`
- Test: `tests/ch3-page7-celeste-spec.test.mjs`（新增 test）

**Interfaces:**
- Produces: `export const Ch3Page7SpecWorkflow: React.FC`（無 props，白底，0–390 frame 自帶結尾淡出）。
- Consumes: `theme/colors`。

設計：白底。五節點橫向排列 `User Story → Spec → Plan → AI／使用者實作 → 手動驗證`，節點逐一彈入、節點間箭頭逐段繪製；「手動驗證」黃色高亮；自「手動驗證」底部繪一條黃色回饋曲線回「Spec」（標「驗證失敗」）；最後「開始實作」淡入。沿用 `Ch3Page5AgentsFlow` 的 `strokeDashoffset` 繪線與三角箭頭手法。

- [ ] **Step 1: 新增失敗測試**

在測試檔末端追加：

```js
test("S18 後半流程圖含五節點、回饋箭頭與開始實作轉場", async () => {
  const wf = await read("Ch3Page7SpecWorkflow.tsx");
  for (const node of [
    "User Story",
    "Spec",
    "Plan",
    "AI／使用者實作",
    "手動驗證",
  ]) {
    assert.ok(wf.includes(node), `缺少節點 ${node}`);
  }
  // 逐段繪線
  assert.match(wf, /strokeDashoffset/);
  // 驗證失敗回饋
  assert.match(wf, /驗證失敗/);
  // 收尾轉場
  assert.match(wf, /開始實作/);
  // 白底
  assert.match(wf, /backgroundColor: WHITE/);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: 新 test FAIL（檔案不存在）。

- [ ] **Step 3: 建立 Workflow**

建立 `src/scenes/03-程式實作/Ch3Page7SpecWorkflow.tsx`：

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const NODE_W = 280;
const NODE_H = 120;
const NODE_CY = 470;
// 五節點中心 x
const NODE_CX = [230, 590, 950, 1310, 1670] as const;
const NODES = [
  "User Story",
  "Spec",
  "Plan",
  "AI／使用者實作",
  "手動驗證",
] as const;

export const Ch3Page7SpecWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  // 節點間四段連線（i = 0..3）
  const segDraw = (i: number) =>
    interpolate(frame, [80 + i * 30, 110 + i * 30], [0, 1], ease);
  const segArrow = (i: number) =>
    interpolate(frame, [104 + i * 30, 116 + i * 30], [0, 1], clamp);
  // 手動驗證高亮
  const verifyHi = interpolate(frame, [210, 230], [0, 1], ease);
  // 回饋曲線 + 標籤
  const fbDraw = interpolate(frame, [240, 300], [0, 1], ease);
  const fbArrow = interpolate(frame, [292, 304], [0, 1], clamp);
  const fbLabel = interpolate(frame, [280, 300], [0, 1], ease);
  // 開始實作
  const startIn = interpolate(frame, [320, 350], [0, 1], ease);
  const out = interpolate(frame, [368, 388], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 60,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 2,
        }}
      >
        Spec 實作流程
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* 節點間連線 + 箭頭 */}
        {[0, 1, 2, 3].map((i) => {
          const x1 = NODE_CX[i] + NODE_W / 2;
          const x2 = NODE_CX[i + 1] - NODE_W / 2;
          return (
            <g key={`seg-${i}`}>
              <path
                d={`M${x1} ${NODE_CY} L${x2} ${NODE_CY}`}
                fill="none"
                stroke={BLUE}
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - segDraw(i)}
              />
              <g opacity={segArrow(i)} transform={`translate(${x2} ${NODE_CY})`}>
                <path d="M0 0 L-30 -16 L-30 16 Z" fill={BLUE} />
              </g>
            </g>
          );
        })}

        {/* 回饋曲線：手動驗證底 → Spec 底（驗證失敗） */}
        <path
          d={`M${NODE_CX[4]} ${NODE_CY + NODE_H / 2} C${NODE_CX[4]} 760 ${NODE_CX[1]} 760 ${NODE_CX[1]} ${NODE_CY + NODE_H / 2}`}
          fill="none"
          stroke={YELLOW}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="14 12"
          pathLength="1"
          strokeDashoffset={1 - fbDraw}
        />
        <g
          opacity={fbArrow}
          transform={`translate(${NODE_CX[1]} ${NODE_CY + NODE_H / 2}) rotate(-90)`}
        >
          <path d="M0 0 L-30 -16 L-30 16 Z" fill={YELLOW} />
        </g>
      </svg>

      {/* 回饋標籤 */}
      <div
        style={{
          position: "absolute",
          left: (NODE_CX[1] + NODE_CX[4]) / 2,
          top: 730,
          transform: "translate(-50%, -50%)",
          opacity: fbLabel,
          padding: "8px 20px",
          borderRadius: 999,
          fontSize: 28,
          fontWeight: 800,
          color: TEXT_DARK,
          backgroundColor: withAlpha(YELLOW, 0.16),
          border: `2px solid ${withAlpha(YELLOW, 0.7)}`,
        }}
      >
        驗證失敗 → 回 Spec
      </div>

      {/* 五節點 */}
      {NODES.map((label, i) => {
        const p = spring({
          frame: frame - (20 + i * 28),
          fps,
          config: { damping: 17, stiffness: 115, overshootClamping: true },
        });
        const isVerify = i === 4;
        const hi = isVerify ? verifyHi : 0;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: NODE_CX[i],
              top: NODE_CY,
              width: NODE_W,
              height: NODE_H,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
              opacity: p,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: i === 3 ? 26 : 32,
              fontWeight: 900,
              color: hi > 0.15 ? YELLOW : TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${hi > 0.15 ? YELLOW : CARD_BORDER}`,
              boxShadow: `0 16px 38px ${withAlpha(hi > 0.15 ? YELLOW : TEXT_DARK, hi > 0.15 ? 0.16 : 0.08)}`,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* 開始實作 轉場 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 900,
          transform: `translateX(-50%) translateY(${interpolate(startIn, [0, 1], [16, 0])}px)`,
          opacity: startIn,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: 4,
          color: BLUE,
        }}
      >
        開始實作 →
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: PASS。

- [ ] **Step 5: lint**

Run: `npm run lint`
Expected: 無錯誤。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page7SpecWorkflow.tsx" tests/ch3-page7-celeste-spec.test.mjs
git commit -m "feat(ch3-p7): add S18 Spec implementation workflow diagram"
```

---

## Task 5: S18 白底容器 ＋ 註冊

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page7SpecPractice.tsx`
- Modify: `src/Root.tsx`（import + 一個 `<Composition>`）
- Test: `tests/ch3-page7-celeste-spec.test.mjs`（新增 test）

**Interfaces:**
- Consumes: `Ch3Page7SpecPerFeature`（Task 3）、`Ch3Page7SpecWorkflow`（Task 4）。
- Produces: `export const Ch3Page7SpecPractice: React.FC`（白底，720 frame）。

- [ ] **Step 1: 新增失敗測試**

在測試檔末端追加：

```js
test("S18 容器以 Sequence 串接 PerFeature(330) 與 Workflow(390)", async () => {
  const practice = await read("Ch3Page7SpecPractice.tsx");
  assert.match(practice, /Ch3Page7SpecPerFeature/);
  assert.match(practice, /Ch3Page7SpecWorkflow/);
  assert.match(practice, /durationInFrames=\{330\}/);
  assert.match(practice, /from=\{330\}\s+durationInFrames=\{390\}/);
  assert.match(practice, /<AbsoluteFill style=\{\{ backgroundColor: WHITE \}\}>/);
});

test("Root 註冊 Ch3-Page7-SpecPractice（720 frame）", async () => {
  const root = await readRoot();
  assert.match(root, /id="Ch3-Page7-SpecPractice"/);
  assert.match(root, /component=\{Ch3Page7SpecPractice\}[\s\S]*?durationInFrames=\{720\}/);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: 兩個新 test FAIL。

- [ ] **Step 3: 建立 SpecPractice 容器**

建立 `src/scenes/03-程式實作/Ch3Page7SpecPractice.tsx`：

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WHITE } from "../../theme/colors";
import { Ch3Page7SpecPerFeature } from "./Ch3Page7SpecPerFeature";
import { Ch3Page7SpecWorkflow } from "./Ch3Page7SpecWorkflow";

// 第 3 集・第 7 頁 S18：白底全螢幕
//   前半（0–330）一個功能，一份 Spec；後半（330–720）Spec 實作流程圖
export const Ch3Page7SpecPractice: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: WHITE }}>
      <Sequence durationInFrames={330}>
        <Ch3Page7SpecPerFeature />
      </Sequence>
      <Sequence from={330} durationInFrames={390}>
        <Ch3Page7SpecWorkflow />
      </Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 在 Root 註冊**

在 `src/Root.tsx` 的 import 區（緊接 Task 1 加的兩行 overlay import 之後）加入：

```tsx
import { Ch3Page7SpecPractice } from "./scenes/03-程式實作/Ch3Page7SpecPractice";
```

在 `Ch3-Page7-CelesteSpec-Overlay` 的 `<Composition>` 之後加入：

```tsx
      <Composition
        id="Ch3-Page7-SpecPractice"
        component={Ch3Page7SpecPractice}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 5: 跑全部測試確認通過**

Run: `node --test tests/ch3-page7-celeste-spec.test.mjs`
Expected: PASS（全部 test 綠）。

- [ ] **Step 6: lint**

Run: `npm run lint`
Expected: 無錯誤。

- [ ] **Step 7: Studio 目視驗證**

Run: `npm run dev`
打開 `Ch3-Page7-SpecPractice`：0–330 看正例三對連線、反例震動淡出、結論；330–720 看五節點依序彈入、連線逐段繪製、手動驗證黃色高亮、回饋曲線繪回 Spec、最後「開始實作 →」。

- [ ] **Step 8: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page7SpecPractice.tsx" src/Root.tsx tests/ch3-page7-celeste-spec.test.mjs
git commit -m "feat(ch3-p7): assemble S18 Spec practice composition"
```

---

## 收尾

- [ ] 更新分鏡進度表：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` 第 24 行（Page 7）狀態由「⏳ 待製作」改為「✅ 已完成」。
- [ ] Commit：`docs(ch3): mark page 7 (S16-S18) complete in storyboard progress table`

## 驗證對照（self-review）

- S16 標題 Overlay → Task 1 ✅
- S17 半透明黑底＋置中六欄位表格（含 Acceptance Criteria 三項 ☑、Notes）→ Task 2 ✅
- S18 前半「一個功能，一份 Spec」正例＋糾結反例震動淡出＋結論 → Task 3 ✅
- S18 後半流程圖（五節點、逐段繪線、手動驗證高亮、回饋箭頭回 Spec、開始實作轉場）→ Task 4 ✅
- 透明 Overlay 用 `calculateAlphaOverlayMetadata`、預覽用 `GameplayPlaceholder` → Task 1 ✅
- 三個 composition 註冊 → Task 1（兩個）＋ Task 5（一個）✅
```
