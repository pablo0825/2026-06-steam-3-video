# Ch3 Page 3 Rhythm Doctor (S06–S07) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 28-second transparent alpha overlay `Ch3-Page3-RhythmDoctor-Overlay` (and its Studio guide composition `Ch3-Page3-RhythmDoctor`) for S06–S07 of 第 3 集「程式實作」, presenting a Rhythm Doctor title and a filled-in User Story over externally-composited gameplay.

**Architecture:** Mirror the chapter-2 overlay workflow. `Ch3Page3RhythmDoctorOverlay` is a transparent (no root background) Remotion component holding all graphics: S06 is a centered radial-glow title group; S07 is a semi-transparent black veil with a top beat accent and three filled-in User Story rows below. A thin guide composition `Ch3Page3RhythmDoctor` renders the shared `GameplayPlaceholder` full-screen with the overlay on top so it can be previewed in Studio; the real Rhythm Doctor footage sits on the lower DaVinci Resolve track. `Root.tsx` registers the guide and an alpha (ProRes 4444) overlay via the existing `calculateAlphaOverlayMetadata`.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens from `src/theme/colors.ts`, the existing `GameplayPlaceholder` component. No image/video assets in Remotion.

## Global Constraints

- Composition IDs are exactly `Ch3-Page3-RhythmDoctor` (guide) and `Ch3-Page3-RhythmDoctor-Overlay` (alpha export).
- Both compositions are exactly 840 frames at 30 fps, 1920 × 1080 (S06 8s + S07 20s = 28s).
- Shot boundaries are S06 `0–240`, S07 `240–840`.
- The overlay's root `AbsoluteFill` has NO `backgroundColor` (transparent), so alpha is preserved for the editor. Only the S07 veil paints pixels across the frame.
- Use only frame-driven Remotion animation (`interpolate`/`spring`); no CSS transitions, CSS animations, or Tailwind animation classes.
- Theme tokens used: `BLACK`, `WHITE`, `YELLOW`, `withAlpha`.
- S06 title group copy: eyebrow `User Story 案例` (yellow), main `節奏醫生` (white), subtitle `Rhythm Doctor` (white 78%), plus a short yellow rule, all over a localized radial dark glow; fades in, holds, fades out to clean gameplay.
- S07 veil is `BLACK` at peak opacity `0.6`. The top beat accent shows `核心玩法` + seven dots (the 7th highlighted yellow) + a `Space` keycap. The lower block shows heading `寫成 User Story` and three rows: tag `身為一位` value `玩家`; tag `我想要` value `在第七拍按下空白鍵` (`第七拍`/`空白鍵` yellow); tag `為了` value `配合節奏救活病人，完成關卡`.
- All S07 graphics fade out together over frames `810–840` for a clean handoff.
- All on-video text carries a `textShadow` for legibility.
- Each task imports only what it uses so `npm run lint` passes at the end of every task.

---

### Task 1: Create the overlay with S06 title, the guide, and register both compositions

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay.tsx`
- Create: `src/scenes/03-程式實作/Ch3Page3RhythmDoctor.tsx`
- Modify: `src/Root.tsx` (two imports after the `Ch3Page2UserStory` import; two `<Composition>` blocks after the `Ch3-Page2-UserStory` block)

**Interfaces:**
- Consumes: theme `BLACK`, `WHITE`, `YELLOW`, `withAlpha`; the existing `GameplayPlaceholder` at `src/scenes/02-遊戲設計/GameplayPlaceholder.tsx` with props `{ title: string; subtitle: string; icon: string }`; the existing `calculateAlphaOverlayMetadata` already defined at the top of `src/Root.tsx`.
- Produces: named components `Ch3Page3RhythmDoctorOverlay` and `Ch3Page3RhythmDoctor`. Task 2 adds the S07 veil + beat accent into the first marked slot; Task 3 adds the S07 rows into the second slot and the `spring`/`useVideoConfig` imports and `KEY` constant it needs.

- [x] **Step 1: Create the overlay component with S06 only**

Create `src/scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay.tsx` with exactly:

```tsx
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BLACK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 3 集・第 3 頁 透明 Overlay（節奏醫生）— 真實 gameplay 由剪輯軟體放下層
//   S06（0–240）：放射柔光 ＋ 置中標題群組（User Story 案例／節奏醫生／Rhythm Doctor／黃線）
//   S07（240–840）：半透明黑遮罩 ＋ 上方節拍點綴 ＋ 下方填好的 User Story 三列

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: EASE };

// ── S06 標題 ──
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;

