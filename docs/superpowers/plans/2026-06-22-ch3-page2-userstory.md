# Ch3 Page 2 User Story (S04–S05) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 24-second `Ch3-Page2-UserStory` Remotion composition for S04–S05 (User Story 定義與格式) of 第 3 集「程式實作」.

**Architecture:** One new page-level React component (`Ch3Page2UserStory`) drives two sequential shots from a single 720-frame timeline with a short cross-fade overlap. S04 reuses the chapter-2 "definition layout" pattern, kept intentionally minimal: a spring-in title and a fading definition line with a yellow key span — and nothing else (no motif, no tip pill). S05 slides in three format cards (`身為一位「角色」`/`我想要「需求」`/`為了「價值」`) sequentially, then shrinks the group upward while a tip fades in. `Root.tsx` gains one new import and one new `<Composition>` registration.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens from `src/theme/colors.ts`. No image assets.

## Global Constraints

- Composition ID is exactly `Ch3-Page2-UserStory`.
- Duration is exactly 720 frames at 30 fps, 1920 × 1080 (S04 12s + S05 12s = 24s).
- Shot boundaries are S04 `0–360`, S05 `360–720`, with a cross-fade overlap (S04 fades out `332–356`, S05 fades in `356–380`).
- Use the existing white background (`WHITE`), dark gray text (`TEXT_DARK`), subtle gray (`SUBTLE`), yellow emphasis (`YELLOW`), card border (`CARD_BORDER`), blue (`BLUE`), and `withAlpha`.
- Use only frame-driven Remotion animation; no CSS transitions, CSS animations, or Tailwind animation classes. No image/video assets.
- S04 shows only the title `User Story` and the definition line `用一段話，描述使用者的需求` with `使用者的需求` in yellow — no other elements (no chat-bubble motif, no tip pill).
- S05 three cards, in order: label `身為一位` value `角色` icon `👤`; label `我想要` value `需求` icon `🎯`; label `為了` value `價值` icon `⭐`. The value text is yellow. End tip: `先看案例，再一起寫 →`.
- Lists/cards enter sequentially per narration; never reveal a full row of cards at once.
- Each task imports only the theme tokens it uses, so `npm run lint` passes at the end of every task.

---

### Task 1: Create the page with S04 (definition) and register the composition

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page2UserStory.tsx`
- Modify: `src/Root.tsx` (add import near the other `03-程式實作` import; add a `<Composition>` after the `Ch3-Page1-Opening` block)

**Interfaces:**
- Consumes: theme exports `SUBTLE`, `TEXT_DARK`, `WHITE`, `YELLOW`.
- Produces: named React component `Ch3Page2UserStory` (720 frames). Task 2 adds the S05 layer into the marked slot and adds the `Easing` import plus the `BLUE` / `CARD_BORDER` / `withAlpha` imports it needs.

- [ ] **Step 1: Create the component file with S04 only**

Create `src/scenes/03-程式實作/Ch3Page2UserStory.tsx` with exactly:

```tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SUBTLE, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 3 集・第 2 頁：User Story（定義 ＋ 格式）
//   S04：標題「User Story」彈入 → 定義句淡入（使用者的需求 黃字）；本頁刻意只保留標題與定義句
//   S05：三張格式卡（身為一位「角色」／我想要「需求」／為了「價值」）依序滑入 → 末尾縮小上移、提示淡入

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

// 重點字（黃色粗體＝強調）
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

// ── 兩段節奏（S04：0–360｜S05：360–720）──
const A_OUT = [332, 356] as const; // S04 淡出

// S04 內部節奏
const DEF_START = 44; // 定義句淡入

