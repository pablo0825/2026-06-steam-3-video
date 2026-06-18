# Chapter 2 Page 7 Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 49-second `Ch2-Page7-Storyboard` Remotion composition for S18–S22, using the approved continuous narrative and the three existing storyboard images.

**Architecture:** Implement one page-level React component with four local presentation components (`StoryboardPanel`, `SampleCard`, `MemberAvatar`, and `ChecklistCard`). A single frame timeline controls all five shots and preserves visual continuity between adjacent sections; `Root.tsx` only registers the finished composition.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Img`, `interpolate`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`), inline SVG, existing theme tokens.

## Global Constraints

- Composition ID is exactly `Ch2-Page7-Storyboard`.
- Duration is exactly 1470 frames at 30 fps, 1920 × 1080.
- Shot boundaries are S18 `0–239`, S19 `240–509`, S20 `510–719`, S21 `720–1199`, and S22 `1200–1469`.
- Use the existing white background, dark gray text, warm gray lines, and yellow emphasis.
- Use only frame-driven Remotion animation; do not add CSS transitions, CSS animations, or Tailwind animation classes.
- Load all three images with `staticFile()` and `<Img>`; do not edit source assets.
- S20 focuses only `storyboard-sample-1.png` and `storyboard-sample-3.png`.
- Preserve the S21 semantic order: view storyboard → ask → confirm → consensus.
- S22 ends with `夥伴看得懂` as the only persistent yellow focus.

---

### Task 1: Build S18 and register the Page 7 composition

**Files:**
- Create: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`
- Modify: `src/Root.tsx`

**Interfaces:**
- Consumes: theme exports `TEXT_DARK`, `SUBTLE`, `WHITE`, `YELLOW`, `BORDER_LIGHT`, `CARD_BORDER`, and `withAlpha`.
- Produces: named React component `Ch2Page7Storyboard`.
- Produces local `StoryboardPanel` with props `{ index: number; progress: number }`.

- [ ] **Step 1: Create the page timeline and S18 presentation**

Implement these exact timeline constants:

```tsx
const S19_START = 240;
const S20_START = 510;
const S21_START = 720;
const S22_START = 1200;
const PANEL_START = [76, 112, 148] as const;
```

Create `StoryboardPanel` as an SVG-backed 440 × 300 card. Its three `index` values render:

```tsx
0: player circle on a left platform
1: player circle, two platforms, and a curved movement arrow
2: player circle on the destination platform and a flag
```

Use SVG `pathLength={1}` and `strokeDasharray={1}` for the panel border and arrow drawing. Drive `strokeDashoffset` from `progress`. Fade the internal marks in after the border reaches 55% progress.

In `Ch2Page7Storyboard`, render:

```tsx
<AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
  {/* S18–S22 layers */}
</AbsoluteFill>
```

For S18:

- Animate the title with `spring({ frame, fps, config: { damping: 14, stiffness: 110 } })`.
- Render `Storyboard` in `YELLOW` and `分鏡圖` in `TEXT_DARK`.
- Fade in `演出玩法・關卡設計` over frames 34–62.
- Start the three panels at frames 76, 112, and 148.
- Fade and scale S18 out over frames 220–252 so it overlaps S19.

- [ ] **Step 2: Register the composition**

Add:

```tsx
import { Ch2Page7Storyboard } from "./scenes/02-遊戲設計/Ch2Page7Storyboard";
```

Register:

```tsx
<Composition
  id="Ch2-Page7-Storyboard"
  component={Ch2Page7Storyboard}
  durationInFrames={1470}
  fps={30}
  width={1920}
  height={1080}
/>
```

- [ ] **Step 3: Verify the first deliverable**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s18-title.png --frame=45 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s18-panels.png --frame=205 --scale=0.25
```

Expected:

- ESLint and TypeScript exit with code 0.
- Frame 45 shows the title before storyboard panels.
- Frame 205 shows all three panels in left-to-right order without clipping.

