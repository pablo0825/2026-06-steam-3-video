# Ch3 Page 1 Opening (S01–S03) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 26-second `Ch3-Page1-Opening` Remotion composition for S01–S03 (開場、本次重點、知識導覽) of 第 3 集「程式實作」, replacing the chapter-2 placeholder copy in the existing draft file with the chapter-3 storyboard content.

**Architecture:** One page-level React component (`Ch3Page1Opening`) drives three sequential shots from a single 780-frame timeline with short cross-fade overlaps. The component already exists at `src/scenes/03-程式實作/Ch3Page1Opening.tsx` but was copied from chapter 2 and still renders chapter-2 text (本次重點 cards「遊戲設計文件／Storyboard」、副標「第 2 集・程式實作」) — this plan overwrites it. `Root.tsx` already registers the composition (currently 690 frames) and only needs its `durationInFrames` updated to 780. The page uses inline SVG / emoji and a single shared logo image; no new assets are introduced.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Img`, `interpolate`, `interpolateColors`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`, `Easing`), existing theme tokens from `src/theme/colors.ts`.

## Global Constraints

- Composition ID is exactly `Ch3-Page1-Opening`.
- Duration is exactly 780 frames at 30 fps, 1920 × 1080 (S01 7s + S02 8s + S03 11s = 26s).
- Shot boundaries are S01 `0–210`, S02 `210–450`, S03 `450–780`, with cross-fade overlaps as defined per task.
- Use the existing white background (`WHITE`), dark gray text (`TEXT_DARK`), subtle gray (`SUBTLE`), and yellow emphasis (`YELLOW`); the highlighted knowledge tag uses `BLUE`.
- Use only frame-driven Remotion animation; do not add CSS transitions, CSS animations, or Tailwind animation classes.
- Load the logo with `staticFile("知點LOGO_FIN-03.png")` and `<Img>`; do not edit source assets.
- Subtitle text is exactly `第 3 集・程式實作`.
- S02 keyword emphasis (`YELLOW`) applies only to `User Story`, `Spec`, and `AI`.
- S03 knowledge tags are exactly `User Story`, `Context`, `AGENTS.md`, `Spec` (plural `AGENTS.md`), in that order; only `User Story` ends highlighted and carries into the next page.
- All lists/cards enter sequentially per narration; never reveal a full page of information at once.

---

### Task 1: Rewrite the page skeleton with S01 and fix the composition duration

**Files:**
- Modify (overwrite): `src/scenes/03-程式實作/Ch3Page1Opening.tsx`
- Modify: `src/Root.tsx:225` (the `Ch3-Page1-Opening` composition `durationInFrames`)

**Interfaces:**
- Consumes: theme exports `BLUE`, `CHIP_BG`, `CARD_BORDER`, `SUBTLE`, `TEXT_DARK`, `WHITE`, `YELLOW`, `withAlpha`.
- Produces: named React component `Ch3Page1Opening` exporting a 780-frame, three-shot page. Later tasks add the S02 and S03 layers into the marked slots inside its returned `<AbsoluteFill>`.

- [ ] **Step 1: Overwrite the component file with the S01-only skeleton**

Replace the entire contents of `src/scenes/03-程式實作/Ch3Page1Opening.tsx` with:

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
  CHIP_BG,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 1 頁開場（連續動畫，三段；30fps，總長 780 frames＝26 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 3 集・程式實作」
//   S02：本次重點兩張卡片（根據 Storyboard 寫 User Story／基於 Spec 與 AI 協作開發遊戲）
//   S03：知識導覽四標籤（User Story／Context／AGENTS.md／Spec），「User Story」高亮帶入下一頁

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

// ── 三段節奏（S01：0–210｜S02：210–450｜S03：450–780）──
const A_OUT = [188, 210] as const; // S01 淡出
const B_IN = [210, 230] as const; // S02 淡入
const B_OUT = [428, 450] as const; // S02 淡出
const C_IN = [450, 470] as const; // S03 淡入

// S01 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

export const Ch3Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S01：開場標題 ──────────────────────────────
  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const subOpacity = interpolate(frame, [SUB_START, SUB_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aOpacity = interpolate(frame, A_OUT, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
            <Img src={LOGO} style={{ width: logoW, height: "auto" }} from={-102} />
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
                第 3 集・程式實作
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02：本次重點 ── (added in Task 2) */}

      {/* ── S03：知識導覽 ── (added in Task 3) */}
    </AbsoluteFill>
  );
};
```

The unused imports (`BLUE`, `CHIP_BG`, `CARD_BORDER`, `interpolateColors`, `withAlpha`) are consumed by Tasks 2 and 3; lint will flag them until then, so run lint only at Step 3 after they are present is not possible yet — instead, Step 3 below renders a still (which does not fail on unused vars) and defers the full lint gate to Task 3. Do not delete these imports.

- [ ] **Step 2: Update the registered duration in `Root.tsx`**

In `src/Root.tsx`, find the `Ch3-Page1-Opening` composition and change its duration from 690 to 780:

```tsx
      {/* ── 第 3 集・程式實作 ── */}
      <Composition
        id="Ch3-Page1-Opening"
        component={Ch3Page1Opening}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
