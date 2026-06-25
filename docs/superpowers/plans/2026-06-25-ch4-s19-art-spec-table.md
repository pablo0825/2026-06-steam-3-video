# Ch4 S19 Art Spec Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `Ch4-Page9-S19-ArtSpecTable` (S19) scene — a 360-frame, 8-column art spec table that fades its frame in, reveals headers in sequence, fills 3 example rows one by one, shows a footer note, then fades out to NEUTRAL_50.

**Architecture:** A single self-contained Remotion scene component (`Ch4Page9S19ArtSpecTable.tsx`) registered as a Composition in `Root.tsx`. The table is a data-driven CSS-grid layout: a `COLUMNS` array (label + width) drives `gridTemplateColumns`, and a `ROWS` array of 8-string tuples drives the cells. Outer white container provides the frame; per-cell inner borders form the grid lines; entrance is staggered by column (header) and by row (data).

**Tech Stack:** React, Remotion (`AbsoluteFill`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), CSS grid via inline styles, project theme tokens (`theme/colors`, `theme/motion`).

## Global Constraints

- Verification per task is `npx tsc --noEmit` + `npx eslint <file>` + visual check in `remotion studio`. There is NO unit-test framework for scenes — do not invent one.
- Composition: id `Ch4-Page9-S19-ArtSpecTable`, `durationInFrames={360}`, `fps={30}`, `width={1920}`, `height={1080}`.
- Background `NEUTRAL_50`; shared `FONT`, `clamp`, `easeStandard` imported from `src/theme/motion.ts`.
- Reply/commit copy in Traditional Chinese where Chinese is used; never Simplified.
- Do NOT modify other existing scenes.
- Ending fade must fade ONLY the content (inner `AbsoluteFill` with `opacity`), keeping the outer `NEUTRAL_50` background opaque.
- Columns (briefing-img/18): 素材140 / 用途180 / 尺寸190 / PPU100 / 類型220 / 背景130 / 內容560 / 備註200 (total 1720). Header bg `HEADER_BG`; cell borders `CARD_BORDER`; footer note `SUBTLE`.

---

### Task 1: Scaffold scene (background, title, ending fade) + data + register Composition

**Files:**
- Create: `src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx`
- Modify: `src/Root.tsx` (import near other Ch4 imports; `<Composition>` after the `Ch4-Page8-S18-ArtWorkflow` block)

**Interfaces:**
- Produces: `export const Ch4Page9S19ArtSpecTable: React.FC`; module constants `COLUMNS`, `ROWS`, `GRID_COLS`, `TABLE_W`, `TABLE_TOP`, `HEADER_H`, `ROW_H`, `TABLE_H` used by Tasks 2–4.

- [ ] **Step 1: Create the scene file**

Create `src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx`:

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

// 第 4 集・第 9 頁・S19：美術規格表（360 幀）
//   白底 8 欄表格，外框淡入 → 表頭依序出現 → 三列逐列填入 → 底部範本註，結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [332, 360] as const; // 結尾淡出到 NEUTRAL_50

type Column = { label: string; width: number };
const COLUMNS: Column[] = [
  { label: "素材", width: 140 },
  { label: "用途", width: 180 },
  { label: "尺寸", width: 190 },
  { label: "PPU", width: 100 },
  { label: "類型", width: 220 },
  { label: "背景", width: 130 },
  { label: "內容", width: 560 },
  { label: "備註", width: 200 },
];

const ROWS: string[][] = [
  ["圓球", "玩家角色", "128×128", "128", "單張", "透明", "球狀玩家角色，置中、完整顯示", ""],
  ["地板", "場景 tile", "512×512", "128", "Sprite Sheet 4×4", "不透明", "4×4 地板變化：正常、印記、破損、其他變化", "每格 128×128"],
  ["尖刺", "場景物件", "1024×128", "128", "Sprite Sheet 4×1", "不透明", "4×1 場景物件，每格一個獨立物件", "每格 128×128"],
];

const TABLE_W = COLUMNS.reduce((s, c) => s + c.width, 0); // 1720
const GRID_COLS = COLUMNS.map((c) => `${c.width}px`).join(" ");
const TABLE_TOP = 300;
const HEADER_H = 76;
const ROW_H = 120;
const TABLE_H = HEADER_H + ROWS.length * ROW_H; // 436

