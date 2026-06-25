# Ch4 S18 Art Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `Ch4-Page8-S18-ArtWorkflow` (S18) scene — a 270-frame horizontal SVG flow diagram with 4 nodes and a yellow feedback loop back to the spec-sheet node.

**Architecture:** A single self-contained Remotion scene component (`Ch4Page8S18ArtWorkflow.tsx`) registered as a Composition in `Root.tsx`. It adapts the proven flow-diagram technique from `Ch3Page7SpecWorkflow` (spring node entrance, `strokeDashoffset` line draw, cubic-bezier feedback curve) into the Ch4 米白 palette. No shared component is extracted; Ch3 is not touched.

**Tech Stack:** React, Remotion (`AbsoluteFill`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), inline SVG, project theme tokens (`theme/colors`, `theme/motion`).

## Global Constraints

- Verification per task is `npx tsc --noEmit` + `npx eslint <file>` + visual check in `remotion studio`. There is NO unit-test framework for scenes — do not invent one.
- Composition: id `Ch4-Page8-S18-ArtWorkflow`, `durationInFrames={270}`, `fps={30}`, `width={1920}`, `height={1080}`.
- Background `NEUTRAL_50`; shared `FONT`, `clamp`, `easeStandard` imported from `src/theme/motion.ts`.
- Reply/commit copy in Traditional Chinese where Chinese is used; never Simplified.
- Do NOT modify `Ch3Page7SpecWorkflow.tsx` or any other existing scene.
- Node centers x = `[300, 740, 1180, 1620]`, center y `470`, node 300×120. Feedback: from node index 3 back to node index 1, label「修正規格」.

---

### Task 1: Scaffold scene (background, title, ending fade) + register Composition

**Files:**
- Create: `src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx`
- Modify: `src/Root.tsx` (add import near the other Ch4 imports; add `<Composition>` after the `Ch4-Page6-S15-Contrast` block)

**Interfaces:**
- Produces: `export const Ch4Page8S18ArtWorkflow: React.FC` — a Remotion scene component taking no props.

- [ ] **Step 1: Create the scene file with background, title, and ending fade**

Create `src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx`:

```tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 8 頁・S18：美術整合實作流程（270 幀）
//   四節點水平流程圖 + 黃色回饋迴圈（末節點 → 美術規格表），結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [242, 270] as const; // 結尾淡出到 NEUTRAL_50

export const Ch4Page8S18ArtWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT, opacity: out }}
    >
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
        美術整合實作流程
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add the import in `Root.tsx`**

Find the Ch4 import group (near `import { Ch4Page6S15Contrast } ...`) and add:

```tsx
import { Ch4Page8S18ArtWorkflow } from "./scenes/04-美術整合/Ch4Page8S18ArtWorkflow";
```

- [ ] **Step 3: Register the Composition in `Root.tsx`**

Immediately after the closing `/>` of the `id="Ch4-Page6-S15-Contrast"` Composition block, add:

```tsx
      <Composition
        id="Ch4-Page8-S18-ArtWorkflow"
        component={Ch4Page8S18ArtWorkflow}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx" "src/Root.tsx"`
Expected: exit 0, no output.

- [ ] **Step 5: Visual checkpoint**

Open `remotion studio`, select `Ch4-Page8-S18-ArtWorkflow`. Confirm: 米白背景、標題「美術整合實作流程」置中於上方並 spring 彈入；尾段（242–270 幀）整體淡出到米白。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx" src/Root.tsx
git commit -m "feat(ch4-s18): scaffold ArtWorkflow scene with title and ending fade"
```

---

### Task 2: Add the 4 flow nodes with staggered spring entrance

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, `out` from Task 1.
- Produces: module constants `NODE_W`, `NODE_H`, `NODE_CY`, `NODE_CX`, `NODES`, `nodeStart(i)` used by Tasks 3–4.

- [ ] **Step 1: Add node layout constants**

Below the `ENDING_FADE` line, add:

```tsx
const NODE_W = 300;
const NODE_H = 120;
const NODE_CY = 470;
const NODE_CX = [300, 740, 1180, 1620] as const; // 四節點中心 x（間距 440）
const NODES: readonly [string, string][] = [
  ["依 Storyboard", "列出物件"],
  ["撰寫", "美術規格表"],
  ["用 AI", "生假素材"],
  ["匯入 Unity", "測試"],
];

