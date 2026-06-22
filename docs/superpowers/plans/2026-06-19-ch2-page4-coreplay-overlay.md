# Chapter 2 Page 4 Celeste Core Play Overlay Implementation Plan

**Goal:** Convert S11 and S12 from an embedded-video layout into the same NLE-friendly workflow used by Page 3: full-screen Celeste gameplay edited in DaVinci Resolve, with Remotion providing title, dimming, and action graphics through an alpha-capable overlay.

**Architecture:** Extract Page 4 presentation graphics into a reusable `Ch2Page4CorePlayOverlay` component. The overlay includes the existing opaque S10 teaching section, then becomes transparent for S11/S12 so full-screen gameplay can show underneath. Keep `Ch2Page4CorePlay` as a Studio guide composition by placing `GameplayPlaceholder` below the overlay. Register a second ProRes 4444 composition for DaVinci Resolve.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens, ProRes 4444 Alpha export.

## Visual direction

### S10 — retain the existing definition section

Keep the current white teaching screen:

- Title: `核心玩法`
- Definition: `玩家在遊戲中最常重複的動作`
- Prompt: `👀 觀察：哪些動作最常重複？`

The white screen fades to transparent near the end of S10, revealing full-screen gameplay underneath.

### S11 — Celeste title over full-screen gameplay

Use the same title hierarchy and motion language as Page 3 S7:

- Small eyebrow: `核心玩法案例`
- Main title: `Celeste`
- Subtitle: `2D Platformer`
- Short yellow rule
- Localized dark radial glow behind the title

The title appears over full-screen Celeste gameplay, holds briefly, then fades out completely. The remainder of S11 shows clean gameplay with no overlay so viewers can observe repeated actions.

### S12 — three core actions over dimmed gameplay

Keep the Celeste gameplay full-screen in DaVinci Resolve. The Remotion overlay adds:

- A full-screen black veil at approximately 54% opacity.
- Centered heading: `最常重複的 3 個動作`
- Three centered action cards:
  - `⬆️ 跳躍`
  - `🧗 攀牆`
  - `💨 衝刺`

Use a centered vertical stack instead of the old right column. Because the labels are short, cards should be more compact than Page 3 S8:

- Center X: `960`
- Heading Y: approximately `235`
- Card center Y positions: approximately `405`, `545`, `685`
- Card width: approximately `680–760`
- Warm-white cards, dark gray text, yellow emphasis on the action names
- Emoji have no secondary chip background unless visual testing shows that alignment requires it

## Timeline

Preserve the existing composition length of 700 frames at 30 fps.

| Section | Frames | Purpose |
|---|---:|---|
| S10 | `0–219` | Core play definition and observation prompt |
| S11 | `220–491` | Celeste title, then clean full-screen gameplay |
| S12 | `492–699` | Dimmed gameplay and three repeated actions |

### S10 internal timing

Retain the existing animation:

- `0–184`: title, definition, and prompt build.
- `184–212`: S10 white teaching screen fades out.
- `212–219`: transparent breathing room before the S11 title begins.

### S11 internal timing

- `220–238`: localized title glow fades in.
- `230–258`: title group rises approximately 18px and fades in.
- `258–320`: title holds.
- `320–350`: title and glow fade out.
- `350–491`: overlay is fully transparent; gameplay remains unobstructed.

### S12 internal timing

- `492–516`: black veil fades from 0% to approximately 54%.
- `510–540`: heading rises approximately 16px and fades in.
- `548–576`: `跳躍` card enters.
- `590–618`: `攀牆` card enters.
- `632–660`: `衝刺` card enters.
- `660–699`: all three actions remain visible for narration and review.

Do not extend the composition or move Page 5 timing during this refactor.

---

## Task 1: Extract the Page 4 overlay component

**Files:**

- Create: `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`
- Modify: `src/scenes/02-遊戲設計/Ch2Page4CorePlay.tsx`

- [ ] Create and export `Ch2Page4CorePlayOverlay`.
- [ ] Move S10 graphics and all S11/S12 overlay graphics into the new component.
- [ ] Remove old embedded-video layout constants:
  - `VW`
  - `VH`
  - `VY`
  - `VY_S12`
  - `VX_CENTER`
  - `VX_LEFT`
  - `VIDEO_START`
  - `VIDEO_IN`
  - `SHIFT`
  - `COL_X`
- [ ] Remove the old centered-video-frame and left-video/right-column presentation.
- [ ] Keep `Ch2Page4CorePlay` as a guide:
  - Place `GameplayPlaceholder` full-screen under the overlay.
  - The opaque S10 layer covers the placeholder initially.
  - S11/S12 reveal the placeholder as a stand-in for the NLE gameplay track.
- [ ] Do not reference `celeste-coreplay.mp4`.

## Task 2: Preserve S10 and make its exit alpha-safe

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`

- [ ] Preserve the existing S10 visual design and copy.
- [ ] Render S10 inside an explicitly white `AbsoluteFill`.
- [ ] Fade the entire S10 layer from opaque white to transparent over frames `184–212`.
- [ ] Confirm frame 219 is fully transparent.
- [ ] Ensure no root-level background color blocks alpha after S10.

## Task 3: Implement the S11 title treatment

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`

