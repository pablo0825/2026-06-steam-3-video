# Ch4 Page 1 Opening (S01–S04) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 42-second `Ch4-Page1-Opening` Remotion composition for S01–S04 (開場、AI 生圖的角色、本次重點) of 第 4 集「美術整合」, a brand-new scene file plus its registration in `Root.tsx`.

**Architecture:** One page-level React component (`Ch4Page1Opening`) drives four sequential shots from a single 1260-frame timeline. S01 reuses the established opening template verbatim (logo → title → yellow rule → subtitle). S02 first shows a left/right contrast (AI 不是取代 vs 而是優化), the contrast then **fully fades out**, and a four-node horizontal flow (`AI 生假素材 → 匯入 Unity → 驗證規格 → 降低重工`) builds left-to-right. S03 **does not rebuild** that flow — the same flow group scales down and rises, a feedback arrow「修正規格」draws back from「驗證規格」to「AI 生假素材」, a「規格不符？」card pops, and the phrase「提早讓問題出現」enlarges at center. S04 reuses the `Ch2Page1Opening`「本次重點」layout with three vertical cards. The file does not yet exist; `Root.tsx` does not yet register it. No new assets are introduced (only the shared logo).

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Img`, `interpolate`, `interpolateColors`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`, `Easing`), existing theme tokens from `src/theme/colors.ts`, inline SVG for flow arrows.

## Global Constraints

- Composition ID is exactly `Ch4-Page1-Opening`.
- Duration is exactly 1260 frames at 30 fps, 1920 × 1080 (S01 7s + S02 17s + S03 10s + S04 8s = 42s).
- Shot boundaries are S01 `0–210`, S02 `210–720` (Beat A 對比 `210–410`, Beat B 流程 `410–720`), S03 `720–1020`, S04 `1020–1260`.
- The S02 Beat B flow and the S03 flow are **the same rendered group** — S03 must not unmount and remount it; it only transforms the group and adds the feedback arrow / problem card.
- Subtitle text is exactly `第 4 集・美術整合`.
- S02 section title is exactly `AI 生圖的角色`.
- Contrast cards: left = small label `AI 不是` + main `取代美術人員` (neutral `SUBTLE`); right = small label `而是` + main `優化美術工作` (`YELLOW` emphasis).
- Flow nodes are exactly `AI 生假素材`, `匯入 Unity`, `驗證規格`, `降低重工`, in that order; only `降低重工` (the last node) ends highlighted in `YELLOW`.
- Feedback arrow label is exactly `修正規格`; the feedback arrow runs from `驗證規格` back to `AI 生假素材`.
- S03 center phrase is exactly `提早讓問題出現`, with `提早` in `YELLOW` and the rest `TEXT_DARK`.
- S04 cards are exactly `美術規格表`, `AI 生假素材`, `Unity 驗證規格`, in that order, numbered ①②③.
- Use only colors from `src/theme/colors.ts` (`WHITE`, `TEXT_DARK`, `SUBTLE`, `YELLOW`, `BLUE`, `RED`, `CARD_BORDER`, `CHIP_BG`, `withAlpha`); do not add new colors.
- Use only frame-driven Remotion animation; no CSS transitions/animations or Tailwind animation classes.
- Load the logo with `staticFile("知點LOGO_FIN-03.png")` and `<Img>`; do not edit source assets.
- All lists/cards/nodes enter sequentially per narration; never reveal a full section at once.

---

### Task 1: Create the S01 skeleton file and register the composition