export const Ch3Page3RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // ── S06 ──
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* ── S06：標題 ── */}
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
              User Story 案例
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
              節奏醫生
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
              Rhythm Doctor
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

      {/* ── S07：半透明黑 ＋ 節拍點綴 ── (added in Task 2) */}

      {/* ── S07：User Story 三列 ── (added in Task 3) */}
    </AbsoluteFill>
  );
};
```

- [x] **Step 2: Create the Studio guide composition**

Create `src/scenes/03-程式實作/Ch3Page3RhythmDoctor.tsx` with exactly:

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { Ch3Page3RhythmDoctorOverlay } from "./Ch3Page3RhythmDoctorOverlay";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";

// Studio 預覽版：全螢幕暫代素材模擬 DaVinci 中的節奏醫生 gameplay，疊上透明 Overlay
export const Ch3Page3RhythmDoctor: React.FC = () => {
  return (
    <AbsoluteFill>
      <GameplayPlaceholder
        icon="🎵"
        title="節奏醫生"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page3RhythmDoctorOverlay />
    </AbsoluteFill>
  );
};
```

- [x] **Step 3: Register both compositions in `Root.tsx`**

Add these imports immediately after `import { Ch3Page2UserStory } from "./scenes/03-程式實作/Ch3Page2UserStory";`:

```tsx
import { Ch3Page3RhythmDoctor } from "./scenes/03-程式實作/Ch3Page3RhythmDoctor";
import { Ch3Page3RhythmDoctorOverlay } from "./scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay";
```

Add these two `<Composition>` blocks immediately after the closing `/>` of the `Ch3-Page2-UserStory` composition block (note the overlay reuses the existing `calculateAlphaOverlayMetadata` function already defined at the top of the file):

```tsx
      <Composition
        id="Ch3-Page3-RhythmDoctor"
        component={Ch3Page3RhythmDoctor}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page3-RhythmDoctor-Overlay"
        component={Ch3Page3RhythmDoctorOverlay}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
```

- [x] **Step 4: Verify lint and S06 renders**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page3-RhythmDoctor .renders/ch3-page3-s06-title.png --frame=90 --scale=0.25
npx.cmd remotion still Ch3-Page3-RhythmDoctor .renders/ch3-page3-s06-clean.png --frame=232 --scale=0.25
```

Expected:

- ESLint + tsc exit 0.
- Frame 90 (guide) shows the gameplay placeholder behind a soft dark radial glow and the centered title group: yellow `User Story 案例`, white `節奏醫生`, `Rhythm Doctor`, and the yellow rule.
- Frame 232 (guide) shows the placeholder with the title fully gone (overlay transparent there — only the placeholder is visible).

### Task 2: Add the S07 veil and beat accent

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay.tsx`

**Interfaces:**
- Consumes: `frame`, `clamp`, `ease`, theme `BLACK`, `WHITE`, `YELLOW`, `withAlpha` (all already imported in Task 1).
- Produces: the S07 veil + top beat accent, plus the `infoOut` value (the shared end fade-out) that Task 3's rows also multiply into their opacity.

- [x] **Step 1: Add the S07 veil/beat constants**

Below the `TITLE_OUT` constant (module level), add:

```tsx
// ── S07 半透明黑 ＋ 節拍點綴 ──
const VEIL_IN = [248, 276] as const; // 遮罩淡入到 0.6
const VEIL_OUT = [810, 840] as const; // 結尾整體淡出
const BEAT_LABEL_IN = [270, 300] as const;
const DOT_FIRST = 300; // 第 1 顆圓點亮起
const DOT_STEP = 9; // 每顆間隔（1→7 共約 54 frames）
const SPACE_PRESS = [348, 372] as const; // 第 7 拍空白鍵輕按
const BEAT_DOTS = [0, 1, 2, 3, 4, 5, 6] as const; // 7 顆，index 6 ＝ 第七拍
```

- [x] **Step 2: Add the S07 shared computations**

Inside the component body, after the `const glowOpacity = ...` line (end of the S06 block), add:

```tsx
  // ── S07 共用 ──
  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const beatLabelIn = interpolate(frame, BEAT_LABEL_IN, [0, 1], ease);
  const spacePress = interpolate(frame, SPACE_PRESS, [0, 1], clamp);
  const spaceDown = Math.sin(Math.min(spacePress, 1) * Math.PI) * 6; // 0→6→0 px 單次下壓
```

- [x] **Step 3: Render the veil and beat accent**

Replace the placeholder line `{/* ── S07：半透明黑 ＋ 節拍點綴 ── (added in Task 2) */}` with:

```tsx
      {/* ── S07：半透明黑 ＋ 節拍點綴 ── */}
      {frame >= 240 && (
        <>
          <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 300,
              transform: "translate(-50%, -50%)",
              opacity: beatLabelIn * infoOut,
              display: "flex",
              alignItems: "center",
              gap: 26,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 4,
                color: YELLOW,
              }}
            >
              核心玩法
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {BEAT_DOTS.map((d) => {
                const lit = interpolate(
                  frame,
                  [DOT_FIRST + d * DOT_STEP, DOT_FIRST + d * DOT_STEP + 12],
                  [0, 1],
                  clamp,
                );
                const isSeven = d === 6;
                return (
                  <div key={d} style={{ position: "relative", width: 26, height: 26 }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: withAlpha(WHITE, isSeven ? 0.3 : 0.3 + lit * 0.5),
                      }}
                    />
                    {isSeven && (
                      <div
                        style={{
                          position: "absolute",
                          inset: -3,
                          borderRadius: "50%",
                          background: YELLOW,
                          opacity: lit,
                          boxShadow: `0 0 ${20 * lit}px ${withAlpha(YELLOW, 0.7 * lit)}`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginLeft: 6,
                padding: "10px 26px",
                borderRadius: 12,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 2,
                color: WHITE,
                background: withAlpha(WHITE, 0.12),
                border: `2px solid ${withAlpha(WHITE, 0.42)}`,
                transform: `translateY(${spaceDown}px)`,
              }}
            >
              Space
            </div>
          </div>
        </>
      )}
```

- [x] **Step 4: Verify lint and the beat accent render**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page3-RhythmDoctor .renders/ch3-page3-s07-beat.png --frame=380 --scale=0.25
```

Expected:

- ESLint + tsc exit 0.
- Frame 380 (guide) shows the placeholder dimmed by the black veil, with the top accent: `核心玩法`, seven dots where the 7th is a glowing yellow dot, and the `Space` keycap.

### Task 3: Add the S07 heading and the filled User Story rows

**Files:**
- Modify: `src/scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay.tsx`

**Interfaces:**
- Consumes: `frame`, `clamp`, `ease`, `infoOut` (from Task 2), theme `WHITE`, `YELLOW`, `withAlpha`, plus the newly added `spring`, `useVideoConfig`, and the `KEY` style.
- Produces: the completed two-shot overlay.

- [x] **Step 1: Add `spring` and `useVideoConfig` to the remotion import**

Update the remotion import block to read exactly:

```tsx
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
```

- [x] **Step 2: Add the `KEY` style and the row constants**

Below the `ease` constant (module level), add:

```tsx
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };
```

Below the `BEAT_DOTS` constant (module level), add:

```tsx
// ── S07 User Story 三列 ──
const US_HEADING_IN = [470, 500] as const;
const ROW_START = [500, 560, 620] as const;
const STORY_ROWS: { tag: string; node: React.ReactNode }[] = [
  { tag: "身為一位", node: <>玩家</> },
  {
    tag: "我想要",
    node: (
      <>
        在<span style={KEY}>第七拍</span>按下<span style={KEY}>空白鍵</span>
      </>
    ),
  },
  { tag: "為了", node: <>配合節奏救活病人，完成關卡</> },
];
```

- [x] **Step 3: Add the heading computation and read `fps`**

Inside the component body, change the first line from:

```tsx
  const frame = useCurrentFrame();
```

to:

```tsx
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
```

Then, after the `const spaceDown = ...` line (end of the Task 2 block), add:

```tsx
  const headingIn = interpolate(frame, US_HEADING_IN, [0, 1], ease);
```

- [x] **Step 4: Render the heading and rows**

Replace the placeholder line `{/* ── S07：User Story 三列 ── (added in Task 3) */}` with:

```tsx
      {/* ── S07：User Story 三列 ── */}
      {frame >= 240 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 430,
              transform: `translate(-50%, ${interpolate(headingIn, [0, 1], [16, 0])}px)`,
              opacity: headingIn * infoOut,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 4,
              color: WHITE,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
              whiteSpace: "nowrap",
            }}
          >
            寫成 <span style={{ color: YELLOW }}>User Story</span>
          </div>

          {STORY_ROWS.map((r, i) => {
            const p = spring({
              frame: frame - ROW_START[i],
              fps,
              config: { damping: 18, stiffness: 120, overshootClamping: true },
            });
            const y = 540 + i * 100;
            return (
              <div
                key={r.tag}
                style={{
                  position: "absolute",
                  left: 960,
                  top: y,
                  width: 1080,
                  transform: `translate(-50%, -50%) translateY(${interpolate(p, [0, 1], [28, 0])}px)`,
                  opacity: p * infoOut,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
                }}
              >
                <div
                  style={{
                    width: 200,
                    flexShrink: 0,
                    textAlign: "center",
                    padding: "14px 0",
                    borderRadius: 14,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: YELLOW,
                    background: withAlpha(WHITE, 0.12),
                    border: `1px solid ${withAlpha(WHITE, 0.34)}`,
                  }}
                >
                  {r.tag}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: WHITE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.node}
                </div>
              </div>
            );
          })}
        </>
      )}