// 節點由左至右依序彈入：第 i 個於 nodeStart(i) 開始
const NODE_STRIDE = 30;
const nodeStart = (i: number) => 10 + i * NODE_STRIDE;
```

- [ ] **Step 2: Render the nodes inside the AbsoluteFill**

Inside the `<AbsoluteFill>`, after the title `<div>`, add:

```tsx
      {NODES.map(([line1, line2], i) => {
        const p = spring({
          frame: frame - nodeStart(i),
          fps,
          config: { damping: 17, stiffness: 115, overshootClamping: true },
        });
        return (
          <div
            key={line2}
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
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: 30,
              fontWeight: 900,
              lineHeight: 1.25,
              color: TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${CARD_BORDER}`,
              boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
            }}
          >
            <span>{line1}</span>
            <span>{line2}</span>
          </div>
        );
      })}
```

- [ ] **Step 3: Update the color/util imports**

Change the `theme/colors` import line to include the new tokens:

```tsx
import { CARD_BORDER, NEUTRAL_50, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"`
Expected: exit 0.

- [ ] **Step 5: Visual checkpoint**

In `remotion studio`, scrub 0–140 幀。確認：四個白底卡片節點由左至右依序彈入，兩行文字（如「依 Storyboard ／ 列出物件」）置中、不溢出 300px 卡片。若溢出，將 `fontSize` 調為 28。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"
git commit -m "feat(ch4-s18): add 4 flow nodes with staggered spring entrance"
```

---

### Task 3: Add the 3 connecting blue arrows (sequential draw)

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx`

**Interfaces:**
- Consumes: `frame`, `NODE_CX`, `NODE_W`, `NODE_CY`, `nodeStart(i)`.
- Produces: module constant `ARROW_LEN` used by Task 4.

- [ ] **Step 1: Add the arrow-length constant**

Below `nodeStart`, add:

```tsx
// 箭頭長度：連線只畫到箭頭底部，由三角形當尖端，避免線戳出箭頭
const ARROW_LEN = 30;
```

- [ ] **Step 2: Add segment draw/arrow timing helpers**

Inside the component, after the `titleIn` declaration, add:

```tsx
  // 節點間三段連線（i = 0..2）：節點出現後才畫，畫到端點時帶出下一節點
  const segDraw = (i: number) =>
    interpolate(frame, [nodeStart(i) + 18, nodeStart(i) + 40], [0, 1], ease);
  const segArrow = (i: number) =>
    interpolate(frame, [nodeStart(i) + 30, nodeStart(i) + 42], [0, 1], clamp);
```

- [ ] **Step 3: Add `easeStandard` to the motion import**

Change the `theme/motion` import to:

```tsx
import { FONT, clamp, easeStandard as ease } from "../../theme/motion";
```

- [ ] **Step 4: Render the SVG connecting lines**

Inside the `<AbsoluteFill>`, BEFORE the `{NODES.map(...)}` block (so nodes paint on top of lines), add:

```tsx
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[0, 1, 2].map((i) => {
          const x1 = NODE_CX[i] + NODE_W / 2;
          const x2 = NODE_CX[i + 1] - NODE_W / 2;
          return (
            <g key={`seg-${i}`}>
              <path
                d={`M${x1} ${NODE_CY} L${x2 - ARROW_LEN} ${NODE_CY}`}
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
      </svg>
```

- [ ] **Step 5: Add `BLUE` to the colors import**

Change the `theme/colors` import to:

```tsx
import { BLUE, CARD_BORDER, NEUTRAL_50, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
```

- [ ] **Step 6: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"`
Expected: exit 0.

- [ ] **Step 7: Visual checkpoint**

In `remotion studio`, scrub 0–140 幀。確認：每個節點出現後，藍色連線往右畫出、末端三角箭頭淡入，並大致與下一節點同時到位；三段連線位於節點卡片下層。

- [ ] **Step 8: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"
git commit -m "feat(ch4-s18): add sequential blue connecting arrows"
```

---

### Task 4: Add the yellow feedback loop, label pill, and spec-node highlight

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx`

**Interfaces:**
- Consumes: `frame`, `NODE_CX`, `NODE_CY`, `NODE_H`, `ARROW_LEN`, the node render block.

- [ ] **Step 1: Add feedback-loop geometry constants**

Below `ARROW_LEN`, add:

```tsx
// 回饋迴圈：末節點(索引3) → 美術規格表(索引1)
const FB_FROM = 3;
const FB_TO = 1;
const FB_Y = NODE_CY + NODE_H / 2 + 36; // 起點離節點底部留間距
const FB_DEPTH = 850; // 曲線最低點
const FB_LABEL_Y = 786; // 膠囊標籤 y
```

- [ ] **Step 2: Add feedback timing values**

Inside the component, after the `segArrow` helper, add:

```tsx
  // 回饋曲線 + 標籤 + 美術規格表高亮
  const fbDraw = interpolate(frame, [150, 200], [0, 1], ease);
  const fbArrow = interpolate(frame, [196, 208], [0, 1], clamp);
  const fbLabel = interpolate(frame, [180, 200], [0, 1], ease);
  const specHi = interpolate(frame, [196, 216], [0, 1], ease);
```

- [ ] **Step 3: Render the feedback curve + arrow inside the existing `<svg>`**

Inside the `<svg>`, after the `{[0, 1, 2].map(...)}` block, add:

```tsx
        <path
          d={`M${NODE_CX[FB_FROM]} ${FB_Y} C${NODE_CX[FB_FROM]} ${FB_DEPTH} ${NODE_CX[FB_TO]} ${FB_DEPTH} ${NODE_CX[FB_TO]} ${FB_Y + ARROW_LEN}`}
          fill="none"
          stroke={YELLOW}
          strokeWidth="6"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - fbDraw}
        />
        <g
          opacity={fbArrow}
          transform={`translate(${NODE_CX[FB_TO]} ${FB_Y}) rotate(-90)`}
        >
          <path d="M0 0 L-30 -16 L-30 16 Z" fill={YELLOW} />
        </g>
```

- [ ] **Step 4: Render the「修正規格」label pill**

After the closing `</svg>` tag (and before `{NODES.map(...)}`), add:

```tsx
      <div
        style={{
          position: "absolute",
          left: (NODE_CX[FB_TO] + NODE_CX[FB_FROM]) / 2,
          top: FB_LABEL_Y,
          transform: "translate(-50%, -50%)",
          opacity: fbLabel,
          padding: "8px 22px",
          borderRadius: 999,
          fontSize: 28,
          fontWeight: 800,
          color: TEXT_DARK,
          backgroundColor: WHITE,
          border: `2px solid ${withAlpha(YELLOW, 0.7)}`,
          boxShadow: `0 6px 16px ${withAlpha(TEXT_DARK, 0.08)}`,
        }}
      >
        修正規格
      </div>
```

- [ ] **Step 5: Highlight the「美術規格表」node when the feedback arrow lands**

In the `{NODES.map(...)}` block, replace the node `<div>`'s `color`, `border`, and `boxShadow` style lines with highlight-aware versions. Add, just inside the map callback before `return`:

```tsx
        const hi = i === FB_TO ? specHi : 0;
```

Then change these three style properties on the node `<div>`:

```tsx
              color: hi > 0.15 ? YELLOW : TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${hi > 0.15 ? YELLOW : CARD_BORDER}`,
              boxShadow: `0 16px 38px ${withAlpha(hi > 0.15 ? YELLOW : TEXT_DARK, hi > 0.15 ? 0.16 : 0.08)}`,
```

- [ ] **Step 6: Add `YELLOW` to the colors import**

Change the `theme/colors` import to:

```tsx
import { BLUE, CARD_BORDER, NEUTRAL_50, TEXT_DARK, WHITE, YELLOW, withAlpha } from "../../theme/colors";
```

- [ ] **Step 7: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"`
Expected: exit 0.

- [ ] **Step 8: Full visual checkpoint (whole 270 frames)**

In `remotion studio`, play `Ch4-Page8-S18-ArtWorkflow` start to finish. Confirm:
1. 標題彈入 → 四節點由左至右建立 → 三段藍線與箭頭依序畫出。
2. 約 150–208 幀：黃色回饋曲線由末節點（匯入 Unity 測試）繞回「美術規格表」，向上箭頭落點，膠囊「修正規格」淡入。
3. 「美術規格表」節點在箭頭落點時轉黃高亮。
4. 約 242–270 幀：整體淡出到米白。
5. 黃色回饋線與藍色節點不重疊打架（如貼太近，微調 `FB_Y` / `FB_DEPTH`）。

- [ ] **Step 9: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page8S18ArtWorkflow.tsx"
git commit -m "feat(ch4-s18): add feedback loop, 修正規格 label and spec-node highlight"
```

---

## Self-Review

**Spec coverage:**
- 四節點水平流程圖 → Task 2 ✅
- 節點由左至右建立、箭頭依序畫出 → Tasks 2–3 ✅
- 回饋箭頭繞回美術規格表、標「修正規格」→ Task 4 ✅
- 背景 NEUTRAL_50、結尾淡出 → Task 1 ✅
- 標題、米白配色、easeStandard、Root 註冊 270f → Tasks 1, 3 ✅
- 純文字節點（無圖示）→ Task 2 ✅
- 不抽共用元件、不動 Ch3 → 全程未修改 Ch3 ✅

**Placeholder scan:** No TBD/TODO; every code step shows complete code.

**Type consistency:** `NODE_CX`/`NODES`/`nodeStart`/`ARROW_LEN`/`FB_FROM`/`FB_TO`/`FB_Y`/`FB_DEPTH` defined in Tasks 2–4 and referenced consistently; `easeStandard as ease` aliased once (Task 3) and used by `segDraw`/`segArrow`/`fbDraw`/`fbLabel`/`specHi`. Import lines are progressively widened (colors: Task1→2→3→4) — each task states the full replacement line to avoid drift.
