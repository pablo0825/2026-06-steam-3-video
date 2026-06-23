# 第 3 集・第 12 頁（基本功提醒 S23）Implementation Plan

> **狀態：未完成** — 程式已實作並合併至 `main`，但本頁保留進一步視覺微調空間，計畫尚未標記完成。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 製作第 3 集第 12 頁 S23「提醒：基本功很重要」——白底文字卡＋SVG 動畫，約 10.5 秒。

**Architecture:** 單一檔案 `Ch3Page12Fundamentals.tsx`（白底全螢幕，無透明 Overlay／影片），在 `src/Root.tsx` 註冊一個 composition。內容由上而下四區塊：標題 → 兩段重點依序升起 → 程式碼／Unity 圖示匯入放大鏡並高亮 → 結論「基本功 × AI 協作」。沿用本集白底頁的 `spring`／`interpolate` 進場慣例。

**Tech Stack:** Remotion 4.0.477、React 19、TypeScript。動態用 `interpolate` / `spring` / `Easing.bezier`。測試用 Node 內建 `node:test`，以讀取 `.tsx` 原始碼字串斷言結構（沿用 `tests/ch3-page6-spec.test.mjs` 模式）。

## Global Constraints

- 畫面 `width=1920 height=1080`、`fps=30`；composition `durationInFrames={315}`。
- 字型常數：`'"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif'`。
- 顏色一律從 `../../theme/colors` import，禁止寫死十六進位（用 `withAlpha(hex, a)` 疊透明度）。可用：`BLUE SUBTLE TEXT_DARK WHITE YELLOW withAlpha`。
- 緩動：`Easing.bezier(0.4, 0, 0.2, 1)`；進場用 `spring`。
- 圖示單色線稿：`fill="none"`、`stroke="currentColor"`、`strokeWidth="3"`、圓角；預設灰（SUBTLE），強調轉 YELLOW。
- Unity 圖示用簡化立方體線稿＋小字「Unity」，不複製官方 logo。
- 文案逐字採用 spec：標題「提醒：基本功很重要」、重點①②、結論「基本功 × AI 協作」。
- lint：`npm run lint`（= `eslint src && tsc`）必須通過（注意無 unused import）。
- 檔案路徑含中文資料夾 `src/scenes/03-程式實作/`。
- 提交訊息結尾加：`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 檔案結構

```
src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx   // S23 全部內容（Task 1 建立，Task 2 補結尾段）
src/Root.tsx                                        // 註冊 Ch3-Page12-Fundamentals（Task 1）
tests/ch3-page12-fundamentals.test.mjs             // 各 Task 累加斷言
```

### 時間軸（30fps，共 315 frame）

| 區塊 | frame | 內容 |
|---|---|---|
| 標題 | 0–30 | 「提醒：基本功很重要」spring 進場 |
| 重點① | 40–80 | 由下升起 |
| 重點② | 95–135 | 由下升起 |
| 圖示進場 | 150–180 | 程式碼（左）／Unity（右）淡入 |
| 匯入 | 185–235 | 兩圖示滑向中央並淡出 |
| 放大鏡 | 205–240 | 中央放大鏡淡入放大 |
| 放大鏡高亮 | 235–255 | 轉 YELLOW |
| 結論 | 260–295 | 「基本功 × AI 協作」淡入上移 |
| 出場 | 300–315 | 整頁淡出 |

---

## Task 1: 白底頁骨架 — 標題 ＋ 兩段重點 ＋ 註冊

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx`
- Modify: `src/Root.tsx`（import + 一個 `<Composition>`）
- Test: `tests/ch3-page12-fundamentals.test.mjs`

**Interfaces:**
- Produces: `export const Ch3Page12Fundamentals: React.FC`（無 props，白底，315 frame，含結尾淡出 `out`）。
- Consumes: `theme/colors`。

- [ ] **Step 1: 寫失敗測試**

建立 `tests/ch3-page12-fundamentals.test.mjs`：

```js
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
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page12-fundamentals.test.mjs`
Expected: FAIL（檔案不存在 / 未註冊）。

