# Chapter 2 Page 7 S18–S20 Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revise `Ch2-Page7-Storyboard` S18–S20 to match the updated storyboard document: S13-style concept introduction, three full-screen storyboard examples, and a white-background conclusion emphasizing that teammates must understand the storyboard.

**Architecture:** Keep the existing 1470-frame Page 7 composition and the current shot boundaries. Replace the S18 panel illustration and S19 material wall with a text-led intro and one reusable full-screen image component; replace the old S20 image-detail sequence with a conclusion card. Preserve S21–S22 content and timing, changing only S21's first card entrance so it no longer depends on S20 ending with a full-screen image.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Img`, `interpolate`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens.

## Global Constraints

- Modify only `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`.
- Do not modify `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`; it contains unrelated user changes.
- Keep `Ch2-Page7-Storyboard` at 1470 frames, 30 fps, 1920 × 1080.
- Keep shot boundaries unchanged: S18 `0–239`, S19 `240–509`, S20 `510–719`, S21 `720–1199`, S22 `1200–1469`.
- S18 copy must be:
  - Title: `Storyboard`
  - Definition: `Storyboard（分鏡圖）是用連續畫面，預演遊戲玩法與關卡設計的工具。`
  - Prompt: `一起看幾個案例`
- S19 must show all three existing images in order with no title, stamp, caption, card border, or additional decoration.
- S19 must prioritize complete image content. Use a blurred cover image as the background and a contain-fit image in the foreground when the source ratio does not match 16:9.
- S20 copy must be:
  - Main line: `分鏡圖的形式很多元`
  - Emphasis line: `其他夥伴要看得懂`
- Keep the emphasis line yellow and visually dominant.
- Use only frame-driven Remotion animation. Do not add CSS transitions or CSS animations.
- Do not change the source image files.
- Do not commit after implementation unless the user explicitly asks.

---

### Task 1: Simplify Page 7 helpers and timing constants

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:25-210`

**Interfaces:**
- Removes: `StoryboardPanel`, `SampleCard`, `SampleCardProps`, `PANEL_START`, `SAMPLE_START`, and `panelProgress`.
- Produces:

```tsx
type FullscreenStoryboardImageProps = {
  src: string;
  opacity: number;
  scale: number;
  objectPosition?: string;
};
```

- [ ] **Step 1: Update the scene comments and imports**

Change the shot comments to:

```tsx
//   S18：Storyboard 定義與案例提示
//   S19：三張真實分鏡案例滿版播放
//   S20：形式多元，但夥伴看得懂最重要
```

Import `CHIP_BG` from `../../theme/colors` for the S18 prompt pill. Remove color imports that become unused after deleting the old S18 panel and S19 material-wall helpers.

- [ ] **Step 2: Replace obsolete timing constants**

Keep:

```tsx
const S19_START = 240;
const S20_START = 510;
const S21_START = 720;
const S22_START = 1200;
```

Add exact S19 timing data:

```tsx
const STORYBOARD_SAMPLES = [
  {
    src: "02-遊戲設計/storyboard-sample-1.png",
    fadeIn: [240, 258],
    fadeOut: [316, 334],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-2.png",
    fadeIn: [316, 334],
    fadeOut: [400, 418],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-3.png",
    fadeIn: [400, 418],
    fadeOut: [492, 516],
    objectPosition: "center 18%",
  },
] as const;
```

This gives each image roughly 2–2.5 seconds of readable screen time and creates 18-frame crossfades without a blank frame.

- [ ] **Step 3: Add the full-screen image component**

Implement `FullscreenStoryboardImage` with two `<Img>` layers:

```tsx
<AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: WHITE }}>
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      inset: -30,
      width: "calc(100% + 60px)",
      height: "calc(100% + 60px)",
      objectFit: "cover",
      objectPosition,
      filter: "blur(22px)",
      opacity: 0.18,
      transform: `scale(${scale * 1.04})`,
    }}
  />
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition,
      transform: `scale(${scale})`,
    }}
  />
</AbsoluteFill>
```

Do not add borders, rounded cards, shadows, text, or a stamp.

- [ ] **Step 4: Verify the file compiles after helper replacement**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit with code 0; no unused imports or obsolete helper references remain.

### Task 2: Rebuild S18 using the S13 concept-introduction pattern

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:363-515`

**Interfaces:**
- Consumes: `CHIP_BG`, `TEXT_DARK`, `SUBTLE`, `WHITE`, `YELLOW`.
- Produces: title, definition, and prompt layers for frames `0–239`.

- [ ] **Step 1: Define S18 animation progress**

Use:

