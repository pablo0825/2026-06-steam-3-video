# Ch4 Page 2 Related Knowledge (S05-S08) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 28-second `Ch4-Page2-RelatedKnowledge` Remotion composition for S05-S08 of 第 4 集「美術整合」, including the related-knowledge tag intro and the landscape/portrait screen-size examples.

**Architecture:** One page-level React component (`Ch4Page2RelatedKnowledge`) drives four sequential shots from a single 840-frame timeline. S05 adapts the `Ch2Page1Opening` knowledge-tag pattern for three art-integration concepts, S06 shows the screen-size comparison cards, S07 displays the landscape image full-bleed, and S08 displays the portrait image centered on black. The page is self-contained; helpers stay inside the same file because the layout is specific to this page.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `Img`, `interpolate`, `interpolateColors`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens from `src/theme/colors.ts`, local image assets in `public/04-美術整合/`.

## Global Constraints

- Composition ID is exactly `Ch4-Page2-RelatedKnowledge`.
- Duration is exactly 840 frames at 30 fps, 1920×1080.
- Shot boundaries are S05 `0-330`, S06 `330-540`, S07 `540-690`, S08 `690-840`.
- The component file is exactly `src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx`.
- S05 prompt text is exactly `先認識幾個重要觀念`.
- S05 tags are exactly `遊戲畫面大小`, `素材大小的基礎單位`, `Sprite Sheet`, in that order.
- S05 bottom prompt is exactly `先從「遊戲畫面大小」開始 →`.
- S06 title is exactly `遊戲畫面大小`.
- S06 cards show exactly `1920×1080` / `16:9 橫式` and `1080×1920` / `9:16 直式`.
- S07 image asset is exactly `staticFile("04-美術整合/screen-size-landscape.png")`.
- S07 bottom label is exactly `1920×1080`.
- S08 image asset is exactly `staticFile("04-美術整合/screen-size-portrait.png")`.
- S08 bottom label is exactly `1080×1920`.
- S07 must cover the full 1920×1080 frame with the landscape image.
- S08 must use a black background and must not crop the portrait image.
- Use only colors from `src/theme/colors.ts`, except black background may use exported `BLACK`.
- Use only frame-driven Remotion animation; no CSS transitions/animations or Tailwind animation classes.
- Do not modify image assets.
- Do not modify `FullVideo`.

---

### Task 1: Create the full Page2 component

**Files:**
- Create: `src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx`

**Interfaces:**
- Consumes: theme exports `BLACK`, `BLUE`, `CARD_BORDER`, `CHIP_BG`, `SUBTLE`, `TEXT_DARK`, `WHITE`, `YELLOW`, `withAlpha`; Remotion helpers listed in the tech stack; assets in `public/04-美術整合/`.
- Produces: named React component `Ch4Page2RelatedKnowledge` covering frames `0-840`. `Root.tsx` registration in Task 2 will consume this named export.

- [ ] **Step 1: Create the component file**

Create `src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx` with exactly:

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
  BLACK,
  BLUE,
  CARD_BORDER,
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 4 集・第 2 頁：相關知識導覽與遊戲畫面大小（S05-S08）
//   S05：三個相關知識標籤，聚焦「遊戲畫面大小」
//   S06：橫式 / 直式尺寸卡
//   S07：橫式遊戲畫面滿版圖
//   S08：直式遊戲畫面置中，黑底補兩側

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LANDSCAPE_IMAGE = staticFile("04-美術整合/screen-size-landscape.png");
const PORTRAIT_IMAGE = staticFile("04-美術整合/screen-size-portrait.png");

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// S05：相關知識導覽
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [210, 250] as const;
const S05_OUT = [306, 330] as const;

// S06：尺寸卡
const S06_IN = [330, 354] as const;
const S06_OUT = [516, 540] as const;
const CARD_FIRST = 374;
const CARD_STEP = 26;
const NUMBER_HI = [430, 484] as const;

// S07：橫式圖片
const S07_IN = [540, 564] as const;
const S07_OUT = [666, 690] as const;

// S08：直式圖片
const S08_IN = [690, 714] as const;

type KnowledgeTagProps = {
  label: string;
  index: number;
  frame: number;
  fps: number;
  highlight: number;
};

