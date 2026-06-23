# Ch3 Page 4 Context (S08–S09) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 23-second `Ch3-Page4-Context` Remotion composition for S08–S09, introducing Context with the same minimal definition style as S04 and then visually demonstrating limited capacity, new information entering, and old information leaving.

**Architecture:** Create one frame-driven component, `Ch3Page4Context`, with two exclusive shots. S08 uses the existing chapter-3 white-background definition language without illustrative avatars or floating cards; S09 replaces the removed bookshelf analogy with a direct queue/container animation that fully explains Context capacity. Register one 690-frame composition in `Root.tsx`.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), shared tokens from `src/theme/colors.ts`.

## Global Constraints

- Composition ID is exactly `Ch3-Page4-Context`.
- Composition is exactly 690 frames at 30 fps, 1920 × 1080.
- Shot boundaries are S08 `0–240` and S09 `240–690`.
- S08 contains only title `Context` and definition `Context 是 AI 的短期記憶，我們和 AI 的對話，會暫時存在 Context 裡`; `短期記憶` and `暫時存在` are yellow.
- S08 follows S04's white background, centered typography, title spring, definition fade, and clean fade-out.
- Do not render an AI avatar, memory circle, floating conversation cards, bookshelf, books, or external image assets.
- S09 directly communicates: finite capacity → conversation cards fill the container → a new card enters → the oldest card exits.
- S09 ends with `Context 有容量的限制，新資訊會逐漸取代舊資訊` and highlights `容量的限制` and `取代舊資訊` in yellow.
- Use only frame-driven Remotion animation; no CSS transitions, CSS animations, or Tailwind animation classes.
- Use theme tokens `WHITE`, `TEXT_DARK`, `SUBTLE`, `YELLOW`, `BLUE`, `CARD_BORDER`, and `withAlpha`.
- Do not modify the source transcript `docs/03-程式實作/逐字稿.txt`; the storyboard is the edited production source.

---

### Task 1: Create S08 minimal Context definition and register the composition

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page4Context.tsx`
- Modify: `src/Root.tsx`

**Interfaces:**
- Consumes: the S04 visual pattern in `src/scenes/03-程式實作/Ch3Page2UserStory.tsx`; theme exports `WHITE`, `TEXT_DARK`, `SUBTLE`, and `YELLOW`.
- Produces: named React component `Ch3Page4Context`, registered as composition `Ch3-Page4-Context`; Task 2 fills the marked S09 region in the same component.

- [x] **Step 1: Write a failing structural assertion for the Page 4 component**

Run:

```powershell
$p='src/scenes/03-程式實作/Ch3Page4Context.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page4Context.tsx does not exist'
  exit 1
}
```

Expected: exit 1 with `RED: Ch3Page4Context.tsx does not exist`.

- [x] **Step 2: Create `Ch3Page4Context.tsx` with S08 and an empty S09 region**

Create the file with:

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
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
} from "../../theme/colors";

// 第 3 集・第 4 頁：Context
//   S08（0–240）：極簡定義
//   S09（240–690）：容量裝滿 → 新資訊進入 → 舊資訊移出

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {
  ...clamp,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const S08_OUT = [212, 238] as const;
const DEFINITION_IN = [44, 68] as const;

export const Ch3Page4Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, DEFINITION_IN, [0, 1], ease);
  const s08Out = interpolate(frame, S08_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {frame < 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: s08Out,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: 3,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            Context
          </div>
          <div
            style={{
              marginTop: 44,
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: definitionIn,
              whiteSpace: "nowrap",
            }}
          >
            Context 是 AI 的
            <span style={{ color: YELLOW, fontWeight: 800 }}>短期記憶</span>
            ，我們和 AI 的對話，會
            <span style={{ color: YELLOW, fontWeight: 800 }}>暫時存在</span>
            {" "}Context 裡
          </div>
        </AbsoluteFill>
      )}

      {/* S09 capacity animation is added in Task 2. */}
    </AbsoluteFill>
  );
};
```

- [x] **Step 3: Register `Ch3-Page4-Context` in `Root.tsx`**

Add this import after the Page 3 imports:

```tsx
import { Ch3Page4Context } from "./scenes/03-程式實作/Ch3Page4Context";
```

Add this composition after `Ch3-Page3-RhythmDoctor-Overlay`:

```tsx
      <Composition
        id="Ch3-Page4-Context"
        component={Ch3Page4Context}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [x] **Step 4: Verify S08**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page4-Context .renders/ch3-page4-s08.png --frame=100 --scale=0.25
```

Expected:

- ESLint and TypeScript exit 0.
- Frame 100 has a white background, centered `Context`, and the complete definition sentence.
- Only `短期記憶` and `暫時存在` are yellow.
- No avatar, cards, container, or decorative illustration appears.