**Files:**
- Create: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`
- Modify: `src/Root.tsx` (add import; add a「第 4 集・美術整合」block with the composition)

**Interfaces:**
- Consumes: theme exports `BLUE`, `RED`, `SUBTLE`, `TEXT_DARK`, `WHITE`, `YELLOW`, `CARD_BORDER`, `withAlpha`.
- Produces: named React component `Ch4Page1Opening` exporting a 1260-frame page with four labeled layer slots. Later tasks fill the S02/S03/S04 slots and reference the module constants declared here.

- [ ] **Step 1: Create the component file with the S01-only skeleton**

Create `src/scenes/04-美術整合/Ch4Page1Opening.tsx` with exactly:

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  CARD_BORDER,
  withAlpha,
} from "../../theme/colors";

// 第 4 集・第 1 頁開場（連續動畫，四段；30fps，總長 1260 frames＝42 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 4 集・美術整合」
//   S02：AI 生圖的角色 — 先左右對比（不是取代／優化），對比淡出後建四節點流程
//   S03：延續同一張流程圖（縮小上移）＋回饋箭頭「修正規格」＋主句「提早讓問題出現」
//   S04：本次重點三卡（美術規格表／AI 生假素材／Unity 驗證規格）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ── 四段節奏 ──
// S01：0–210｜S02：210–720（對比 210–410、流程 410–720）｜S03：720–1020｜S04：1020–1260
const A_OUT = [188, 210] as const; // S01 淡出

// S01 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

export const Ch4Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S01：開場標題 ──────────────────────────────
  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [560, 220]);
  const logoY = interpolate(t2, [0, 1], [460, 150]);

  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + 18],
    [0, 1],
    clamp,
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );
  const subOpacity = interpolate(
    frame,
    [SUB_START, SUB_START + 18],
    [0, 1],
    clamp,
  );
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S01：開場標題 ── */}
      {frame < 215 && (
        <AbsoluteFill style={{ opacity: aOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: logoY,
              transform: `translate(-50%, -50%) scale(${logoIn})`,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Img src={LOGO} style={{ width: logoW, height: "auto" }} />
          </div>

          {frame >= TITLE_START && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 500,
                  transform: `translate(-50%, -50%) scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`,
                  opacity: titleOpacity,
                  fontSize: 132,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                VIBE GAME 教案
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 588,
                  transform: "translateX(-50%)",
                  width: ruleW,
                  height: 8,
                  borderRadius: 999,
                  background: YELLOW,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 660,
                  transform: "translateX(-50%)",
                  opacity: subOpacity,
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: 10,
                  color: SUBTLE,
                  whiteSpace: "nowrap",
                }}
              >
                第 4 集・美術整合
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── (added in Task 2) */}

      {/* ── S02 Beat B / S03：四節點流程（連續，不重建）── (added in Task 3, extended in Task 4) */}

      {/* ── S03：主句「提早讓問題出現」── (added in Task 4) */}

      {/* ── S04：本次重點三卡 ── (added in Task 5) */}
    </AbsoluteFill>
  );
};
```

The imports `BLUE`, `RED`, `interpolateColors`, `CARD_BORDER`, `withAlpha` are consumed by Tasks 2–5; the lint gate is deferred to Task 5 (Step 3). `remotion still` renders do not fail on unused imports, so the Task 2–4 verification renders work despite them. Do not delete these imports.

- [ ] **Step 2: Add the import to `Root.tsx`**

In `src/Root.tsx`, add this import immediately after the existing `import { Ch3Page13Ending } from "./scenes/03-程式實作/Ch3Page13Ending";` line:

```tsx
import { Ch4Page1Opening } from "./scenes/04-美術整合/Ch4Page1Opening";
```

- [ ] **Step 3: Register the composition in `Root.tsx`**

In `src/Root.tsx`, immediately after the closing `/>` of the `Ch3-Page13-Ending` `<Composition>` (the last composition before the closing `</>`), add:

```tsx
      {/* ── 第 4 集・美術整合 ── */}
      <Composition
        id="Ch4-Page1-Opening"
        component={Ch4Page1Opening}
        durationInFrames={1260}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 4: Verify S01 renders**

Run:

```powershell
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s01-logo.png --frame=30 --scale=0.25
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s01-title.png --frame=130 --scale=0.25
```

Expected:

- Frame 30 shows the centered, large 知點 logo before it moves up.
- Frame 130 shows the logo shrunk to the top, the title `VIBE GAME 教案`, the yellow underline, and the subtitle `第 4 集・美術整合`.

---

### Task 2: Add the S02 Beat A title and left/right contrast

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, theme `WHITE`, `TEXT_DARK`, `SUBTLE`, `YELLOW`, `CARD_BORDER`, `withAlpha`.
- Produces: the S02 context layer (section title `AI 生圖的角色` + two contrast cards). The title stays visible through Beat B and fades when S03 begins; the contrast cards fade out before the flow builds. Introduces module constants `S2_IN`, `CONTRAST_IN`, `CONTRAST_OUT`, `TITLE_OUT`, `LEFT_CARD`, `RIGHT_CARD`.

- [ ] **Step 1: Add the S02 Beat A constants**

In `src/scenes/04-美術整合/Ch4Page1Opening.tsx`, immediately after the `const SUB_START = 96;` line, add:

```tsx