const KnowledgeTag: React.FC<KnowledgeTagProps> = ({
  label,
  index,
  frame,
  fps,
  highlight,
}) => {
  const entrance = spring({
    frame: frame - (TAG_FIRST + index * TAG_STEP),
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const isPrimary = index === 0;
  const hi = isPrimary ? highlight : 0;

  return (
    <div
      style={{
        width: index === 1 ? 520 : 390,
        height: 106,
        borderRadius: 999,
        background: interpolateColors(hi, [0, 1], [CHIP_BG, BLUE]),
        color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [42, 0])}px) scale(${1 + hi * 0.06})`,
        boxShadow:
          hi > 0 ? `0 14px 34px ${withAlpha(BLUE, 0.22 * hi)}` : "none",
        fontSize: index === 1 ? 42 : 46,
        fontWeight: 850,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

type SizeCardProps = {
  title: string;
  subtitle: string;
  index: number;
  frame: number;
  fps: number;
  numberHighlight: number;
};

const SizeCard: React.FC<SizeCardProps> = ({
  title,
  subtitle,
  index,
  frame,
  fps,
  numberHighlight,
}) => {
  const entrance = spring({
    frame: frame - (CARD_FIRST + index * CARD_STEP),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const fromX = index === 0 ? -70 : 70;

  return (
    <div
      style={{
        width: 560,
        height: 300,
        borderRadius: 28,
        border: `3px solid ${CARD_BORDER}`,
        background: WHITE,
        boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        opacity: entrance,
        transform: `translateX(${interpolate(entrance, [0, 1], [fromX, 0])}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: 1,
          color: TEXT_DARK,
          lineHeight: 1,
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>{title}</span>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -8,
            height: 12,
            borderRadius: 999,
            background: YELLOW,
            transform: `scaleX(${numberHighlight})`,
            transformOrigin: "left center",
          }}
        />
      </div>
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 999,
          background: withAlpha(BLUE, 0.1),
          color: BLUE,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

type DimensionLabelProps = {
  text: string;
  opacity: number;
};

const DimensionLabel: React.FC<DimensionLabelProps> = ({ text, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 34,
      transform: "translateX(-50%)",
      opacity,
      padding: "8px 20px",
      borderRadius: 999,
      background: withAlpha(TEXT_DARK, 0.58),
      color: WHITE,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 1,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const Ch4Page2RelatedKnowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // S05
  const s05Opacity = interpolate(frame, S05_OUT, [1, 0], clamp);
  const promptOpacity = interpolate(frame, [36, 62], [0, 1], clamp);
  const highlight = interpolate(frame, HIGHLIGHT, [0, 1], clamp);

  // S06
  const s06Opacity =
    interpolate(frame, S06_IN, [0, 1], clamp) *
    interpolate(frame, S06_OUT, [1, 0], clamp);
  const s06Title = spring({
    frame: frame - 346,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const numberHighlight = interpolate(frame, NUMBER_HI, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // S07
  const s07Opacity =
    interpolate(frame, S07_IN, [0, 1], clamp) *
    interpolate(frame, S07_OUT, [1, 0], clamp);
  const landscapeScale = interpolate(frame, [540, 690], [1.01, 1], clamp);
  const s07LabelOpacity = interpolate(frame, [570, 590], [0, 1], clamp);

  // S08
  const s08Opacity = interpolate(frame, S08_IN, [0, 1], clamp);
  const s08LabelOpacity = interpolate(frame, [720, 740], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* S05：相關知識導覽 */}
      {frame < 332 && (
        <AbsoluteFill
          style={{
            opacity: s05Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginBottom: 56,
              opacity: promptOpacity,
              fontSize: 46,
              fontWeight: 650,
              letterSpacing: 3,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            先認識幾個重要觀念
          </div>
          <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
            {TAGS.map((tag, index) => (
              <KnowledgeTag
                key={tag}
                label={tag}
                index={index}
                frame={frame}
                fps={fps}
                highlight={highlight}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 42,
              opacity: highlight,
              fontSize: 34,
              fontWeight: 750,
              letterSpacing: 1,
              color: BLUE,
              whiteSpace: "nowrap",
            }}
          >
            先從「遊戲畫面大小」開始 →
          </div>
        </AbsoluteFill>
      )}

      {/* S06：橫式 / 直式尺寸卡 */}
      {frame >= 326 && frame < 542 && (
        <AbsoluteFill
          style={{
            opacity: s06Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginBottom: 70,
              opacity: s06Title,
              transform: `translateY(${interpolate(s06Title, [0, 1], [32, 0])}px)`,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            遊戲畫面大小
          </div>
          <div style={{ display: "flex", gap: 76 }}>
            <SizeCard
              title="1920×1080"
              subtitle="16:9 橫式"
              index={0}
              frame={frame}
              fps={fps}
              numberHighlight={numberHighlight}
            />
            <SizeCard
              title="1080×1920"
              subtitle="9:16 直式"
              index={1}
              frame={frame}
              fps={fps}
              numberHighlight={numberHighlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* S07：橫式遊戲畫面滿版 */}
      {frame >= 536 && frame < 692 && (
        <AbsoluteFill
          style={{
            opacity: s07Opacity,
            backgroundColor: BLACK,
            overflow: "hidden",
          }}
        >
          <Img
            src={LANDSCAPE_IMAGE}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${landscapeScale})`,
            }}
          />
          <DimensionLabel text="1920×1080" opacity={s07LabelOpacity} />
        </AbsoluteFill>
      )}

      {/* S08：直式遊戲畫面置中，黑底補兩側 */}
      {frame >= 686 && (
        <AbsoluteFill
          style={{
            opacity: s08Opacity,
            backgroundColor: BLACK,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Img
            src={PORTRAIT_IMAGE}
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
          <DimensionLabel text="1080×1920" opacity={s08LabelOpacity} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Run TypeScript through lint to catch component-level errors**

Run:

```powershell
npm.cmd run lint
```

Expected:

- The command exits 0.
- If it fails because the component is not yet imported, the failure should not reference `Ch4Page2RelatedKnowledge.tsx`; continue to Task 2 and re-run after Root registration.

---

### Task 2: Register the Page2 composition and render keyframes

**Files:**
- Modify: `src/Root.tsx`
- Verify: `src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx`

**Interfaces:**
- Consumes: named export `Ch4Page2RelatedKnowledge` from Task 1.
- Produces: registered Remotion composition `Ch4-Page2-RelatedKnowledge` with `durationInFrames={840}`.

- [ ] **Step 1: Add the Page2 import to `Root.tsx`**

In `src/Root.tsx`, add this import immediately after the existing Ch4 Page1 import:

```tsx
import { Ch4Page2RelatedKnowledge } from "./scenes/04-美術整合/Ch4Page2RelatedKnowledge";
```

- [ ] **Step 2: Register the composition in the 第 4 集・美術整合 block**

In `src/Root.tsx`, immediately after the existing `Ch4-Page1-Opening` `<Composition />`, add:

```tsx
      <Composition
        id="Ch4-Page2-RelatedKnowledge"
        component={Ch4Page2RelatedKnowledge}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 3: Run lint after registration**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0.

- [ ] **Step 4: Render S05 and S06 verification stills**

Run:

```powershell
npx.cmd remotion still Ch4-Page2-RelatedKnowledge .renders/ch4-page2-s05-tags.png --frame=260 --scale=0.25
npx.cmd remotion still Ch4-Page2-RelatedKnowledge .renders/ch4-page2-s06-cards.png --frame=470 --scale=0.25
```

Expected:

- Frame 260 shows all three tags in order, `遊戲畫面大小` enlarged/highlighted, and the bottom prompt `先從「遊戲畫面大小」開始 →` directly below the tags.
- Frame 470 shows title `遊戲畫面大小` and the two cards `1920×1080 / 16:9 橫式` and `1080×1920 / 9:16 直式`, with yellow highlights under the dimensions.

- [ ] **Step 5: Render S07 and S08 verification stills**

Run:

```powershell
npx.cmd remotion still Ch4-Page2-RelatedKnowledge .renders/ch4-page2-s07-landscape.png --frame=620 --scale=0.25
npx.cmd remotion still Ch4-Page2-RelatedKnowledge .renders/ch4-page2-s08-portrait.png --frame=780 --scale=0.25
```

Expected:

- Frame 620 shows `screen-size-landscape.png` covering the entire 1920×1080 frame, with bottom label `1920×1080`.
- Frame 780 shows a black background, `screen-size-portrait.png` centered and fully visible without cropping, with bottom label `1080×1920`.

---

### Task 3: Sync storyboard progress and perform final checks

**Files:**
- Modify: `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`
- Verify: `docs/superpowers/specs/2026-06-24-ch4-page2-related-knowledge-design.md`
- Verify: `docs/superpowers/plans/2026-06-24-ch4-page2-related-knowledge.md`
- Verify: `src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx`
- Verify: `src/Root.tsx`

**Interfaces:**
- Consumes: completed Page2 composition and rendered stills from Task 2.
- Produces: storyboard status updated for page 2 and a verified working tree ready for review.

- [ ] **Step 1: Mark page 2 as completed in the storyboard progress table**

In `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`, change only the page-2 row from:

```markdown
| 2 | `Ch4-Page2-RelatedKnowledge` | S05–S08 | 相關知識導覽、遊戲畫面大小、橫式／直式範例 | SVG 圖示、簡報 P7/P8 參考圖 | ⏳ 待製作 |
```

to:

```markdown
| 2 | `Ch4-Page2-RelatedKnowledge` | S05–S08 | 相關知識導覽、遊戲畫面大小、橫式／直式範例 | SVG 圖示、簡報 P7/P8 參考圖 | ✅ 已完成 |
```

Do not change other rows.

- [ ] **Step 2: Run final static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- `npm.cmd run lint` exits 0.
- `git diff --check` reports no whitespace errors.
- `git status --short` shows the new Page2 component, `Root.tsx`, the page-2 design spec, this plan, the Ch4 storyboard document if updated, the user-provided image assets under `public/04-美術整合/`, plus any pre-existing unrelated changes. Do not revert unrelated changes.

- [ ] **Step 3: Inspect rendered stills**

Inspect:

```text
.renders/ch4-page2-s05-tags.png
.renders/ch4-page2-s06-cards.png
.renders/ch4-page2-s07-landscape.png
.renders/ch4-page2-s08-portrait.png
```

Expected:

- S05 text fits inside all three tags and the bottom prompt does not overlap the tags.
- S06 cards have stable dimensions and no text overflow.
- S07 fills the entire frame and the label does not hide important content.
- S08 uses black side areas, the portrait image is not cropped, and the label is legible.

- [ ] **Step 4: Remove temporary render outputs after inspection**

Delete only generated files matching:

```text
.renders/ch4-page2-*.png
```

Before deletion, resolve each path and confirm it is under the repository `.renders` directory. Do not delete `.renders` itself and do not delete unrelated render files.

- [ ] **Step 5: Report implementation for review**

Report:

```text
Composition: Ch4-Page2-RelatedKnowledge
Range: S05-S08
Duration: 840 frames at 30fps
Assets: public/04-美術整合/screen-size-landscape.png, public/04-美術整合/screen-size-portrait.png
Verification: npm.cmd run lint, git diff --check, still renders for frames 260 / 470 / 620 / 780
```

Do not commit until the user has reviewed the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S05 tag intro and highlight are implemented in Task 1 and verified in Task 2. S06 size cards are implemented in Task 1 and verified in Task 2. S07 full-bleed landscape image and label are implemented in Task 1 and verified in Task 2. S08 black background, centered portrait image, and label are implemented in Task 1 and verified in Task 2. Root registration is Task 2. Storyboard progress sync is Task 3.
- **Placeholder scan:** No TBD/TODO text appears in implementation steps. All code steps contain concrete code and exact commands.
- **Type consistency:** `Ch4Page2RelatedKnowledge` is exported in Task 1 and imported by the same name in Task 2. Constants `TAGS`, `TAG_FIRST`, `TAG_STEP`, `HIGHLIGHT`, `S05_OUT`, `S06_IN`, `S06_OUT`, `S07_IN`, `S07_OUT`, and `S08_IN` are used by the exact component code that defines them. Helper props `KnowledgeTagProps`, `SizeCardProps`, and `DimensionLabelProps` match their usage.
- **Frame budget:** S05 `0-330`, S06 `330-540`, S07 `540-690`, S08 `690-840` equals 840 frames and matches the registered `durationInFrames`.