```tsx
const s18Out = interpolate(frame, [214, 240], [1, 0], clamp);
const introTitle = spring({
  frame,
  fps,
  config: { damping: 14, stiffness: 110 },
});
const definitionOpacity = interpolate(frame, [36, 68], [0, 1], clamp);
const promptOpacity = interpolate(frame, [104, 130], [0, 1], clamp);
const promptY = interpolate(frame, [104, 130], [28, 0], {
  ...clamp,
  easing: SOFT_EASE,
});
```

Remove the old three-panel progress calculations and `introScale`.

- [ ] **Step 2: Replace the S18 JSX**

Center the content vertically and match the established S13 hierarchy:

```tsx
<AbsoluteFill
  style={{
    opacity: s18Out,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <div
    style={{
      fontSize: 104,
      fontWeight: 800,
      letterSpacing: 8,
      color: TEXT_DARK,
      opacity: introTitle,
      transform: `scale(${interpolate(introTitle, [0, 1], [0.92, 1])})`,
    }}
  >
    Storyboard
  </div>

  <div
    style={{
      marginTop: 56,
      maxWidth: 1500,
      textAlign: "center",
      fontSize: 48,
      fontWeight: 500,
      lineHeight: 1.55,
      letterSpacing: 2,
      color: SUBTLE,
      opacity: definitionOpacity,
    }}
  >
    Storyboard（分鏡圖）是用
    <span style={{ color: YELLOW, fontWeight: 800 }}>連續畫面</span>
    ，預演遊戲玩法與關卡設計的工具。
  </div>

  <div
    style={{
      marginTop: 58,
      padding: "18px 44px",
      borderRadius: 999,
      backgroundColor: CHIP_BG,
      color: TEXT_DARK,
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: 2,
      opacity: promptOpacity,
      transform: `translateY(${promptY}px)`,
    }}
  >
    一起看幾個案例
  </div>
</AbsoluteFill>
```

The title must enter before the definition; the prompt must enter last.

- [ ] **Step 3: Render S18 checkpoints**

Run:

```powershell
New-Item -ItemType Directory -Force '.renders' | Out-Null
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s18-title.png --frame=24 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s18-definition.png --frame=82 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s18-final.png --frame=160 --scale=0.25
```

Expected:

- Frame 24 shows only the title entering.
- Frame 82 shows the title and readable definition.
- Frame 160 shows all three hierarchy levels with no clipping.

### Task 3: Replace S19 with three full-screen image crossfades

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:379-403`
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:516-596`

**Interfaces:**
- Consumes: `STORYBOARD_SAMPLES` and `FullscreenStoryboardImage`.
- Produces: three image layers covering frames `240–515`.

- [ ] **Step 1: Calculate opacity and subtle scale per sample**

For each sample:

```tsx
const opacity =
  interpolate(frame, sample.fadeIn, [0, 1], clamp) *
  interpolate(frame, sample.fadeOut, [1, 0], clamp);

const scale = interpolate(
  frame,
  [sample.fadeIn[0], sample.fadeOut[1]],
  [1, 1.025],
  clamp,
);
```

The scale is intentionally subtle; S19 should feel like normal-speed viewing, not a dramatic Ken Burns sequence.

- [ ] **Step 2: Replace the material wall**

Delete:

- The title `形式多元・無固定格式`.
- All three `SampleCard` instances.
- The `看得懂最重要` stamp.
- `s19TitleOpacity`, `s19TitleY`, and `stampProgress`.

Render:

```tsx
{frame >= S19_START && frame < 516 && (
  <AbsoluteFill>
    {STORYBOARD_SAMPLES.map((sample) => (
      <FullscreenStoryboardImage
        key={sample.src}
        src={sample.src}
        opacity={
          interpolate(frame, sample.fadeIn, [0, 1], clamp) *
          interpolate(frame, sample.fadeOut, [1, 0], clamp)
        }
        scale={interpolate(
          frame,
          [sample.fadeIn[0], sample.fadeOut[1]],
          [1, 1.025],
          clamp,
        )}
        objectPosition={sample.objectPosition}
      />
    ))}
  </AbsoluteFill>
)}
```

- [ ] **Step 3: Render all samples and crossfades**

Run:

```powershell
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s19-sample1.png --frame=280 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s19-crossfade12.png --frame=325 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s19-sample2.png --frame=365 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s19-crossfade23.png --frame=409 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s19-sample3.png --frame=455 --scale=0.25
```

Expected:

- All three images retain their complete storyboard content.
- Crossfade frames contain no white flash.
- No title, border, stamp, or extra text appears.
- The blurred background fills unused space without competing with the foreground image.

### Task 4: Replace S20 with the conclusion and decouple S21 entry

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:393-414`
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx:597-668`

**Interfaces:**
- Produces: S20 white-background conclusion for frames `510–719`.
- Preserves: S21 avatar, connection-line, speech-bubble, confirmation, and consensus timings.
- Changes: S21 central board card entrance only.