### Task 2: Add S19 material wall and S20 detail focus

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`

**Interfaces:**
- Consumes: `S19_START`, `S20_START`, `Img`, and `staticFile`.
- Produces local `SampleCard` with props:

```tsx
type SampleCardProps = {
  src: string;
  progress: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  objectPosition?: string;
  opacity?: number;
};
```

- [ ] **Step 1: Implement the reusable image card**

`SampleCard` must:

- Place the card absolutely using the passed geometry.
- Use `overflow: "hidden"`, white background, `2px solid BORDER_LIGHT`, 20px radius, and a low-opacity shadow from `withAlpha(TEXT_DARK, 0.1)`.
- Render `<Img src={staticFile(src)} />`.
- Animate opacity, 26px vertical movement, and scale from 0.96 to 1 using `progress`.
- Respect explicit `objectPosition`.

- [ ] **Step 2: Build S19**

Use entry starts `[286, 320, 354]` for:

```tsx
"02-遊戲設計/storyboard-sample-1.png"
"02-遊戲設計/storyboard-sample-2.png"
"02-遊戲設計/storyboard-sample-3.png"
```

Lay them out as:

```tsx
sample-1: left 150, top 300, width 540, height 510, rotate -2
sample-2: left 690, top 265, width 540, height 510, rotate 1.5
sample-3: left 1230, top 300, width 540, height 510, rotate -1
```

Render the title `形式多元・無固定格式` at the top center. Add a yellow-outlined circular stamp `看得懂最重要` at the lower right and start its spring at frame 414. Fade the material wall down over frames 500–532.

- [ ] **Step 3: Build S20**

Render a centered 1500 × 760 viewport with rounded corners:

- `sample-1` opacity transitions in at 510–530 and out at 602–628.
- `sample-3` opacity transitions in at 606–632 and out at 700–730.
- `sample-1` uses `objectPosition: "35% 35%"`.
- `sample-3` uses `objectPosition: "50% 18%"`.
- Scale each image from 1.03 to 1.08 during its visible interval.
- Use `objectFit: "cover"` and do not render captions.

- [ ] **Step 4: Verify image handling and transitions**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s19-wall.png --frame=450 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s20-sample1.png --frame=565 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s20-crossfade.png --frame=617 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s20-sample3.png --frame=670 --scale=0.25
```

Expected:

- Frame 450 shows all three source styles and a readable stamp.
- Frame 565 shows recognizable sequential panels from sample 1.
- Frame 617 contains no white flash during crossfade.
- Frame 670 preserves the red/blue marks and first-row panel structure from sample 3.

### Task 3: Add S21 team consensus sequence

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`

**Interfaces:**
- Consumes: `S21_START` and the sample 3 asset.
- Produces local `MemberAvatar` with props:

```tsx
type MemberAvatarProps = {
  x: number;
  y: number;
  color: string;
  progress: number;
};
```

- [ ] **Step 1: Implement the avatar and storyboard card**

`MemberAvatar` renders a circular head and shoulder arc in inline SVG. Animate its opacity and translate distance through `progress`.

At S21:

- Place a 620 × 350 sample 3 card at the center.
- Animate it from the S20 full viewport to the centered card over frames 720–758.
- Add avatars at left `(340, 540)`, right `(1580, 540)`, and bottom `(960, 920)`.
- Start avatar springs at frames 780, 810, and 840.

- [ ] **Step 2: Draw connections and ask for confirmation**

Draw three SVG lines from avatars toward the central card. Animate each with `pathLength={1}` and starts at frames 818, 848, and 878.

Render two speech bubbles containing exactly:

```text
我們想的一樣嗎？
```

Place them near the left and right avatars. Start their springs at frames 930 and 970.

- [ ] **Step 3: Show confirmation only after the question**

Draw a yellow checkmark starting at frame 1060. Fade in `想像一致` at frame 1090 and `凝聚團隊共識` at frame 1120. The checkmark and confirmation text must not be visible before frame 1060.

Fade S21 out over frames 1180–1210 while keeping the central storyboard card available for the S22 icon transition.

- [ ] **Step 4: Verify semantic order**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s21-gather.png --frame=890 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s21-question.png --frame=1015 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s21-confirm.png --frame=1150 --scale=0.25
```