```

- [x] **Step 5: Verify lint and the full S07 render**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page3-RhythmDoctor .renders/ch3-page3-s07-full.png --frame=700 --scale=0.25
npx.cmd remotion still Ch3-Page3-RhythmDoctor .renders/ch3-page3-s07-end.png --frame=830 --scale=0.25
```

Expected:

- ESLint + tsc exit 0.
- Frame 700 (guide) shows: the dark veil, the top beat accent, the heading `寫成 User Story`, and the three rows — `身為一位｜玩家`, `我想要｜在第七拍按下空白鍵` (第七拍/空白鍵 yellow), `為了｜配合節奏救活病人，完成關卡` — with the tag chips left-aligned.
- Frame 830 (guide) shows the veil and all S07 info nearly faded out (clean handoff), leaving mostly the placeholder.

### Task 4: Update the storyboard document and run final regression

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` (page-3 progress row + the S07 row description)
- Verify: `src/scenes/03-程式實作/Ch3Page3RhythmDoctorOverlay.tsx`, `src/scenes/03-程式實作/Ch3Page3RhythmDoctor.tsx`, `src/Root.tsx`

**Interfaces:**
- Consumes: the completed compositions and all verification renders.
- Produces: a clean implementation with an accurate storyboard.

- [x] **Step 1: Mark page 3 complete and note the overlay in the progress table**

In `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`, change the page-3 progress-table row status from `⏳ 待製作` to `✅ 已完成`:

```text
| 3 | `Ch3-Page3-RhythmDoctor` | S06–S07 | Rhythm Doctor 影片與 User Story 範例 | 遊戲影片、透明 Overlay | ✅ 已完成 |
```

Do not change any other progress-table row.

- [x] **Step 2: Replace the S07 row description with the overlay design**

In the page-3 scene table, the S07 row currently describes shrinking the video to the left with a User Story card on the right. Replace that row's 畫面 and 動態 cells so they read:

- 畫面: `影片維持滿版、上方蓋半透明黑遮罩；上方節拍點綴（核心玩法：1～7 圓點、第 7 拍黃色高亮＋空白鍵）；下方標題「寫成 User Story」＋三列：身為一位 玩家／我想要 在第七拍按下空白鍵／為了 配合節奏救活病人，完成關卡。`
- 動態: `遮罩淡入 → 節拍圓點依序亮起、第 7 拍高亮、空白鍵輕按 → 「寫成 User Story」升入 → 三列依序浮入（無回彈）→ 結尾整體淡出。`

Keep the S07 旁白, 秒數, and 呈現 columns unchanged. (S06's row already describes a title overlay over full-screen video and needs no change beyond what is already written.)

- [x] **Step 3: Run final static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint + tsc exit 0.
- `git diff --check` reports no whitespace errors.
- Status shows only the two new Page 3 components, `Root.tsx`, the chapter-3 storyboard document, and this plan document.

- [x] **Step 4: Inspect keyframes and remove temporary renders**

Open the generated `.renders/ch3-page3-*.png` files and confirm: S06 title is legible over the placeholder; frame 232 is clean (overlay transparent); S07 veil dims the placeholder; the 7th beat dot is the only yellow dot; the three rows are left-aligned and the yellow keywords are correct. Then delete only the generated `.renders/ch3-page3-*.png` files (resolve each path and confirm it is under the repository `.renders` directory before removal).

- [x] **Step 5: Report implementation for review**

Provide the composition IDs (`Ch3-Page3-RhythmDoctor`, `Ch3-Page3-RhythmDoctor-Overlay`), the implemented shot range (S06–S07), the duration (840 frames), the verification result, and a note that the overlay root stays transparent (alpha preserved) so the editor composites it over the real footage. Do not commit until the user has reviewed the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S06 radial-glow title group → Task 1; transparent root + guide + both registrations (incl. alpha metadata) → Task 1; S07 veil + beat accent (核心玩法, 1–7 dots with yellow 7th, Space keycap) → Task 2; S07 heading + three filled User Story rows + shared end fade → Tasks 2–3; storyboard sync + S07 rewrite → Task 4.
- **Placeholder scan:** No TBD/TODO; every code step contains complete JSX/constants.
- **Type consistency:** `BEAT_DOTS`/`STORY_ROWS` shapes and the timeline constants (`GLOW_IN`/`TITLE_IN`/`TITLE_OUT` in Task 1; `VEIL_IN`/`VEIL_OUT`/`BEAT_LABEL_IN`/`DOT_FIRST`/`DOT_STEP`/`SPACE_PRESS` in Task 2; `US_HEADING_IN`/`ROW_START` in Task 3) are each defined before use. `infoOut` is defined in Task 2 and consumed by Task 3. `spring`/`useVideoConfig`/`KEY` are added in Task 3 exactly where first used, keeping lint green per task. Row springs use `overshootClamping: true` so the rows do not rebound (consistent with the earlier S03 fix).