- [ ] **Step 5: Commit Task 1**

```powershell
git add -- 'src/scenes/03-程式實作/Ch3Page4Context.tsx' 'src/Root.tsx'
git commit -m "feat(ch3-p4): add minimal Context definition"
```

### Task 2: Add the S09 finite-capacity animation

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page4Context.tsx`

**Interfaces:**
- Consumes: `frame`, `fps`, `clamp`, `ease`, and the imported theme tokens from Task 1.
- Produces: the complete S09 animation and final warning statement.

> Final implementation note: the container is only the background frame. All information cards are absolutely positioned in the outer 1220px stage, so moving cards are not clipped by the container boundary. During one shared exchange interval, the oldest card crosses the left boundary, cards B–D move left by one complete slot, and the new card crosses in from offstage right to the fourth slot. The directional labels are removed because the movement communicates the flow directly. This supersedes the illustrative flex positioning and labels in Step 4.

- [x] **Step 1: Write a failing structural assertion for the S09 states**

Run:

```powershell
$p='src/scenes/03-程式實作/Ch3Page4Context.tsx'
$required=@('CONTEXT_ITEMS','NEW_ITEM_IN','OLD_ITEM_OUT','Context 有容量的限制，新資訊會逐漸取代舊資訊')
$missing=$required | Where-Object {
  -not (Select-String -LiteralPath $p -SimpleMatch $_ -Quiet)
}
if ($missing.Count -gt 0) {
  Write-Output ('RED: missing S09 structures: ' + ($missing -join ', '))
  exit 1
}
```

Expected: exit 1 listing the missing S09 structures.

- [x] **Step 2: Add S09 constants below `DEFINITION_IN`**

First, update the theme import to include the tokens used by S09:

```tsx
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

Then add:

```tsx
const S09_IN = [242, 270] as const;
const CONTAINER_IN = [260, 292] as const;
const ITEM_FIRST = 286;
const ITEM_STEP = 24;
const NEW_ITEM_IN = [426, 458] as const;
const OLD_ITEM_OUT = [458, 500] as const;
const WARNING_IN = [530, 566] as const;

const CONTEXT_ITEMS = [
  { id: "A", label: "前面的需求" },
  { id: "B", label: "功能規則" },
  { id: "C", label: "修改紀錄" },
  { id: "D", label: "目前問題" },
] as const;
```

- [x] **Step 3: Add S09 animation computations after `s08Out`**

```tsx
  const s09In = interpolate(frame, S09_IN, [0, 1], ease);
  const containerIn = interpolate(frame, CONTAINER_IN, [0, 1], ease);
  const newItemIn = interpolate(frame, NEW_ITEM_IN, [0, 1], ease);
  const oldItemOut = interpolate(frame, OLD_ITEM_OUT, [0, 1], ease);
  const warningIn = interpolate(frame, WARNING_IN, [0, 1], ease);
```

- [x] **Step 4: Replace the S09 placeholder with the complete capacity animation**

Replace `{/* S09 capacity animation is added in Task 2. */}` with:

```tsx
      {frame >= 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            paddingTop: 92,
            opacity: s09In,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: TEXT_DARK,
              letterSpacing: 2,
            }}
          >
            Context 的限制
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 62,
              width: 1220,
              height: 300,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 110,
                top: 0,
                width: 1000,
                height: 190,
                borderRadius: 28,
                border: `3px solid ${CARD_BORDER}`,
                backgroundColor: withAlpha(BLUE, 0.05),
                boxShadow: `0 18px 48px ${withAlpha(TEXT_DARK, 0.08)}`,
                opacity: containerIn,
                transform: `scaleX(${interpolate(containerIn, [0, 1], [0.94, 1])})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  top: 22,
                  fontSize: 24,
                  fontWeight: 800,
                  color: BLUE,
                  letterSpacing: 3,
                }}
              >
                CONTEXT
              </div>

              <div
                style={{
                  position: "absolute",
                  left: 28,
                  right: 28,
                  bottom: 28,
                  display: "flex",
                  gap: 18,
                }}
              >
                {CONTEXT_ITEMS.map((item, index) => {
                  const itemIn = interpolate(
                    frame,
                    [ITEM_FIRST + index * ITEM_STEP, ITEM_FIRST + index * ITEM_STEP + 20],
                    [0, 1],
                    ease,
                  );
                  const isOldest = index === 0;
                  const exitX = isOldest
                    ? interpolate(oldItemOut, [0, 1], [0, -230])
                    : 0;
                  const shiftX =
                    index > 0
                      ? interpolate(oldItemOut, [0, 1], [0, -46])
                      : 0;

                  return (
                    <div
                      key={item.id}
                      style={{
                        width: 218,
                        height: 82,
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: 800,
                        color: isOldest ? SUBTLE : TEXT_DARK,
                        backgroundColor: WHITE,
                        border: `2px solid ${CARD_BORDER}`,
                        opacity: itemIn * (isOldest ? 1 - oldItemOut : 1),
                        transform: `translateX(${exitX + shiftX}px) translateY(${interpolate(
                          itemIn,
                          [0, 1],
                          [24, 0],
                        )}px)`,
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}

                <div
                  style={{
                    width: 218,
                    height: 82,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: WHITE,
                    backgroundColor: BLUE,
                    opacity: newItemIn,
                    transform: `translateX(${interpolate(
                      newItemIn,
                      [0, 1],
                      [260, -46],
                    )}px)`,
                    boxShadow: `0 12px 28px ${withAlpha(BLUE, 0.22)}`,
                  }}
                >
                  新的資訊
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                top: 224,
                fontSize: 26,
                fontWeight: 800,
                color: SUBTLE,
                opacity: oldItemOut,
              }}
            >
              ← 舊資訊移出
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 224,
                fontSize: 26,
                fontWeight: 800,
                color: BLUE,
                opacity: newItemIn,
              }}
            >
              新資訊進入 →
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 42,
              fontWeight: 800,
              color: TEXT_DARK,
              opacity: warningIn,
              transform: `translateY(${interpolate(warningIn, [0, 1], [18, 0])}px)`,
            }}
          >
            Context 有
            <span style={{ color: YELLOW }}>容量的限制</span>
            ，新資訊會逐漸
            <span style={{ color: YELLOW }}>取代舊資訊</span>
          </div>
        </AbsoluteFill>
      )}