```

Leave the existing `import { Ch3Page1Opening } from "./scenes/03-程式實作/Ch3Page1Opening";` line unchanged (it is already present at `src/Root.tsx:24`).

- [ ] **Step 3: Verify S01 renders**

Run:

```powershell
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s01-logo.png --frame=30 --scale=0.25
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s01-title.png --frame=130 --scale=0.25
```

Expected:

- Frame 30 shows the centered, large 知點 logo before it moves up.
- Frame 130 shows the logo shrunk to the top, the title `VIBE GAME 教案`, the yellow underline, and the subtitle `第 3 集・程式實作` (not `第 2 集`).

### Task 2: Add the S02「本次重點」cards

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page1Opening.tsx`

**Interfaces:**
- Consumes: `B_IN`, `B_OUT`, `frame`, `fps`, theme `WHITE`, `TEXT_DARK`, `YELLOW`, `CARD_BORDER`, `withAlpha`.
- Produces: the S02 layer rendered between the S01 and S03 slots; introduces a local `HiliteLine` helper used only by S02.

- [ ] **Step 1: Add S02 timing and the keyword-line helper**

Inside the component body, immediately after the S01 block (after the `const aOpacity = ...` declaration), add:

```tsx
  // ── S02：本次重點 ──────────────────────────────
  const bOpacity =
    interpolate(frame, B_IN, [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, B_OUT, [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const card1 = spring({
    frame: frame - 238,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const card2 = spring({
    frame: frame - 270,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
```

Above the `Ch3Page1Opening` component (just below the `LOGO` constant), add the card data and a keyword-highlight line renderer:

```tsx
// S02 兩張重點卡：parts 內 hl=true 的片段以黃色強調（僅 User Story／Spec／AI）
type LinePart = { text: string; hl: boolean };

const FOCUS_CARDS: { badge: string; icon: string; parts: LinePart[] }[] = [
  {
    badge: "①",
    icon: "📝",
    parts: [
      { text: "根據 Storyboard 撰寫 ", hl: false },
      { text: "User Story", hl: true },
    ],
  },
  {
    badge: "②",
    icon: "🤖",
    parts: [
      { text: "基於 ", hl: false },
      { text: "Spec", hl: true },
      { text: " 與 ", hl: false },
      { text: "AI", hl: true },
      { text: " 協作開發遊戲", hl: false },
    ],
  },
];

const HiliteLine: React.FC<{ parts: LinePart[] }> = ({ parts }) => (
  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: 1,
      lineHeight: 1.4,
      color: TEXT_DARK,
    }}
  >
    {parts.map((p, i) => (
      <span key={i} style={{ color: p.hl ? YELLOW : TEXT_DARK }}>
        {p.text}
      </span>
    ))}
  </div>
);
```

- [ ] **Step 2: Render the S02 layer**

Replace the comment line `{/* ── S02：本次重點 ── (added in Task 2) */}` with:

```tsx
      {/* ── S02：本次重點 ── */}
      {frame >= 208 && frame < 455 && (
        <AbsoluteFill
          style={{
            opacity: bOpacity,
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
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {FOCUS_CARDS.map((c, i) => {
              const s = i === 0 ? card1 : card2;
              return (
                <div
                  key={c.badge}
                  style={{
                    width: 1080,
                    padding: "40px 56px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateX(${interpolate(s, [0, 1], [-56, 0])}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 36,
                  }}
                >
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      color: YELLOW,
                      minWidth: 56,
                    }}
                  >
                    {c.badge}
                  </div>
                  <div style={{ fontSize: 72 }}>{c.icon}</div>
                  <HiliteLine parts={c.parts} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 3: Verify the cards enter left-to-bottom in order with yellow keywords**

Run:

```powershell
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s02-card1.png --frame=255 --scale=0.25
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s02-both.png --frame=360 --scale=0.25
```

Expected:

- Frame 255 shows the title `本次重點` and the first card sliding in, while the second card is still absent or only beginning to appear.
- Frame 360 shows both cards fully in: card ① ends with a yellow `User Story`; card ② shows yellow `Spec` and `AI`; no clipping at 1920 × 1080.

### Task 3: Add the S03 knowledge tags with the User Story highlight

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page1Opening.tsx`

**Interfaces:**
- Consumes: `C_IN`, `frame`, `fps`, theme `TEXT_DARK`, `SUBTLE`, `WHITE`, `BLUE`, `CHIP_BG`, `withAlpha`, `interpolateColors`.
- Produces: the completed three-shot page; this is the last task that touches the component, so all previously unused imports are now consumed.

- [ ] **Step 1: Add the S03 tag constants and timing**

Below the `LOGO` constant (near the other module constants), add:

```tsx
// S03 四個知識標籤逐一彈入、僅「User Story」高亮帶入下一頁
const TAGS = ["User Story", "Context", "AGENTS.md", "Spec"] as const;
const TAG_STEP = 24; // 每個標籤間隔
const TAG_FIRST = 488;
const HILITE = [660, 692] as const; // 「User Story」高亮
```

Inside the component body, after the S02 declarations (after `const card2 = ...`), add:

```tsx
  // ── S03：知識導覽 ──────────────────────────────
  const cOpacity = interpolate(frame, C_IN, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hilite = interpolate(frame, HILITE, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
```

- [ ] **Step 2: Render the S03 layer**

Replace the comment line `{/* ── S03：知識導覽 ── (added in Task 3) */}` with:

```tsx
      {/* ── S03：知識導覽 ── */}
      {frame >= 448 && (
        <AbsoluteFill
          style={{
            opacity: cOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: 4,
              color: SUBTLE,
              marginBottom: 56,
            }}
          >
            先認識幾個重要觀念
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            {TAGS.map((tag, i) => {
              const inSpring = spring({
                frame: frame - (TAG_FIRST + i * TAG_STEP),
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              const isFirst = i === 0;
              const hi = isFirst ? hilite : 0; // 僅「User Story」高亮
              const dim = isFirst ? 0 : hilite; // 其餘標籤被淡化
              return (
                <div
                  key={tag}
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    letterSpacing: 3,
                    color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
                    background: interpolateColors(hi, [0, 1], [CHIP_BG, BLUE]),
                    padding: "26px 48px",
                    borderRadius: 999,
                    opacity: inSpring * interpolate(dim, [0, 1], [1, 0.35]),
                    transform: `translateY(${interpolate(inSpring, [0, 1], [40, 0])}px) scale(${1 + hi * 0.06})`,
                    boxShadow:
                      hi > 0
                        ? `0 14px 32px ${withAlpha(BLUE, 0.22 * hi)}`
                        : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 48,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 2,
              color: BLUE,
              opacity: hilite,
            }}
          >
            先從「User Story」開始 →
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 3: Lint the now-complete component**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0 (all previously unused imports — `BLUE`, `CHIP_BG`, `CARD_BORDER`, `interpolateColors`, `withAlpha` — are now consumed).

- [ ] **Step 4: Verify the tags enter in order and only User Story ends highlighted**

Run:

```powershell
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s03-tags.png --frame=600 --scale=0.25
npx.cmd remotion still Ch3-Page1-Opening .renders/ch3-page1-s03-hilite.png --frame=740 --scale=0.25
```

Expected:

- Frame 600 shows all four tags `User Story` / `Context` / `AGENTS.md` / `Spec` at equal emphasis (no highlight yet).
- Frame 740 shows `User Story` enlarged on a blue pill with the hint `先從「User Story」開始 →`, while `Context`, `AGENTS.md`, `Spec` are dimmed.

### Task 4: Sync the storyboard progress table and run final regression

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md:18`
- Verify: `src/scenes/03-程式實作/Ch3Page1Opening.tsx`
- Verify: `src/Root.tsx`

**Interfaces:**
- Consumes: the completed `Ch3-Page1-Opening` composition and all verification renders.
- Produces: a clean implementation with an up-to-date progress table, ready for user review.

- [ ] **Step 1: Mark page 1 as completed in the storyboard progress table**

In `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`, change the page-1 row status from `⏳ 待製作` to `✅ 已完成`:

```text
| 1 | `Ch3-Page1-Opening` | S01–S03 | 開場、本次重點、知識導覽 | 知點 logo、SVG 圖示 | ✅ 已完成 |
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
- Status shows only the Page 1 component, `Root.tsx`, the chapter-3 storyboard document, this plan document, and the pre-existing untracked `.dev-server` logs and `03-程式實作` assets.

- [ ] **Step 3: Inspect the full-page keyframes**

Open the generated `.renders/ch3-page1-*.png` files and confirm:

- No clipping at 1920 × 1080 and no text overlapping the logo or cards.
- The subtitle reads `第 3 集・程式實作`.
- S02 keyword emphasis appears only on `User Story`, `Spec`, `AI`.
- S03 ends with `User Story` as the single highlighted tag.

- [ ] **Step 4: Remove temporary render outputs**

Delete only the generated `.renders/ch3-page1-*.png` files after visual inspection. Resolve each path and confirm it is under the repository `.renders` directory before removal.

- [ ] **Step 5: Report implementation for review**

Provide the composition ID (`Ch3-Page1-Opening`), the implemented shot range (S01–S03), the new duration (780 frames), the verification result, and any intentional timing adjustments. Do not commit until the user has reviewed the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S01 opening (logo → title → yellow rule → subtitle) → Task 1; S02 本次重點 two horizontal cards with `User Story`/`Spec`/`AI` highlighted → Task 2; S03 four knowledge tags with `User Story` highlight carrying forward → Task 3. The storyboard progress table sync and duration correction are covered by Task 1 (Root) and Task 4 (storyboard doc).
- **Placeholder scan:** No TBD/TODO; every code step contains complete JSX/constants.
- **Type consistency:** `FOCUS_CARDS`/`LinePart`/`HiliteLine` (Task 2) and `TAGS`/`HILITE`/`TAG_FIRST`/`TAG_STEP` (Task 3) names are used consistently where referenced. Timeline constants `A_OUT`/`B_IN`/`B_OUT`/`C_IN` defined in Task 1 are consumed in Tasks 2–3.