- [ ] **Step 1: Define the S20 conclusion timing**

Use:

```tsx
const s20Opacity =
  interpolate(frame, [510, 534], [0, 1], clamp) *
  interpolate(frame, [690, 720], [1, 0], clamp);
const conclusionMainOpacity = interpolate(frame, [548, 578], [0, 1], clamp);
const conclusionMainY = interpolate(frame, [548, 578], [22, 0], {
  ...clamp,
  easing: SOFT_EASE,
});
const conclusionKeyOpacity = interpolate(frame, [602, 634], [0, 1], clamp);
const conclusionKeyY = interpolate(frame, [602, 634], [30, 0], {
  ...clamp,
  easing: SOFT_EASE,
});
```

The overlap from frames `510–516` lets the last S19 image finish fading while the white conclusion layer begins entering.

- [ ] **Step 2: Replace the S20 image-detail viewport**

Delete:

- `sample1Opacity`
- `sample3Opacity`
- `sample1Scale`
- `sample3Scale`
- The 1500 × 760 image viewport and both S20 `<Img>` elements

Render a centered text conclusion:

```tsx
{frame >= S20_START && frame < S21_START && (
  <AbsoluteFill
    style={{
      opacity: s20Opacity,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: WHITE,
    }}
  >
    <div
      style={{
        fontSize: 58,
        fontWeight: 700,
        letterSpacing: 4,
        color: TEXT_DARK,
        opacity: conclusionMainOpacity,
        transform: `translateY(${conclusionMainY}px)`,
      }}
    >
      分鏡圖的形式很多元
    </div>
    <div
      style={{
        marginTop: 48,
        fontSize: 84,
        fontWeight: 900,
        letterSpacing: 6,
        color: YELLOW,
        opacity: conclusionKeyOpacity,
        transform: `translateY(${conclusionKeyY}px)`,
      }}
    >
      其他夥伴要看得懂
    </div>
  </AbsoluteFill>
)}
```

- [ ] **Step 3: Make S21 enter independently**

The current `boardTransition` assumes sample 3 is already full-screen at frame 720. Replace the geometry interpolation with a centered-card entrance:

```tsx
const boardEntrance = interpolate(frame, [720, 758], [0, 1], {
  ...clamp,
  easing: SOFT_EASE,
});
```

Use fixed geometry:

```tsx
left: 650,
top: 286,
width: 620,
height: 350,
opacity: boardEntrance,
transform: `translateY(${interpolate(
  boardEntrance,
  [0, 1],
  [28, 0],
)}px) scale(${interpolate(boardEntrance, [0, 1], [0.94, 1])})`,
```

Keep the sample 3 image inside the card, but remove the scale expression tied to the old full-screen transition. Do not change `AVATAR_START`, `LINE_START`, speech bubble starts, checkmark timing, or consensus timing.

- [ ] **Step 4: Render S20 and the S20–S21 transition**

Run:

```powershell
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s20-main.png --frame=585 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s20-final.png --frame=660 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s20-s21-transition.png --frame=730 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s21-stable.png --frame=780 --scale=0.25
```

Expected:

- Frame 585 shows the main conclusion before the emphasis is fully established.
- Frame 660 clearly prioritizes the yellow phrase.
- Frame 730 contains no leftover S20 text and shows the S21 card entering cleanly.
- Frame 780 preserves the existing S21 layout and later animation sequence.

### Task 5: Regression verification and cleanup

**Files:**
- Verify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`
- Do not modify: `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`

**Interfaces:**
- Consumes: completed S18–S20 revision.
- Produces: a verified working tree ready for user review.

- [ ] **Step 1: Run static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit with code 0.
- `git diff --check` reports no whitespace errors.
- The existing Page 4 modification remains untouched.
- No source file other than `Ch2Page7Storyboard.tsx` is newly modified by implementation.

- [ ] **Step 2: Check late-scene regression**

Render:

```powershell
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s21-confirm.png --frame=1150 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-revision-s22-final.png --frame=1450 --scale=0.25
```

Expected:

- S21 still shows the confirmation check, `想像一致`, and `凝聚團隊共識`.
- S22 still shows all four cards with `夥伴看得懂` as the final yellow focus.

- [ ] **Step 3: Remove temporary renders safely**

Resolve `.renders` to an absolute path, confirm each generated filename begins with `page7-revision-`, and delete only those PNG files. Remove `.renders` only if it is empty afterward.

- [ ] **Step 4: Report for user review**

Report:

- S18 title/definition/prompt hierarchy
- S19 three-image timing and crossfade behavior
- S20 conclusion hierarchy
- S21 entry adjustment
- lint and visual verification results

Do not commit until the user has reviewed the revised animation or explicitly requests a commit.