```

- [x] **Step 5: Verify S09 at three states**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page4-Context .renders/ch3-page4-s09-fill.png --frame=390 --scale=0.25
npx.cmd remotion still Ch3-Page4-Context .renders/ch3-page4-s09-replace.png --frame=500 --scale=0.25
npx.cmd remotion still Ch3-Page4-Context .renders/ch3-page4-s09-final.png --frame=600 --scale=0.25
```

Expected:

- Frame 390 shows the Context container filled with four existing information cards.
- Frame 500 shows the oldest card leaving left while `新的資訊` enters from the right.
- Frame 600 shows the stable replacement state and the final warning.
- No bookshelf, AI avatar, or floating decorative cards appear.
- ESLint and TypeScript exit 0.

- [ ] **Step 6: Commit Task 2**

```powershell
git add -- 'src/scenes/03-程式實作/Ch3Page4Context.tsx'
git commit -m "feat(ch3-p4): animate Context capacity limits"
```

### Task 3: Update production documentation and run final verification

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Verify: `src/scenes/03-程式實作/Ch3Page4Context.tsx`
- Verify: `src/Root.tsx`

**Interfaces:**
- Consumes: completed S08–S09 composition.
- Produces: accurate progress status and a clean implementation ready for visual review.

- [x] **Step 1: Mark Page 4 complete**

Change only the Page 4 progress row status:

```text
| 4 | `Ch3-Page4-Context` | S08–S09 | Context 定義與容量限制 | SVG 動畫 | ✅ 已完成 |
```

- [x] **Step 2: Run final static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit 0.
- No whitespace errors.
- Status contains only `Ch3Page4Context.tsx`, `Root.tsx`, the chapter-3 storyboard document, and this plan document, in addition to any changes that already existed before execution.

- [x] **Step 3: Inspect and safely remove Page 4 renders**

Inspect:

- `.renders/ch3-page4-s08.png`
- `.renders/ch3-page4-s09-fill.png`
- `.renders/ch3-page4-s09-replace.png`
- `.renders/ch3-page4-s09-final.png`

Confirm the S08 typography matches S04, the S09 motion reads left-to-right, no text clips, and the oldest/newest distinction is obvious. Resolve each file path, confirm it is inside the repository `.renders` directory, and remove only `.renders/ch3-page4-*.png`.

- [x] **Step 4: Report for review**

Report composition ID `Ch3-Page4-Context`, shots S08–S09, duration 690 frames, lint result, and visual verification result. Do not commit Task 3 or merge the branch until the user reviews the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S08 minimal S04-style definition is Task 1; S09 finite-capacity queue and final warning are Task 2; removal of S10/bookcase is already reflected in the production storyboard and enforced by Global Constraints; documentation status and final review are Task 3.
- **Placeholder scan:** No incomplete implementation instructions; the single S09 marker in Task 1 is explicitly replaced by complete code in Task 2.
- **Type consistency:** `Ch3Page4Context` is the exported component used by `Root.tsx`; all S09 constants and `CONTEXT_ITEMS` are defined before use; all imported theme tokens are used by the final Task 2 state.