Expected:

- Frame 890 shows avatars and connections without confirmation.
- Frame 1015 shows the question bubbles without a checkmark.
- Frame 1150 shows the yellow checkmark, `想像一致`, and `凝聚團隊共識`.

### Task 4: Add S22 checklist and synchronize the storyboard document

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`
- Modify: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`

**Interfaces:**
- Consumes: `S22_START`.
- Produces local `ChecklistCard` with props:

```tsx
type ChecklistIcon = "endpoints" | "continuity" | "simplify" | "readable";

type ChecklistCardProps = {
  label: string;
  icon: ChecklistIcon;
  progress: number;
  active: boolean;
};
```

- [ ] **Step 1: Implement checklist card icons**

Render exact SVG meanings:

- `endpoints`: start dot, connecting line, and finish flag.
- `continuity`: three frames joined by two arrows.
- `simplify`: square, circle, and two straight lines.
- `readable`: two head circles and a checkmark.

The card uses a warm gray border when inactive. During entry, interpolate the border and icon toward yellow; after settling, return cards 1–3 to warm gray. Keep card 4 yellow.

- [ ] **Step 2: Build the S22 layout**

Render title `繪製分鏡圖的重點` first at frames 1200–1230. Place a small storyboard icon next to the title.

Use a 2 × 2 grid with entries:

```tsx
{ label: "完整開始與結尾", icon: "endpoints", start: 1250 }
{ label: "情境連貫", icon: "continuity", start: 1300 }
{ label: "去複雜化", icon: "simplify", start: 1350 }
{ label: "夥伴看得懂", icon: "readable", start: 1400 }
```

Start each icon 6 frames before its label reaches full opacity. At frame 1450, only `夥伴看得懂` remains yellow.

- [ ] **Step 3: Correct the source storyboard**

In the S20 row, replace:

```text
沿用 S17 同批素材
```

with:

```text
沿用 S19 同批素材
```

Do not alter the stated 7-second duration or the selected image-material presentation.

- [ ] **Step 4: Verify the completed page**

Run:

```powershell
npm.cmd run lint
git diff --check
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s22-first.png --frame=1280 --scale=0.25
npx.cmd remotion still Ch2-Page7-Storyboard .renders/page7-s22-final.png --frame=1450 --scale=0.25
```

Expected:

- Lint and TypeScript pass.
- `git diff --check` reports no whitespace errors.
- Frame 1280 shows the title before all four cards are complete.
- Frame 1450 shows all four cards, with only `夥伴看得懂` retaining yellow emphasis.

### Task 5: Final regression and cleanup

**Files:**
- Verify: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`
- Verify: `src/Root.tsx`
- Verify: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`

**Interfaces:**
- Consumes: completed Page 7 composition and all verification renders.
- Produces: a clean implementation ready for user review.

- [ ] **Step 1: Run final static verification**

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit 0.
- No whitespace errors.
- Only Page 7 implementation, Root registration, storyboard document, plan document, and pre-existing `.dev-server` logs appear.

- [ ] **Step 2: Inspect all rendered keyframes**

Open the generated images and check:

- No clipping at 1920 × 1080.
- Text does not overlap imagery.
- S19 photos remain visibly different.
- S20 crops show recognizable storyboard panels.
- S21 success state appears only after questions.
- S22 final focus is unambiguous.

- [ ] **Step 3: Remove temporary render outputs**

Delete only the generated `.renders/page7-*.png` files after visual inspection. Resolve each path and confirm it is under the repository `.renders` directory before removal.

- [ ] **Step 4: Report implementation for review**

Provide the composition ID, implemented shot range, verification result, and any intentional timing adjustments. Do not commit until the user has reviewed the animation or explicitly requests a commit.