// S02 Beat A：AI 生圖的角色＋左右對比
const S2_IN = [210, 232] as const; // S02 標題淡入
const TITLE_OUT = [700, 740] as const; // S02 標題在進入 S03 時淡出
const CONTRAST_IN = [232, 256] as const; // 對比卡淡入
const CONTRAST_OUT = [360, 410] as const; // 對比卡淡出後才建流程
const LEFT_CARD = 244; // 左卡 spring 起點
const RIGHT_CARD = 276; // 右卡 spring 起點
```

- [ ] **Step 2: Add the S02 Beat A animation values**

Inside the component body, immediately after the `const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);` line, add:

```tsx

  // ── S02 Beat A：AI 生圖的角色＋對比 ─────────────
  const s2TitleOpacity =
    interpolate(frame, S2_IN, [0, 1], clamp) *
    interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const contrastOpacity =
    interpolate(frame, CONTRAST_IN, [0, 1], clamp) *
    interpolate(frame, CONTRAST_OUT, [1, 0], clamp);
  const leftCard = spring({
    frame: frame - LEFT_CARD,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const rightCard = spring({
    frame: frame - RIGHT_CARD,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
```

- [ ] **Step 3: Render the S02 Beat A layer**

Replace the comment line `{/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── (added in Task 2) */}` with:

```tsx
      {/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── */}
      {frame >= 205 && frame < 742 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 175,
              transform: "translateX(-50%)",
              opacity: s2TitleOpacity,
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            AI 生圖的角色
          </div>

          {frame < 412 && (
            <div
              style={{
                position: "absolute",
                left: 960,
                top: 560,
                transform: "translate(-50%, -50%)",
                opacity: contrastOpacity,
                display: "flex",
                gap: 56,
              }}
            >
              {[
                {
                  s: leftCard,
                  label: "AI 不是",
                  main: "取代美術人員",
                  accent: SUBTLE,
                  border: CARD_BORDER,
                  dir: -1,
                },
                {
                  s: rightCard,
                  label: "而是",
                  main: "優化美術工作",
                  accent: YELLOW,
                  border: withAlpha(YELLOW, 0.7),
                  dir: 1,
                },
              ].map((c) => (
                <div
                  key={c.main}
                  style={{
                    width: 560,
                    padding: "48px 40px",
                    background: WHITE,
                    border: `3px solid ${c.border}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: c.s,
                    transform: `translateX(${interpolate(c.s, [0, 1], [c.dir * 48, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: c.accent,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: c.accent === YELLOW ? YELLOW : TEXT_DARK,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.main}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AbsoluteFill>
      )}
```

- [ ] **Step 4: Verify Beat A enters and fades before the flow**

Run:

```powershell
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s02a-contrast.png --frame=320 --scale=0.25
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s02a-cleared.png --frame=405 --scale=0.25
```

Expected:

- Frame 320 shows the title `AI 生圖的角色` at top, the left card (`AI 不是` / `取代美術人員`, grey) and the right card (`而是` / `優化美術工作`, yellow) both fully in.
- Frame 405 shows the title still present but the two contrast cards gone (faded out), leaving the center clear for the flow.

---

### Task 3: Add the S02 Beat B four-node flow (continuous group)

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, theme `WHITE`, `TEXT_DARK`, `BLUE`, `YELLOW`, `CARD_BORDER`, `withAlpha`, `interpolateColors`.
- Produces: the shared flow group (container `div` with the S03 raise/scale transform already wired) holding four nodes and three forward arrows. Introduces module constants `NODES`, `NODE_X`, `NODE_Y`, `NODE_FIRST`, `NODE_STEP`, `FLOW_IN`, `FLOW_RAISE`, `S3_OUT`, `HI_LAST`, and the helper `fwdArrowProgress`. Task 4 adds the feedback arrow + problem card into the SVG/children of this same group and the center phrase.

- [ ] **Step 1: Add the flow constants**

In `src/scenes/04-美術整合/Ch4Page1Opening.tsx`, immediately after the `const RIGHT_CARD = 276;` line, add:

```tsx

// S02 Beat B / S03：四節點水平流程（連續，不重建）
const NODES = ["AI 生假素材", "匯入 Unity", "驗證規格", "降低重工"] as const;
const NODE_X = [360, 760, 1160, 1560] as const; // 節點中心 x（節點寬 280）
const NODE_Y = 600; // Beat B 時節點中心 y（group transform 之前）
const NODE_FIRST = 430; // 第一個節點 spring 起點
const NODE_STEP = 60; // 每個節點＋箭頭一拍的間隔
const FLOW_IN = [410, 432] as const; // 流程層淡入
const FLOW_RAISE = [740, 810] as const; // S03：流程群組上移縮小
const S3_OUT = [998, 1020] as const; // S03 淡出
const HI_LAST = [664, 696] as const; // 「降低重工」高亮
```

- [ ] **Step 2: Add the flow animation values and helper**

Inside the component body, immediately after the `const rightCard = spring({ ... });` block from Task 2, add:

```tsx

  // ── S02 Beat B / S03：流程圖（連續）─────────────
  const flowOpacity =
    interpolate(frame, FLOW_IN, [0, 1], clamp) *
    interpolate(frame, S3_OUT, [1, 0], clamp);
  const flowRaise = interpolate(frame, FLOW_RAISE, [0, 1], clamp);
  const groupTy = interpolate(flowRaise, [0, 1], [0, -150]);
  const groupScale = interpolate(flowRaise, [0, 1], [1, 0.82]);
  const hiLast = interpolate(frame, HI_LAST, [0, 1], clamp);
  const nodeSpring = (i: number) =>
    spring({
      frame: frame - (NODE_FIRST + i * NODE_STEP),
      fps,
      config: { damping: 15, stiffness: 120 },
    });
  const fwdArrowProgress = (i: number) =>
    interpolate(
      frame,
      [NODE_FIRST + i * NODE_STEP + 30, NODE_FIRST + i * NODE_STEP + 54],
      [0, 1],
      clamp,
    );
```

- [ ] **Step 3: Render the flow group**

Replace the comment line `{/* ── S02 Beat B / S03：四節點流程（連續，不重建）── (added in Task 3, extended in Task 4) */}` with:

```tsx
      {/* ── S02 Beat B / S03：四節點流程（連續，不重建）── */}
      {frame >= 405 && frame < 1022 && (
        <AbsoluteFill style={{ opacity: flowOpacity }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${groupTy}px) scale(${groupScale})`,
              transformOrigin: "960px 600px",
            }}
          >
            <svg
              width="1920"
              height="1080"
              viewBox="0 0 1920 1080"
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              {[0, 1, 2].map((i) => {
                const x1 = NODE_X[i] + 140; // 左節點右緣
                const x2 = NODE_X[i + 1] - 140; // 右節點左緣
                const p = fwdArrowProgress(i);
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={NODE_Y}
                      x2={x2 - 22}
                      y2={NODE_Y}
                      stroke={BLUE}
                      strokeWidth={6}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - p}
                    />
                    <g
                      opacity={p}
                      transform={`translate(${x2} ${NODE_Y})`}
                    >
                      <path d="M0 0 L-22 -13 L-22 13 Z" fill={BLUE} />
                    </g>
                  </g>
                );
              })}
              {/* 回饋箭頭「修正規格」── (added in Task 4) */}
            </svg>

            {NODES.map((label, i) => {
              const s = nodeSpring(i);
              const isLast = i === 3;
              const hi = isLast ? hiLast : 0;
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: NODE_X[i],
                    top: NODE_Y,
                    width: 280,
                    height: 120,
                    transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.84, isLast ? 1 + hi * 0.05 : 1])})`,
                    opacity: s,
                    borderRadius: 22,
                    background: WHITE,
                    border: `3px solid ${interpolateColors(hi, [0, 1], [CARD_BORDER, YELLOW])}`,
                    boxShadow:
                      hi > 0
                        ? `0 16px 38px ${withAlpha(YELLOW, 0.22 * hi)}`
                        : `0 14px 32px ${withAlpha(TEXT_DARK, 0.08)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: interpolateColors(hi, [0, 1], [TEXT_DARK, YELLOW]),
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              );
            })}

            {/* 問題卡「規格不符？」── (added in Task 4) */}
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 4: Verify the flow builds left-to-right with the last node highlighted**

Run:

```powershell
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s02b-mid.png --frame=540 --scale=0.25
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s02b-full.png --frame=710 --scale=0.25
```

Expected:

- Frame 540 shows the first two or three nodes in with blue connecting arrows drawing left-to-right; later nodes still entering or absent.
- Frame 710 shows all four nodes `AI 生假素材 → 匯入 Unity → 驗證規格 → 降低重工` with three blue arrows; the last node `降低重工` is highlighted yellow. No clipping at 1920 × 1080.

---

### Task 4: Add the S03 feedback arrow, problem card, and center phrase

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, the flow group from Task 3 (`NODE_X`, `NODE_Y`, `groupTy`/`groupScale` via the same container), theme `WHITE`, `TEXT_DARK`, `YELLOW`, `RED`, `withAlpha`, `S3_OUT`.
- Produces: the completed S03 — a feedback arrow `修正規格` drawn inside the flow group's SVG, a `規格不符？` card popping from `驗證規格`, and the center phrase `提早讓問題出現`. Introduces module constants `FB_DRAW`, `PROBLEM_IN`, `PHRASE_IN`, `PHRASE_RULE`.

- [ ] **Step 1: Add the S03 constants**

In `src/scenes/04-美術整合/Ch4Page1Opening.tsx`, immediately after the `const HI_LAST = [664, 696] as const;` line, add:

```tsx

// S03：回饋箭頭、問題卡、主句
const FB_DRAW = [820, 884] as const; // 回饋箭頭 draw-on
const PROBLEM_IN = 800; // 問題卡 spring 起點
const PHRASE_IN = 884; // 主句 spring 起點
const PHRASE_RULE = [904, 940] as const; // 主句黃色底線 wipe
```

- [ ] **Step 2: Add the S03 animation values**

Inside the component body, immediately after the `fwdArrowProgress` helper from Task 3, add:

```tsx

  // ── S03：回饋＋主句 ────────────────────────────
  const fbDraw = interpolate(frame, FB_DRAW, [0, 1], clamp);
  const problemSpring = spring({
    frame: frame - PROBLEM_IN,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const phraseSpring = spring({
    frame: frame - PHRASE_IN,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const phraseRuleW = interpolate(frame, PHRASE_RULE, [0, 360], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const s3Out = interpolate(frame, S3_OUT, [1, 0], clamp);
```

- [ ] **Step 3: Add the feedback arrow into the flow group's SVG**

Replace the comment line `{/* 回饋箭頭「修正規格」── (added in Task 4) */}` (inside the `<svg>` in Task 3's flow group) with:

```tsx
              {/* 回饋箭頭「修正規格」：驗證規格 → AI 生假素材 */}
              <path
                d={`M ${NODE_X[2]} ${NODE_Y + 60} C ${NODE_X[2]} 810, ${NODE_X[0]} 810, ${NODE_X[0]} ${NODE_Y + 66}`}
                fill="none"
                stroke={YELLOW}
                strokeWidth={6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - fbDraw}
              />
              <g
                opacity={fbDraw}
                transform={`translate(${NODE_X[0]} ${NODE_Y + 62})`}
              >
                <path d="M0 0 L-13 22 L13 22 Z" fill={YELLOW} />
              </g>
              <text
                x={(NODE_X[0] + NODE_X[2]) / 2}
                y={808}
                textAnchor="middle"
                fill={YELLOW}
                fontSize={30}
                fontWeight={800}
                fontFamily={FONT}
                opacity={fbDraw}
              >
                修正規格
              </text>
```

- [ ] **Step 4: Add the problem card into the flow group**

Replace the comment line `{/* 問題卡「規格不符？」── (added in Task 4) */}` (inside the flow group `div`, after the nodes `.map`) with:

```tsx
            <div
              style={{
                position: "absolute",
                left: NODE_X[2],
                top: NODE_Y - 150,
                transform: `translate(-50%, -50%) scale(${interpolate(problemSpring, [0, 1], [0.8, 1])})`,
                opacity: problemSpring,
                padding: "16px 30px",
                background: withAlpha(RED, 0.1),
                border: `3px solid ${withAlpha(RED, 0.7)}`,
                borderRadius: 16,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 1,
                color: RED,
                whiteSpace: "nowrap",
              }}
            >
              規格不符？
            </div>
```

- [ ] **Step 5: Render the center phrase layer**

Replace the comment line `{/* ── S03：主句「提早讓問題出現」── (added in Task 4) */}` with:

```tsx
      {/* ── S03：主句「提早讓問題出現」── */}
      {frame >= 790 && frame < 1022 && (
        <AbsoluteFill style={{ opacity: s3Out }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 880,
              transform: `translate(-50%, -50%) scale(${interpolate(phraseSpring, [0, 1], [0.9, 1])})`,
              opacity: phraseSpring,
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: YELLOW }}>提早</span>讓問題出現
          </div>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 938,
              transform: "translateX(-50%)",
              width: phraseRuleW,
              height: 8,
              borderRadius: 999,
              background: YELLOW,
            }}
          />
        </AbsoluteFill>
      )}
```

- [ ] **Step 6: Verify the S03 evolution (same flow, raised + feedback + phrase)**

Run:

```powershell
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s03-feedback.png --frame=900 --scale=0.25
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s03-phrase.png --frame=960 --scale=0.25
```

Expected:

- Frame 900 shows the same four-node flow now scaled down and raised, a `規格不符？` red card above `驗證規格`, and the yellow feedback arrow `修正規格` curving from `驗證規格` back to `AI 生假素材`.
- Frame 960 shows the center phrase `提早讓問題出現` (with `提早` yellow) and its yellow underline below the flow. No clipping; the flow did not visually rebuild between frame 710 and here.

---

### Task 5: Add the S04「本次重點」cards and lint

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, theme `WHITE`, `TEXT_DARK`, `YELLOW`, `BLUE`, `CARD_BORDER`, `withAlpha`.
- Produces: the completed four-shot page; this is the last task that touches the component, so all previously unused imports are now consumed. Introduces module constants `S4_IN`, `FOCUS_CARDS`, `FOCUS_FIRST`, `FOCUS_STEP`.

- [ ] **Step 1: Add the S04 constants and card data**

In `src/scenes/04-美術整合/Ch4Page1Opening.tsx`, immediately after the `const PHRASE_RULE = [904, 940] as const;` line, add:

```tsx

// S04：本次重點三卡（parts 內 hl 片段以強調色顯示）
const S4_IN = [1020, 1044] as const;
const FOCUS_FIRST = 1052;
const FOCUS_STEP = 26;
type FocusPart = { text: string; color: string };
const FOCUS_CARDS: { badge: string; icon: string; parts: FocusPart[] }[] = [
  { badge: "①", icon: "📋", parts: [{ text: "美術規格表", color: YELLOW }] },
  {
    badge: "②",
    icon: "🤖",
    parts: [
      { text: "AI", color: YELLOW },
      { text: " 生假素材", color: TEXT_DARK },
    ],
  },
  {
    badge: "③",
    icon: "✅",
    parts: [
      { text: "Unity", color: BLUE },
      { text: " 驗證規格", color: TEXT_DARK },
    ],
  },
];
```

Note: `FOCUS_CARDS` is declared at module scope but references `YELLOW`, `BLUE`, `TEXT_DARK`, which are module-level imports — this is valid (no component state needed).

- [ ] **Step 2: Add the S04 animation values**

Inside the component body, immediately after the `const s3Out = interpolate(frame, S3_OUT, [1, 0], clamp);` line from Task 4, add:

```tsx

  // ── S04：本次重點 ──────────────────────────────
  const s4Opacity = interpolate(frame, S4_IN, [0, 1], clamp);
```

- [ ] **Step 3: Render the S04 layer**

Replace the comment line `{/* ── S04：本次重點三卡 ── (added in Task 5) */}` with:

```tsx
      {/* ── S04：本次重點三卡 ── */}
      {frame >= 1015 && (
        <AbsoluteFill
          style={{
            opacity: s4Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 6,
              color: TEXT_DARK,
              marginBottom: 64,
            }}
          >
            本次重點
          </div>
          <div style={{ display: "flex", gap: 48 }}>
            {FOCUS_CARDS.map((c, i) => {
              const s = spring({
                frame: frame - (FOCUS_FIRST + i * FOCUS_STEP),
                fps,
                config: { damping: 15, stiffness: 120 },
              });
              return (
                <div
                  key={c.badge}
                  style={{
                    width: 440,
                    padding: "52px 36px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateY(${interpolate(s, [0, 1], [48, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div
                    style={{ fontSize: 44, fontWeight: 800, color: YELLOW }}
                  >
                    {c.badge}
                  </div>
                  <div style={{ fontSize: 76 }}>{c.icon}</div>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      letterSpacing: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.parts.map((p, j) => (
                      <span key={j} style={{ color: p.color }}>
                        {p.text}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 4: Lint the now-complete component**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0 (all imports — `BLUE`, `RED`, `interpolateColors`, `CARD_BORDER`, `withAlpha` — are now consumed).

- [ ] **Step 5: Verify the S04 cards enter in order with emphasis**

Run:

```powershell
npx.cmd remotion still Ch4-Page1-Opening .renders/ch4-page1-s04-cards.png --frame=1180 --scale=0.25
```

Expected: Frame 1180 shows `本次重點` and three cards ①②③ — `美術規格表` (yellow), `AI 生假素材` (AI yellow), `Unity 驗證規格` (Unity blue). No clipping at 1920 × 1080.

---

### Task 6: Sync the storyboard progress table and run final regression

**Files:**
- Modify: `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md` (the page-1 row of the「製作進度」table)
- Verify: `src/scenes/04-美術整合/Ch4Page1Opening.tsx`, `src/Root.tsx`

**Interfaces:**
- Consumes: the completed `Ch4-Page1-Opening` composition and all verification renders.
- Produces: an up-to-date progress table and a clean tree, ready for user review.

- [ ] **Step 1: Mark page 1 as 已完成 in the storyboard progress table**

In `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`, change the page-1 row status from `⏳ 待製作` to `✅ 已完成`:

```text
| 1 | `Ch4-Page1-Opening` | S01–S04 | 開場、AI 生圖定位、本次重點 | 知點 logo、SVG 流程圖 | ✅ 已完成 |
```

Do not change any other row.

- [ ] **Step 2: Run final static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit 0.
- `git diff --check` reports no whitespace errors.
- Status shows the new Page 1 component, `Root.tsx`, the chapter-4 storyboard document, this plan document, and any pre-existing untracked files — nothing unexpected.

- [ ] **Step 3: Inspect the full-page keyframes**

Open the generated `.renders/ch4-page1-*.png` files and confirm:

- No clipping at 1920 × 1080; no text overlapping the logo, nodes, or cards.
- The subtitle reads `第 4 集・美術整合`.
- S02 contrast cards are gone before the flow builds.
- The S03 flow is visibly the same group as Beat B (scaled/raised, not rebuilt), with the `修正規格` feedback loop and `提早讓問題出現` phrase.
- S04 shows the three numbered focus cards with correct emphasis colors.

- [ ] **Step 4: Remove temporary render outputs**

Delete only the generated `.renders/ch4-page1-*.png` files after visual inspection. Resolve each path and confirm it is under the repository `.renders` directory before removal.

- [ ] **Step 5: Report implementation for review**

Provide the composition ID (`Ch4-Page1-Opening`), the implemented shot range (S01–S04), the duration (1260 frames), the verification result, and any intentional timing/coordinate adjustments. Do not commit until the user has reviewed the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:**
  - S01 opening (logo → title → yellow rule → subtitle `第 4 集・美術整合`) → Task 1.
  - S02 Beat A contrast (`AI 不是取代美術人員` vs `而是優化美術工作`) + section title `AI 生圖的角色` → Task 2.
  - S02 Beat B four-node flow `AI 生假素材 → 匯入 Unity → 驗證規格 → 降低重工` with last node highlighted → Task 3.
  - S03 continuous evolution: same flow group raised/scaled (Task 3 transform), feedback arrow `修正規格` from `驗證規格` to `AI 生假素材`, `規格不符？` problem card, center phrase `提早讓問題出現` → Task 4.
  - S04 three focus cards `美術規格表` / `AI 生假素材` / `Unity 驗證規格` → Task 5.
  - Composition registration (Root.tsx, id, 1260 frames) → Task 1; storyboard table sync → Task 6.
- **Placeholder scan:** No TBD/TODO; every code step contains complete JSX/constants. The two in-code "added in Task 4" comments are explicit insertion anchors placed by Task 3, each resolved by a concrete replacement step in Task 4.
- **Type consistency:** `NODES`/`NODE_X`/`NODE_Y`/`NODE_FIRST`/`NODE_STEP` (Task 3) are reused by name in Task 4's feedback path and problem card. `nodeSpring`/`fwdArrowProgress` (Task 3) and `fbDraw`/`problemSpring`/`phraseSpring`/`phraseRuleW`/`s3Out` (Task 4) and `s4Opacity` (Task 5) are each referenced only where defined. `FocusPart`/`FOCUS_CARDS`/`FOCUS_FIRST`/`FOCUS_STEP` (Task 5) names match their usage. Timeline constants `A_OUT` (Task 1), `S2_IN`/`TITLE_OUT`/`CONTRAST_IN`/`CONTRAST_OUT`/`LEFT_CARD`/`RIGHT_CARD` (Task 2), `FLOW_IN`/`FLOW_RAISE`/`S3_OUT`/`HI_LAST` (Task 3), `FB_DRAW`/`PROBLEM_IN`/`PHRASE_IN`/`PHRASE_RULE` (Task 4), `S4_IN` (Task 5) are each consumed in their own or a later task.
- **Frame budget:** S01 0–210, S02 210–720, S03 720–1020, S04 1020–1260 = 1260 frames; matches the registered `durationInFrames` and the spec's 42s. Timing/coordinates are a strong starting point and may be fine-tuned in Remotion preview during verification.