export const Ch4Page9S19ArtSpecTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 120,
            transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
            opacity: titleIn,
            fontSize: 64,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 4,
          }}
        >
          美術規格表
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add the import in `Root.tsx`**

After `import { Ch4Page8S18ArtWorkflow } ...` add:

```tsx
import { Ch4Page9S19ArtSpecTable } from "./scenes/04-美術整合/Ch4Page9S19ArtSpecTable";
```

- [ ] **Step 3: Register the Composition in `Root.tsx`**

Immediately after the closing `/>` of the `id="Ch4-Page8-S18-ArtWorkflow"` Composition block, add:

```tsx
      <Composition
        id="Ch4-Page9-S19-ArtSpecTable"
        component={Ch4Page9S19ArtSpecTable}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx" "src/Root.tsx"`
Expected: exit 0.

- [ ] **Step 5: Visual checkpoint**

Open `remotion studio`, select `Ch4-Page9-S19-ArtSpecTable`. Confirm: 米白背景、標題「美術規格表」置中上方 spring 彈入；尾段（332–360 幀）整體內容淡出但背景維持米白。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx" src/Root.tsx
git commit -m "feat(ch4-s19): scaffold ArtSpecTable scene with title, data and ending fade"
```

---

### Task 2: Add the table container (frame fade-in) + header row

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx`

**Interfaces:**
- Consumes: `frame`, `COLUMNS`, `GRID_COLS`, `TABLE_W`, `TABLE_TOP`, `HEADER_H`, `TABLE_H`.

- [ ] **Step 1: Add `withAlpha`, `CARD_BORDER`, `HEADER_BG`, `WHITE` to the colors import and `easeStandard` to motion**

Replace the two import lines with:

```tsx
import {
  CARD_BORDER,
  HEADER_BG,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard as ease } from "../../theme/motion";
```

- [ ] **Step 2: Add frame and header timing helpers**

Inside the component, after the `titleIn` declaration, add:

```tsx
  const frameIn = interpolate(frame, [20, 50], [0, 1], ease);
  const headCell = (i: number) =>
    interpolate(frame, [40 + i * 8, 60 + i * 8], [0, 1], ease);
```

- [ ] **Step 3: Render the table container + header row**

Inside the inner `<AbsoluteFill>`, after the title `<div>`, add:

```tsx
        <div
          style={{
            position: "absolute",
            left: (1920 - TABLE_W) / 2,
            top: TABLE_TOP,
            width: TABLE_W,
            height: TABLE_H,
            backgroundColor: WHITE,
            border: `2px solid ${CARD_BORDER}`,
            borderRadius: 10,
            overflow: "hidden",
            opacity: frameIn,
            boxShadow: `0 16px 40px ${withAlpha(TEXT_DARK, 0.06)}`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: GRID_COLS }}>
            {COLUMNS.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: HEADER_H,
                  padding: "0 10px",
                  fontSize: 28,
                  fontWeight: 800,
                  color: TEXT_DARK,
                  backgroundColor: HEADER_BG,
                  borderRight:
                    i < COLUMNS.length - 1
                      ? `1px solid ${CARD_BORDER}`
                      : undefined,
                  borderBottom: `1px solid ${CARD_BORDER}`,
                  opacity: headCell(i),
                }}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"`
Expected: exit 0.

- [ ] **Step 5: Visual checkpoint**

In `remotion studio`, scrub 0–120 幀。確認：白底表格外框（圓角矩形）於 20–50 幀淡入；8 個灰底表頭欄位由左至右依序淡入；欄寬比例符合設計（內容欄最寬）。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"
git commit -m "feat(ch4-s19): add table container frame and staggered header row"
```

---

### Task 3: Add the 3 data rows (row-by-row fill)

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx`

**Interfaces:**
- Consumes: `frame`, `ROWS`, `COLUMNS`, `GRID_COLS`, `ROW_H`.

- [ ] **Step 1: Add row timing helper**

After the `headCell` helper, add:

```tsx
  const rowIn = (r: number) =>
    interpolate(frame, [130 + r * 45, 154 + r * 45], [0, 1], ease);
```

- [ ] **Step 2: Render the data rows inside the table container**

Inside the table container `<div>`, after the header-row `<div>` (the `gridTemplateColumns` block), add:

```tsx
          {ROWS.map((row, r) => (
            <div
              key={row[0]}
              style={{
                display: "grid",
                gridTemplateColumns: GRID_COLS,
                opacity: rowIn(r),
              }}
            >
              {row.map((cell, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    height: ROW_H,
                    padding: "0 12px",
                    fontSize: i === 6 ? 24 : 26,
                    lineHeight: 1.35,
                    color: TEXT_DARK,
                    borderRight:
                      i < COLUMNS.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : undefined,
                    borderBottom:
                      r < ROWS.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : undefined,
                  }}
                >
                  {cell || "—"}
                </div>
              ))}
            </div>
          ))}
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"`
Expected: exit 0.

- [ ] **Step 4: Visual checkpoint**

In `remotion studio`, scrub 100–250 幀。確認：三筆資料列由上而下逐列淡入（130／175／220 起）；「內容」欄長文字在欄寬內換行不溢出；圓球的「備註」顯示「—」；格線單線不重疊、與外框對齊。若內容溢出，回報以調欄寬或字級。

- [ ] **Step 5: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"
git commit -m "feat(ch4-s19): add 3 example rows with row-by-row fill"
```

---

### Task 4: Add the footer note + final timing pass

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx`

**Interfaces:**
- Consumes: `frame`, `TABLE_W`, `TABLE_TOP`, `TABLE_H`, `SUBTLE`.

- [ ] **Step 1: Add `SUBTLE` to the colors import**

Replace the colors import with:

```tsx
import {
  CARD_BORDER,
  HEADER_BG,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
```

- [ ] **Step 2: Add the footer note timing helper**

After the `rowIn` helper, add:

```tsx
  const noteIn = interpolate(frame, [252, 276], [0, 1], ease);
```

- [ ] **Step 3: Render the footer note**

Inside the inner `<AbsoluteFill>`, after the table container `</div>` (the one with the `boxShadow`), add:

```tsx
        <div
          style={{
            position: "absolute",
            left: (1920 - TABLE_W) / 2,
            top: TABLE_TOP + TABLE_H + 18,
            fontSize: 24,
            color: SUBTLE,
            opacity: noteIn,
          }}
        >
          以上表格只是範本，可依需求自行調整內容
        </div>
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `npx eslint "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"`
Expected: exit 0.

- [ ] **Step 5: Full visual checkpoint (whole 360 frames)**

In `remotion studio`, play `Ch4-Page9-S19-ArtSpecTable` start to finish. Confirm:
1. 標題彈入 → 表格外框淡入 → 表頭依序出現 → 三列逐列填入 → 底部註「以上表格只是範本…」淡入。
2. 約 276–332 幀：完整表格停留可閱讀。
3. 約 332–360 幀：內容淡出、背景維持米白。
4. 整體垂直留白協調（如偏上/偏下，調 `TABLE_TOP`）。

- [ ] **Step 6: Commit**

```bash
git add "src/scenes/04-美術整合/Ch4Page9S19ArtSpecTable.tsx"
git commit -m "feat(ch4-s19): add footer note and finalize timing"
```

---

## Self-Review

**Spec coverage:**
- 白底 8 欄表格、briefing 欄位 → Tasks 1–3 ✅
- 外框淡入 → Task 2 ✅
- 表頭依序出現 → Task 2 ✅
- 範例列逐列填入 → Task 3 ✅
- 底部範本註 → Task 4 ✅
- 背景米白、結尾僅內容淡出 → Task 1 (inner wrapper) ✅
- 標題、easeStandard、Root 註冊 360f → Tasks 1–2 ✅
- 不做高亮、不抽元件、不動其他場景 → 全程 ✅

**Placeholder scan:** No TBD/TODO; every code step shows complete code.

**Type consistency:** `COLUMNS`/`ROWS`/`GRID_COLS`/`TABLE_W`/`TABLE_TOP`/`HEADER_H`/`ROW_H`/`TABLE_H` defined in Task 1 and referenced consistently; `headCell`/`rowIn`/`noteIn`/`frameIn` use `easeStandard as ease` aliased in Task 2 (`ease`) — Task 2 introduces the alias before Task 3's `rowIn` and Task 4's `noteIn` use it. Colors import is widened in Task 2 (adds CARD_BORDER/HEADER_BG/WHITE/withAlpha) and Task 4 (adds SUBTLE); each step shows the full replacement line. Empty cell renders `cell || "—"` (only 圓球 備註 is empty).
