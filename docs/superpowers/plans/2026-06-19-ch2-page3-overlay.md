# Chapter 2 Page 3 Rhythm Doctor Overlay Implementation Plan

**Goal:** Separate the Rhythm Doctor gameplay footage from Remotion graphics so the footage can be edited in an NLE, while Remotion exports a transparent S7/S8 overlay and an opaque S9 conclusion.

**Architecture:** Extract all S7–S9 graphics into one reusable `Ch2Page3RhythmDoctorOverlay` component. Keep `Ch2Page3RhythmDoctor` as an in-Studio guide composition by placing the existing gameplay placeholder underneath the overlay. Register a second alpha-ready composition for the editor.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Sequence`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens, ProRes 4444 alpha export.

## Approved visual direction

### S7 — game introduction and clean footage

Use a centered editorial title over the full-screen gameplay footage:

- Small eyebrow: `限制設計案例`
- Main title: `節奏醫生`
- English subtitle: `Rhythm Doctor`
- Short yellow rule under the title
- A localized dark radial glow behind the title, not a full-screen black panel

The title should be visible only during the first part of S7. It then fades out completely, leaving a clean gameplay-only interval before S8.

Reasoning:

- A centered title gives the new case study a clear chapter-opening moment.
- A localized glow keeps the title readable without making S7 feel like S8 prematurely.
- The footage-only tail gives the editor and viewer breathing room before explanatory graphics begin.

### S8 — centered constraint explanation

Use the gameplay footage full-screen in the NLE. The Remotion overlay adds:

- A full-screen black veil at 54% target opacity.
- Centered heading: `它的「限制」在哪？`
- Three vertically stacked labels in the center:
  - `⌨️ 第 7 拍，按下空白鍵`
  - `☝️ 全程只靠一個按鍵`
  - `🎯 注意力集中在節拍 × 時間`

Label layout:

- Center X: `960`
- Heading Y: approximately `230`
- Label center Y positions: `400`, `550`, `700`
- Label width: approximately `1080–1160`
- White or warm-white surfaces at high opacity, with the existing yellow emphasis

Reasoning:

- The gameplay is contextual evidence during S8, not the primary reading target.
- A centered stack is easier to scan than a right column and avoids visually shrinking the gameplay.
- The dark veil reduces competition from changing gameplay frames and keeps text contrast predictable.

### S9 — opaque conclusion

S9 remains the existing white conclusion:

`有約束 → 激發靈感`

The white background fades in while the S8 veil fades out, so footage is fully covered before the S9 text animation starts.

## Timeline

Preserve the current composition length of 740 frames at 30 fps for the first implementation.

| Section | Frames | Purpose |
|---|---:|---|
| S7 | `0–149` | Title over gameplay, then clean gameplay |
| S8 | `150–479` | Dark overlay and three centered constraint labels |
| S9 | `480–739` | Opaque white conclusion |

### S7 internal timing

- `0–18`: localized title glow fades in.
- `10–38`: title group rises 18px and fades in.
- `38–96`: title holds.
- `96–126`: title and glow fade out.
- `126–149`: fully transparent overlay; gameplay remains unobstructed.

### S8 internal timing

- `150–174`: black veil fades from 0% to 54%.
- `180–210`: heading rises 16px and fades in.
- `222–250`: first label enters.
- `264–292`: second label enters.
- `306–334`: third label enters.
- `444–468`: heading and labels fade out.
- `456–492`: white S9 background fades in over the dimmed footage.

### S9 internal timing

Retain the current text timings unless the voiceover review requires adjustment:

- `488–518`: `有約束` rises in.
- `556–586`: `有約束` moves left.
- `590–614`: arrow appears.
- `612–644`: `激發靈感` rises in.
- `652–678`: supporting sentence appears.

## Timing risk

The storyboard document describes S7/S8/S9 as 5, 14, and 8 seconds, totaling 810 frames. The current composition is 740 frames, and current S8 occupies about 11 seconds.

The first implementation must not change page duration. Before final delivery:

1. Place the actual voiceover against the 740-frame guide.
2. Confirm whether S8 narration fits before frame 444.
3. If it does not fit, extend S8 and update both the overlay composition and every downstream edit point together.

Do not silently change `durationInFrames` during the visual refactor.

---

## Task 1: Extract reusable overlay structure

**Files:**

- Create: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctorOverlay.tsx`
- Modify: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctor.tsx`

- [ ] Create and export `Ch2Page3RhythmDoctorOverlay`.
- [ ] Give the overlay root no background color so S7/S8 remain transparent.
- [ ] Move the annotation data and all S7–S9 timing constants into the overlay file.
- [ ] Remove the old left-video/right-label layout constants (`VW`, `VH`, `VX_LEFT`, `COL_X`, and `SHIFT`).
- [ ] Keep `Ch2Page3RhythmDoctor` as a guide composition:
  - Show `GameplayPlaceholder` full-screen during S7 and S8.
  - Render `Ch2Page3RhythmDoctorOverlay` above it.
  - Let the overlay's opaque S9 background cover the placeholder.
- [ ] Do not reference either missing MP4.

## Task 2: Implement the S7 title overlay

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctorOverlay.tsx`