- [ ] Build the centered title group using the same hierarchy as Page 3 S7.
- [ ] Use `核心玩法案例` as the eyebrow.
- [ ] Use `Celeste` as the main title and `2D Platformer` as the subtitle.
- [ ] Add the yellow rule and localized radial glow.
- [ ] Use frame-driven Remotion animation only.
- [ ] Ensure all S11 title graphics reach zero opacity by frame 350.
- [ ] Keep frames `350–491` completely transparent.

## Task 4: Implement the centered S12 action overlay

**Files:**

- Modify: `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`

- [ ] Fade in the full-screen black veil to approximately `0.54`.
- [ ] Place `最常重複的 3 個動作` at the upper center.
- [ ] Replace the old right column with three centered compact cards.
- [ ] Keep all cards the same width for visual stability.
- [ ] Use left-aligned emoji and action text inside each card.
- [ ] Keep the card content visually compact; do not use Page 3's full sentence card width.
- [ ] Stagger entries at frames `548`, `590`, and `632`.
- [ ] Hold all actions through the end of the composition.

## Task 5: Register the editor-facing composition

**Files:**

- Modify: `src/Root.tsx`

- [ ] Reuse or rename the existing alpha metadata function so both Page 3 and Page 4 overlays receive:

```tsx
{
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
}
```

- [ ] Import `Ch2Page4CorePlayOverlay`.
- [ ] Register:

```tsx
<Composition
  id="Ch2-Page4-CorePlay-Overlay"
  component={Ch2Page4CorePlayOverlay}
  durationInFrames={700}
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateAlphaOverlayMetadata}
/>
```

- [ ] Keep `Ch2-Page4-CorePlay` as the Studio guide composition.
- [ ] Ensure guide and overlay compositions share the exact same timeline constants.

## Task 6: Update the storyboard document after implementation

**Files:**

- Modify: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`

- [ ] Replace the current S11 embedded-video description with the full-screen gameplay and centered Overlay title workflow.
- [ ] Replace the current S12 left-video/right-column description with the full-screen dimmed gameplay and centered action cards.
- [ ] Update the Page 4 production status to mention the Overlay composition.
- [ ] Remove claims that `celeste-coreplay.mp4` is loaded directly by Remotion.
- [ ] Document DaVinci Resolve track placement:
  - Lower track: Celeste gameplay.
  - Upper track: Page 4 ProRes 4444 Overlay.

## Task 7: Verify layout, transparency, and timing

- [ ] Run:

```bash
npm run lint
```

- [ ] Render guide stills:

```bash
npx remotion still Ch2-Page4-CorePlay /tmp/ch2-page4-s10.png --frame=150 --scale=0.25
npx remotion still Ch2-Page4-CorePlay /tmp/ch2-page4-s11-title.png --frame=280 --scale=0.25
npx remotion still Ch2-Page4-CorePlay /tmp/ch2-page4-s11-clean.png --frame=420 --scale=0.25
npx remotion still Ch2-Page4-CorePlay /tmp/ch2-page4-s12-actions.png --frame=675 --scale=0.25
```

- [ ] Expected guide results:
  - Frame 150 shows the current S10 definition page.
  - Frame 280 shows the centered Celeste case title over gameplay.
  - Frame 420 shows only gameplay.
  - Frame 675 shows all three centered actions over dimmed gameplay.

- [ ] Render alpha test stills:

```bash
npx remotion still Ch2-Page4-CorePlay-Overlay /tmp/ch2-page4-overlay-s11-clean.png --frame=420
npx remotion still Ch2-Page4-CorePlay-Overlay /tmp/ch2-page4-overlay-s12.png --frame=675
```

- [ ] Verify:
  - Frame 420 has an alpha channel with all alpha values equal to zero.
  - Frame 675 contains a semi-transparent full-frame veil and opaque action cards.

## Task 8: Export and DaVinci Resolve integration

- [ ] Export:

```bash
npx remotion render \
  --image-format=png \
  --pixel-format=yuva444p10le \
  --codec=prores \
  --prores-profile=4444 \
  Ch2-Page4-CorePlay-Overlay \
  out/ch2-p4-coreplay-overlay.mov
```

- [ ] Verify the output is:
  - ProRes 4444
  - 1920 × 1080
  - 30 fps
  - 700 frames / approximately 23.33 seconds
  - Alpha-capable pixel format
- [ ] In DaVinci Resolve:
  - Place the Page 4 Overlay on the upper video track.
  - Place Celeste gameplay on the lower video track.
  - Align both clips at Page 4 frame 0.
  - Keep composite mode `Normal`.
  - Use `Straight` alpha unless edge testing requires `Premultiplied`.

## Acceptance criteria

- No code path requests `celeste-coreplay.mp4`.
- S10 remains visually equivalent to the current teaching section.
- S11 uses the same title system as Page 3 S7 and includes a clean gameplay interval.
- S12 keeps gameplay full-screen and presents all three actions in a centered hierarchy.
- Frame 420 of the Overlay is fully transparent.
- Guide and Overlay compositions remain frame-accurate.
- ESLint and TypeScript pass.
- The exported ProRes file imports into DaVinci Resolve with alpha preserved.