- [ ] **Step 3: 建立元件**

建立 `src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx`：

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
import { TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 3 集・第 12 頁 S23：提醒「基本功很重要」（白底文字卡＋SVG 動畫）
//   標題 → 兩段重點依序升起 → 程式碼／Unity 圖示匯入放大鏡（Task 2）→ 結論（Task 2）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const POINTS: { num: string; node: React.ReactNode }[] = [
  {
    num: "①",
    node: (
      <>
        AI 寫程式很快，
        <span style={{ color: YELLOW, fontWeight: 900 }}>
          不代表程式語法或 Unity 操作不重要
        </span>
      </>
    ),
  },
  {
    num: "②",
    node: (
      <>
        有基本功，才能
        <span style={{ color: YELLOW, fontWeight: 900 }}>更快找到問題</span>
        ，並清楚描述給 AI
      </>
    ),
  },
];

export const Ch3Page12Fundamentals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const out = interpolate(frame, [300, 315], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 110,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 64,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
          whiteSpace: "nowrap",
        }}
      >
        提醒：<span style={{ color: YELLOW }}>基本功</span>很重要
      </div>

      {/* 兩段重點 */}
      {POINTS.map((p, i) => {
        const rise = spring({
          frame: frame - (40 + i * 55),
          fps,
          config: { damping: 18, stiffness: 120, overshootClamping: true },
        });
        return (
          <div
            key={p.num}
            style={{
              position: "absolute",
              left: 320,
              top: 280 + i * 120,
              width: 1280,
              opacity: rise,
              transform: `translateY(${interpolate(rise, [0, 1], [24, 0])}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.4,
              color: TEXT_DARK,
            }}
          >
            <span style={{ color: YELLOW, fontWeight: 900, flexShrink: 0 }}>
              {p.num}
            </span>
            <div>{p.node}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 在 Root 註冊**

在 `src/Root.tsx` 的 import 區（緊接 `Ch3Page7SpecPractice` import 之後）加入：

```tsx
import { Ch3Page12Fundamentals } from "./scenes/03-程式實作/Ch3Page12Fundamentals";
```

在 `Ch3-Page7-SpecPractice` 的 `<Composition>` 之後加入：

```tsx
      <Composition
        id="Ch3-Page12-Fundamentals"
        component={Ch3Page12Fundamentals}
        durationInFrames={315}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 5: 跑測試確認通過**

Run: `node --test tests/ch3-page12-fundamentals.test.mjs`
Expected: PASS（2 個 test）。

- [ ] **Step 6: lint**

Run: `npm run lint`
Expected: 無錯誤。

- [ ] **Step 7: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx" src/Root.tsx tests/ch3-page12-fundamentals.test.mjs
git commit -m "feat(ch3-p12): scaffold Fundamentals page with title and two points"
```

---

## Task 2: 結尾段 — 圖示匯入放大鏡 ＋ 結論

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx`
- Test: `tests/ch3-page12-fundamentals.test.mjs`（新增 test）

**Interfaces:**
- Consumes: 既有 `Ch3Page12Fundamentals`（Task 1）。
- Produces: 同一元件，frame 150 起顯示程式碼／Unity 圖示匯入放大鏡並高亮，frame 260 起顯示結論。

- [ ] **Step 1: 新增失敗測試**

在 `tests/ch3-page12-fundamentals.test.mjs` 末端追加：

```js
test("S23 結尾：程式碼／Unity 匯入放大鏡並高亮，結論基本功 × AI 協作", async () => {
  const page = await read("Ch3Page12Fundamentals.tsx");
  // 三個圖示的標籤
  assert.match(page, /程式語法/);
  assert.match(page, />Unity</);
  assert.match(page, /找到問題/);
  // 放大鏡（圓 + 握把）
  assert.match(page, /<circle/);
  // 匯入與高亮時間軸
  assert.match(page, /const merge =/);
  assert.match(page, /const magHi =/);
  // 結論
  assert.match(page, /基本功/);
  assert.match(page, />AI</);
  assert.match(page, /協作/);
  assert.match(page, /×/);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ch3-page12-fundamentals.test.mjs`
Expected: 新 test FAIL（缺圖示標籤、merge、結論等）。

- [ ] **Step 3: 補上結尾段**

(a) 更新 import，加入 `BLUE`、`SUBTLE`：

```tsx
import { BLUE, SUBTLE, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";
```

(b) 在元件內 `const out = ...` 之後，加入結尾段的動態值：

```tsx
  // ── 結尾：圖示匯入放大鏡 ＋ 結論 ──
  const iconsIn = interpolate(frame, [150, 180], [0, 1], ease);
  const merge = interpolate(frame, [185, 235], [0, 1], ease);
  const magIn = interpolate(frame, [205, 240], [0, 1], ease);
  const magHi = interpolate(frame, [235, 255], [0, 1], ease);
  const conclusionIn = interpolate(frame, [260, 295], [0, 1], ease);
```

(c) 在兩段重點的 `.map(...)` 區塊之後、元件 `return` 結尾的 `</AbsoluteFill>` 之前，加入結尾段 JSX：

```tsx
      {/* 程式碼圖示（左 → 中央匯入） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [760, 960]),
          top: 620,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * (1 - merge),
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="84" height="84" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M18 14 8 24 18 34 M30 14 40 24 30 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
          程式語法
        </div>
      </div>

      {/* Unity 圖示（右 → 中央匯入；簡化立方體） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [1160, 960]),
          top: 620,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * (1 - merge),
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="84" height="84" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 6 40 15 40 33 24 42 8 33 8 15 Z M24 24 24 6 M24 24 8 33 M24 24 40 33"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>Unity</div>
      </div>

      {/* 放大鏡（中央，匯入後高亮） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 620,
          transform: `translate(-50%, -50%) scale(${interpolate(magIn, [0, 1], [0.7, 1])})`,
          opacity: magIn,
          color: magHi > 0.3 ? YELLOW : SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="108" height="108" viewBox="0 0 48 48" aria-hidden="true">
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M29 29 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>找到問題</div>
      </div>

      {/* 結論 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 850,
          transform: `translateX(-50%) translateY(${interpolate(conclusionIn, [0, 1], [16, 0])}px)`,
          opacity: conclusionIn,
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: YELLOW }}>基本功</span>
        <span style={{ color: TEXT_DARK, margin: "0 16px" }}>×</span>
        <span style={{ color: BLUE }}>AI</span>
        <span style={{ color: TEXT_DARK }}> 協作</span>
      </div>
```

- [ ] **Step 4: 跑測試確認通過**

Run: `node --test tests/ch3-page12-fundamentals.test.mjs`
Expected: PASS（含新結尾 test）。

- [ ] **Step 5: lint**

Run: `npm run lint`
Expected: 無錯誤（`BLUE`、`SUBTLE` 皆已被使用）。

- [ ] **Step 6: Studio 目視驗證**

Run: `npm run dev`
打開 `Ch3-Page12-Fundamentals`：標題進場 → 兩段重點依序升起 → 程式碼／Unity 圖示滑向中央匯入放大鏡、放大鏡轉黃高亮 → 結論「基本功 × AI 協作」淡入 → 整頁淡出。

- [ ] **Step 7: Commit**

```bash
git add "src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx" tests/ch3-page12-fundamentals.test.mjs
git commit -m "feat(ch3-p12): add icon-merge magnifier and conclusion"
```

---

## 收尾

- [ ] 更新分鏡進度表：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` 第 29 行（Page 12）狀態由「⏳ 待製作」改為「✅ 已完成」。
- [ ] Commit：`docs(ch3): mark page 12 (S23) complete in storyboard progress table`

## 驗證對照（self-review）

- 標題「提醒：基本功很重要」→ Task 1 ✅
- 兩段重點依序升起 → Task 1 ✅
- 程式碼／Unity 圖示匯入放大鏡並高亮 → Task 2 ✅
- 結論「基本功 × AI 協作」→ Task 2 ✅
- 白底、315 frame、註冊 composition → Task 1 ✅