- [ ] Add a centered title group using the approved title hierarchy.
- [ ] Use `spring()` or `interpolate()` for frame-driven entrance; do not use CSS animation or transition.
- [ ] Add a localized radial gradient or rounded glow behind the title.
- [ ] Ensure the overlay reaches zero visible opacity by frame 126.
- [ ] Keep frames 126–149 completely transparent.
- [ ] Avoid a solid title card or full-screen dimmer in S7.

## Task 3: Implement the centered S8 explanation

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctorOverlay.tsx`

- [ ] Fade in the full-screen black veil to `0.54` opacity over frames 150–174.
- [ ] Place the heading at the upper center.
- [ ] Replace the right-column labels with a centered vertical stack.
- [ ] Use fixed-width label cards so gameplay motion does not affect readability.
- [ ] Keep yellow emphasis only on:
  - `第 7 拍`
  - `一個按鍵`
  - `節拍 × 時間`
- [ ] Stagger the labels using the existing starts `222`, `264`, and `306`.
- [ ] Fade all S8 information out before S9 content enters.

## Task 4: Preserve and transition into S9

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctorOverlay.tsx`

- [ ] Add an opaque white S9 background beginning around frame 456.
- [ ] Crossfade it over the S8 veil without exposing a bright flash or raw footage between sections.
- [ ] Preserve the current `有約束 → 激發靈感` animation and copy.
- [ ] Confirm the S9 background is fully opaque before `有約束` becomes readable.

## Task 5: Register the editor-facing composition

**Files:**

- Modify: `src/Root.tsx`

- [ ] Import `Ch2Page3RhythmDoctorOverlay`.
- [ ] Register:

```tsx
<Composition
  id="Ch2-Page3-RhythmDoctor-Overlay"
  component={Ch2Page3RhythmDoctorOverlay}
  durationInFrames={740}
  fps={30}
  width={1920}
  height={1080}
/>
```

- [ ] Keep `Ch2-Page3-RhythmDoctor` registered as the visual guide composition.
- [ ] Ensure both compositions use the same duration, fps, width, height, and timing constants.

## Task 6: Verify transparency, layout, and renderability

- [ ] Run:

```bash
npm run lint
```

- [ ] Render guide stills:

```bash
npx remotion still Ch2-Page3-RhythmDoctor /tmp/ch2-page3-s7-title.png --frame=55 --scale=0.25
npx remotion still Ch2-Page3-RhythmDoctor /tmp/ch2-page3-s7-clean.png --frame=138 --scale=0.25
npx remotion still Ch2-Page3-RhythmDoctor /tmp/ch2-page3-s8-labels.png --frame=350 --scale=0.25
npx remotion still Ch2-Page3-RhythmDoctor /tmp/ch2-page3-s9.png --frame=640 --scale=0.25
```

- [ ] Expected results:
  - Frame 55 shows a readable centered title over gameplay.
  - Frame 138 shows only gameplay.
  - Frame 350 shows three centered labels over a dimmed full-screen background.
  - Frame 640 shows the opaque S9 conclusion.

- [ ] Render overlay alpha test frames as PNG and inspect transparency:

```bash
npx remotion still Ch2-Page3-RhythmDoctor-Overlay /tmp/ch2-page3-overlay-s7-clean.png --frame=138
npx remotion still Ch2-Page3-RhythmDoctor-Overlay /tmp/ch2-page3-overlay-s8.png --frame=350
```

- [ ] Expected alpha behavior:
  - Frame 138 is fully transparent.
  - Frame 350 contains a semi-transparent black background plus opaque labels.

## Task 7: Export and NLE integration check

- [ ] Export the overlay as ProRes 4444 with PNG frame rendering and an alpha-capable pixel format.
- [ ] Confirm the rendered file reports an alpha channel before editing.
- [ ] In the NLE:
  - Put the Rhythm Doctor gameplay on the lower track.
  - Put the overlay at the exact same timeline start on the upper track.
  - Do not add an extra blend mode; use normal alpha compositing.
- [ ] Check frames 0, 126, 150, 350, 468, and 492 for alignment.
- [ ] Confirm S7 clean-footage frames have no unintended dark layer.
- [ ] Confirm S9 completely covers the gameplay.

## Acceptance criteria

- No code path requests `rhythm-doctor.mp4`.
- S7 title reads clearly and leaves at least 24 frames of unobstructed footage.
- S8 uses full-screen gameplay context with a centered information hierarchy.
- The overlay composition has real transparency during S7.
- S9 is opaque and visually identical in meaning to the current conclusion.
- Guide and overlay compositions remain frame-accurate with each other.
- ESLint and TypeScript pass.
- The final overlay imports correctly into the chosen editing software with alpha preserved.