export const Ch3Page2UserStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // ── S04 ──
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const defOpacity = interpolate(frame, [DEF_START, DEF_START + 18], [0, 1], clamp);
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S04：定義（只保留標題與定義句） ── */}
      {frame < 360 && (
        <AbsoluteFill
          style={{
            opacity: aOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 6,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            User Story
          </div>

          <div
            style={{
              marginTop: 44,
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: defOpacity,
              whiteSpace: "nowrap",
            }}
          >
            用一段話，描述<span style={KEY}>使用者的需求</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ── S05：格式卡 ── (added in Task 2) */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Register the composition in `Root.tsx`**

Add the import next to the existing chapter-3 import (after `import { Ch3Page1Opening } from "./scenes/03-程式實作/Ch3Page1Opening";`):

```tsx
import { Ch3Page2UserStory } from "./scenes/03-程式實作/Ch3Page2UserStory";
```

Add this `<Composition>` immediately after the closing `/>` of the `Ch3-Page1-Opening` composition block:

```tsx
      <Composition
        id="Ch3-Page2-UserStory"
        component={Ch3Page2UserStory}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 3: Verify lint and the S04 render**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page2-UserStory .renders/ch3-page2-s04.png --frame=130 --scale=0.25
```

Expected:

- ESLint + tsc exit 0 (every imported token is used).
- Frame 130 shows only the centered title `User Story` and the definition line `用一段話，描述使用者的需求` with `使用者的需求` in yellow — no bubbles, no document, no tip pill.

### Task 2: Add the S05 format cards

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page2UserStory.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, `clamp`, theme `WHITE`, `TEXT_DARK`, `SUBTLE`, `YELLOW`, and the newly added `Easing`, `BLUE`, `CARD_BORDER`, `withAlpha`.
- Produces: the completed two-shot page.

- [ ] **Step 1: Add the `Easing`, `BLUE`, `CARD_BORDER`, and `withAlpha` imports**

Update the remotion import block to add `Easing`, and the theme import block to add `BLUE` / `CARD_BORDER` / `withAlpha`, so they read exactly:

```tsx
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
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
```

- [ ] **Step 2: Add S05 timing, card data, and the `ease` helper**

Below the `DEF_START` constant (module level), add:

```tsx
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ── S05 節奏與卡片 ──
const B_IN = [356, 380] as const; // S05 淡入
const STORY_CARDS = [
  { label: "身為一位", value: "角色", icon: "👤" },
  { label: "我想要", value: "需求", icon: "🎯" },
  { label: "為了", value: "價值", icon: "⭐" },
] as const;
const CARD_FIRST = 380; // 第一張卡進場
const CARD_STEP = 42; // 卡片間隔
const SHRINK = [612, 648] as const; // 三卡縮小上移
const TIP2_IN = [646, 678] as const; // 末尾提示淡入
```

Inside the component body, after the `const aOpacity = ...` line (end of the S04 block), add:

```tsx
  // ── S05 ──
  const ease = { ...clamp, easing: EASE };
  const bOpacity = interpolate(frame, B_IN, [0, 1], clamp);
  const groupScale = interpolate(frame, SHRINK, [1, 0.86], ease);
  const groupRise = interpolate(frame, SHRINK, [0, -130], ease);
  const tip2 = interpolate(frame, TIP2_IN, [0, 1], clamp);
```

- [ ] **Step 3: Render the S05 layer**

Replace the placeholder line `{/* ── S05：格式卡 ── (added in Task 2) */}` with:

```tsx
      {/* ── S05：格式卡 ── */}
      {frame >= 354 && (
        <AbsoluteFill
          style={{
            opacity: bOpacity,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 48,
              transform: `translateY(${groupRise}px) scale(${groupScale})`,
            }}
          >
            {STORY_CARDS.map((c, i) => {
              const s = spring({
                frame: frame - (CARD_FIRST + i * CARD_STEP),
                fps,
                config: { damping: 16, stiffness: 120 },
              });
              return (
                <div
                  key={c.value}
                  style={{
                    width: 460,
                    padding: "48px 36px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateY(${interpolate(s, [0, 1], [56, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div style={{ fontSize: 84 }}>{c.icon}</div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      letterSpacing: 2,
                      color: SUBTLE,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: YELLOW,
                    }}
                  >
                    「{c.value}」
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 64,
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: 2,
              color: BLUE,
              opacity: tip2,
            }}
          >
            先看案例，再一起寫 →
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 4: Verify lint and S05 renders**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page2-UserStory .renders/ch3-page2-s05-cards.png --frame=500 --scale=0.25
npx.cmd remotion still Ch3-Page2-UserStory .renders/ch3-page2-s05-tip.png --frame=700 --scale=0.25
```

Expected:

- ESLint + tsc exit 0.
- Frame 500 shows all three cards in a row — `身為一位「角色」👤`, `我想要「需求」🎯`, `為了「價值」⭐` — with each value (`角色`/`需求`/`價值`) in yellow, no clipping at 1920 × 1080.
- Frame 700 shows the three cards shrunk and shifted up, with the tip `先看案例，再一起寫 →` in blue below them.

### Task 3: Sync the storyboard progress table and run final regression

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` (page-2 row)
- Verify: `src/scenes/03-程式實作/Ch3Page2UserStory.tsx`, `src/Root.tsx`

**Interfaces:**
- Consumes: the completed `Ch3-Page2-UserStory` composition and all verification renders.
- Produces: a clean implementation with an up-to-date progress table.

- [ ] **Step 1: Mark page 2 complete in the storyboard progress table**

In `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`, change the page-2 row status from `⏳ 待製作` to `✅ 已完成`:

```text
| 2 | `Ch3-Page2-UserStory` | S04–S05 | User Story 定義與格式 | SVG 圖示 | ✅ 已完成 |
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

- ESLint + tsc exit 0.
- `git diff --check` reports no whitespace errors.
- Status shows only the new Page 2 component, `Root.tsx`, the chapter-3 storyboard document, and this plan document.

- [ ] **Step 3: Inspect the keyframes and remove temporary renders**

Open the generated `.renders/ch3-page2-*.png` files and confirm: no clipping at 1920 × 1080; S04 shows only the title and the definition line with `使用者的需求` in yellow; S05 values `角色`/`需求`/`價值` are yellow and the cards entered sequentially. Then delete only the generated `.renders/ch3-page2-*.png` files (resolve each path and confirm it is under the repository `.renders` directory before removal).

- [ ] **Step 4: Report implementation for review**

Provide the composition ID (`Ch3-Page2-UserStory`), the implemented shot range (S04–S05), the duration (720 frames), the verification result, and any intentional timing adjustments. Do not commit until the user has reviewed the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S04 minimal definition (title spring → definition line with yellow key span, nothing else) → Task 1; S05 three sequential format cards with yellow values + end shrink/rise + blue tip → Task 2; storyboard progress sync → Task 3. Composition registration (720 frames) → Task 1.
- **Placeholder scan:** No TBD/TODO; every code step contains complete JSX/constants.
- **Type consistency:** `STORY_CARDS` shape, the timeline constants (`A_OUT` in Task 1; `B_IN`/`SHRINK`/`TIP2_IN`/`CARD_FIRST`/`CARD_STEP`/`EASE` in Task 2), and the `clamp` (Task 1) / `ease` (Task 2) helpers are each defined before use. Task 2 adds the `Easing`/`BLUE`/`CARD_BORDER`/`withAlpha` imports exactly where it first uses them, keeping lint green per task.
