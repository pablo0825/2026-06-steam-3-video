# Ch4 Page 6 Sprite Sheet (S14-S15) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 20-second `Ch4-Page6-SpriteSheet` Remotion composition for S14-S15 of 第 4 集「美術整合」, defining what a Sprite Sheet is and contrasting scattered loose assets against one consolidated sheet.

**Architecture:** One page-level React component (`Ch4Page6SpriteSheet`) drives two sequential shots from a single 600-frame timeline. S14 is a minimal definition card (big `Sprite Sheet` title + a definition sentence with two pale-yellow highlighted keywords); S15 is a left/right contrast (left = 7 scattered, rotated `SpriteTile`s with a `✕` label; right = a framed 3×3 sheet of 9 neat `SpriteTile`s with a `✓` label, then the left side dims to emphasize the right). The page uses only inline SVG, divs, and text; no image assets. Method A: frame-window crossfade between shots so S16 can later be appended by extending the duration.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`), existing theme tokens from `src/theme/colors.ts`, inline SVG for tile icons.

## Global Constraints

- Composition ID is exactly `Ch4-Page6-SpriteSheet`.
- Component file is exactly `src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx`.
- Duration is exactly 600 frames at 30 fps, 1920×1080.
- Shot boundaries are S14 `0-228`, S15 `228-600`.
- S14 title is exactly `Sprite Sheet`.
- S14 definition sentence is exactly `Sprite Sheet 是把多張 Sprite 放在同一張圖片中的素材格式`, with `多張 Sprite` and `同一張圖片` shown as pale-yellow highlighted keywords (`withAlpha(YELLOW, …)` background, dark text).
- S15 left label is exactly `多檔案管理困難` with a `✕` mark in `RED`.
- S15 right label is exactly `一張圖集中管理` with a `✓` mark in `GREEN`; `集中管理` is emphasized in `YELLOW`.
- S15 left side has exactly 7 scattered tiles; S15 right sheet has exactly 9 tiles in a 3×3 grid (left/right are NOT one-to-one).
- The final emphasis only dims the left side (to ~0.45) and slightly scales the right sheet (to 1.02); no "tiles flying into the sheet" motion.
- Use only colors from `src/theme/colors.ts`; do not add new colors.
- Use only frame-driven Remotion animation; no CSS transitions/animations.
- Do not build S16 (needs an unmade example image), S17, or any image asset.
- Do not modify `FullVideo` or existing Ch4 components.

---

## File Structure

- Create `src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx`: page-level Remotion component plus local helper components (`HighlightWord`, `TileIcon`, `SpriteTile`, `ContrastLabel`) and local data (`TILE_COLORS`, `SCATTER`, `SHEET_TILES`).
- Modify `src/Root.tsx`: import `Ch4Page6SpriteSheet` and register the `Ch4-Page6-SpriteSheet` composition.
- Modify `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`: update the page-6 progress row to note S14-S15 done / S16 pending.

---

### Task 1: S14 Sprite Sheet definition card

**Files:**
- Create: `src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx`

**Interfaces:**
- Consumes: Remotion helpers and theme tokens.
- Produces: named export `Ch4Page6SpriteSheet`, the shared timeline constants (`S14_OUT`, `S15_IN`, `clamp`, `ease`, `FONT`), the `HighlightWord` helper, and the S14 layer. Task 2 extends the same component with the S15 layer.

- [ ] **Step 1: Create `Ch4Page6SpriteSheet.tsx` with the S14-only implementation**

Create `src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx` with:

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
import { NEUTRAL_50, TEXT_DARK, YELLOW, withAlpha } from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) };

// 第 4 集・第 6 頁：認識 Sprite Sheet
//   S14（0–228）：極簡定義卡
//   S15（228–600）：散亂 vs. 集中 左右對比

const S14_OUT = [200, 228] as const;

// S14 定義句的淡黃襯底高亮詞
const HighlightWord: React.FC<{ children: React.ReactNode; show: number }> = ({
  children,
  show,
}) => (
  <span
    style={{
      padding: "2px 10px",
      margin: "0 4px",
      borderRadius: 8,
      backgroundColor: withAlpha(YELLOW, 0.3 * show),
      color: TEXT_DARK,
      fontWeight: 800,
    }}
  >
    {children}
  </span>
);

export const Ch4Page6SpriteSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S14 定義卡 ──
  const s14Opacity = interpolate(frame, S14_OUT, [1, 0], clamp);
  const titleSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const defLine = interpolate(frame, [44, 70], [0, 1], ease);
  const hl1 = interpolate(frame, [90, 112], [0, 1], ease);
  const hl2 = interpolate(frame, [120, 142], [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* ── S14 定義卡 ── */}
      {frame < 240 && (
        <AbsoluteFill
          style={{
            opacity: s14Opacity,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: TEXT_DARK,
              letterSpacing: 2,
              lineHeight: 1,
              opacity: titleSpring,
              transform: `scale(${interpolate(titleSpring, [0, 1], [0.9, 1])})`,
            }}
          >
            Sprite Sheet
          </div>
          <div
            style={{
              marginTop: 56,
              fontSize: 46,
              fontWeight: 600,
              color: TEXT_DARK,
              letterSpacing: 1,
              opacity: defLine,
              transform: `translateY(${interpolate(defLine, [0, 1], [28, 0])}px)`,
            }}
          >
            Sprite Sheet 是把
            <HighlightWord show={hl1}>多張 Sprite</HighlightWord>
            放在
            <HighlightWord show={hl2}>同一張圖片</HighlightWord>
            中的素材格式
          </div>
        </AbsoluteFill>
      )}

      {/* S15 layer added in Task 2 */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0. (`tsconfig` has `noUnusedLocals: true`, so Task 1 defines only constants it actually uses; the `S15_IN` window is added in Task 2.)

- [ ] **Step 3: Commit**

```powershell
git add "src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx"
git commit -m "feat(ch4-p6): add S14 sprite sheet definition card"
```

---

### Task 2: S15 scattered-vs-consolidated contrast

**Files:**
- Modify: `src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx`

**Interfaces:**
- Consumes: `S15_IN`, `clamp`, `ease`, `FONT`, theme tokens, and the existing `Ch4Page6SpriteSheet` component body from Task 1.
- Produces: `TileKind` type, `TILE_COLORS` map, `TileIcon`, `SpriteTile`, `ContrastLabel` helpers, `SCATTER` / `SHEET_TILES` data, and the S15 layer rendered for `frame >= 228`.

- [ ] **Step 1: Extend the color imports**

Replace the import line:

```tsx
import { NEUTRAL_50, TEXT_DARK, YELLOW, withAlpha } from "../../theme/colors";
```

with:

```tsx
import {
  BLUE,
  CARD_BORDER,
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  DIVIDER,
  GREEN,
  NEUTRAL_50,
  PANEL_BG,
  RED,
  SUBTLE,
  TEXT_DARK,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
```

- [ ] **Step 2: Add the S15 timeline constant**

Immediately after the `const S14_OUT = [200, 228] as const;` line, add:

```tsx
const S15_IN = [228, 262] as const;
```

- [ ] **Step 3: Add tile data and helper components**

After the `HighlightWord` component (before `export const Ch4Page6SpriteSheet`), add:

```tsx
type TileKind = "floor" | "brick" | "spike" | "coin" | "grass" | "box" | "gem";

const TILE_COLORS: Record<TileKind, string> = {
  floor: CAT_ART,
  brick: RED,
  spike: BLUE,
  coin: YELLOW,
  grass: GREEN,
  box: CAT_PLAN,
  gem: CAT_CODE,
};

const TileIcon: React.FC<{ kind: TileKind; color: string }> = ({
  kind,
  color,
}) => {
  switch (kind) {
    case "floor":
      return (
        <g fill={color}>
          <rect x={16} y={34} width={68} height={14} rx={3} />
          <rect x={16} y={54} width={30} height={14} rx={3} />
          <rect x={54} y={54} width={30} height={14} rx={3} />
        </g>
      );
    case "brick":
      return (
        <g fill={color}>
          <rect x={14} y={30} width={34} height={16} rx={2} />
          <rect x={52} y={30} width={34} height={16} rx={2} />
          <rect x={32} y={52} width={36} height={16} rx={2} />
        </g>
      );
    case "spike":
      return <path d="M50 24 L80 78 L20 78 Z" fill={color} />;
    case "coin":
      return (
        <g fill="none" stroke={color} strokeWidth={8}>
          <circle cx={50} cy={50} r={26} />
          <circle cx={50} cy={50} r={12} />
        </g>
      );
    case "grass":
      return (
        <g fill={color}>
          <path d="M30 74 L38 40 L46 74 Z" />
          <path d="M48 74 L56 32 L64 74 Z" />
          <path d="M62 74 L70 46 L78 74 Z" />
        </g>
      );
    case "box":
      return (
        <g fill="none" stroke={color} strokeWidth={8} strokeLinecap="round">
          <rect x={26} y={26} width={48} height={48} rx={4} />
          <path d="M26 26 L74 74 M74 26 L26 74" />
        </g>
      );
    case "gem":
      return <path d="M50 22 L78 50 L50 80 L22 50 Z" fill={color} />;
    default:
      return null;
  }
};

const SpriteTile: React.FC<{
  kind: TileKind;
  size: number;
  appear: number;
  rotate?: number;
}> = ({ kind, size, appear, rotate = 0 }) => {
  const color = TILE_COLORS[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.18,
        backgroundColor: withAlpha(color, 0.16),
        border: `2px solid ${withAlpha(color, 0.5)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear,
        transform: `scale(${interpolate(appear, [0, 1], [0.6, 1], clamp)}) rotate(${rotate}deg)`,
      }}
    >
      <svg viewBox="0 0 100 100" width={size * 0.7} height={size * 0.7}>
        <TileIcon kind={kind} color={color} />
      </svg>
    </div>
  );
};

const ContrastLabel: React.FC<{ kind: "cross" | "check"; show: number }> = ({
  kind,
  show,
}) => {
  const isCross = kind === "cross";
  return (
    <div
      style={{
        position: "absolute",
        top: isCross ? 880 : 808,
        left: isCross ? 180 : 1180,
        width: isCross ? 600 : 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity: show,
        transform: `translateY(${interpolate(show, [0, 1], [18, 0], clamp)}px)`,
      }}
    >
      <span
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: isCross ? RED : GREEN,
        }}
      >
        {isCross ? "✕" : "✓"}
      </span>
      <span
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: isCross ? SUBTLE : TEXT_DARK,
        }}
      >
        {isCross ? (
          "多檔案管理困難"
        ) : (
          <>
            一張圖<span style={{ color: YELLOW }}>集中管理</span>
          </>
        )}
      </span>
    </div>
  );
};

const SCATTER: { kind: TileKind; left: number; top: number; rot: number }[] = [
  { kind: "floor", left: 210, top: 300, rot: -8 },
  { kind: "brick", left: 430, top: 250, rot: 6 },
  { kind: "spike", left: 620, top: 332, rot: -5 },
  { kind: "coin", left: 300, top: 470, rot: 10 },
  { kind: "grass", left: 520, top: 500, rot: -9 },
  { kind: "box", left: 168, top: 612, rot: 7 },
  { kind: "gem", left: 648, top: 560, rot: -6 },
];

const SHEET_TILES: TileKind[] = [
  "floor",
  "brick",
  "spike",
  "coin",
  "grass",
  "box",
  "gem",
  "floor",
  "brick",
];
```

- [ ] **Step 4: Add S15 animation values**

Inside `Ch4Page6SpriteSheet`, after the S14 values (after the `hl2` line), add:

```tsx
  // ── S15 對比 ──
  const s15Opacity = interpolate(frame, S15_IN, [0, 1], ease);
  const crossLabel = interpolate(frame, [350, 382], [0, 1], ease);
  const sheetSpring = spring({
    frame: frame - 392,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const checkLabel = interpolate(frame, [510, 540], [0, 1], ease);
  const leftDim = interpolate(frame, [540, 578], [1, 0.45], clamp);
  const rightScale = interpolate(frame, [540, 578], [1, 1.02], clamp);
```

- [ ] **Step 5: Replace the S15 placeholder with the S15 layer**

Replace `{/* S15 layer added in Task 2 */}` with:

```tsx
      {/* ── S15 散亂 vs. 集中 ── */}
      {frame >= 228 && (
        <AbsoluteFill style={{ opacity: s15Opacity }}>
          {/* 中央虛線分隔 */}
          <div
            style={{
              position: "absolute",
              left: 959,
              top: 200,
              width: 0,
              height: 640,
              borderLeft: `2px dashed ${DIVIDER}`,
            }}
          />

          {/* 左半：散亂 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 960,
              height: 1080,
              opacity: leftDim,
            }}
          >
            {SCATTER.map((t, i) => {
              const appear = spring({
                frame: frame - (270 + i * 11),
                fps,
                config: { damping: 13, stiffness: 130 },
              });
              return (
                <div
                  key={i}
                  style={{ position: "absolute", left: t.left, top: t.top }}
                >
                  <SpriteTile
                    kind={t.kind}
                    size={120}
                    appear={appear}
                    rotate={t.rot}
                  />
                </div>
              );
            })}
            <ContrastLabel kind="cross" show={crossLabel} />
          </div>

          {/* 右半：集中 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 1180,
                top: 250,
                width: 520,
                height: 520,
                borderRadius: 20,
                backgroundColor: PANEL_BG,
                border: `3px solid ${CARD_BORDER}`,
                opacity: sheetSpring,
                transformOrigin: "center",
                transform: `translateY(${interpolate(
                  sheetSpring,
                  [0, 1],
                  [60, 0],
                  clamp,
                )}px) scale(${rightScale})`,
                boxShadow: `0 ${interpolate(
                  rightScale,
                  [1, 1.02],
                  [12, 26],
                  clamp,
                )}px ${interpolate(
                  rightScale,
                  [1, 1.02],
                  [28, 50],
                  clamp,
                )}px ${withAlpha(TEXT_DARK, 0.12)}`,
              }}
            >
              {SHEET_TILES.map((kind, j) => {
                const col = j % 3;
                const row = Math.floor(j / 3);
                const cell = 144;
                const gap = 12;
                const appear = interpolate(
                  frame,
                  [428 + j * 7, 450 + j * 7],
                  [0, 1],
                  ease,
                );
                return (
                  <div
                    key={j}
                    style={{
                      position: "absolute",
                      left: 32 + col * (cell + gap),
                      top: 32 + row * (cell + gap),
                    }}
                  >
                    <SpriteTile kind={kind} size={cell} appear={appear} />
                  </div>
                );
              })}
            </div>
            <ContrastLabel kind="check" show={checkLabel} />
          </div>
        </AbsoluteFill>
      )}
```

- [ ] **Step 6: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0.

- [ ] **Step 7: Commit**

```powershell
git add "src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx"
git commit -m "feat(ch4-p6): add S15 scattered-vs-consolidated contrast"
```

---

### Task 3: Register composition, render stills, sync storyboard

**Files:**
- Modify: `src/Root.tsx`
- Modify: `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`

**Interfaces:**
- Consumes: the completed `Ch4Page6SpriteSheet` component.
- Produces: a registered `Ch4-Page6-SpriteSheet` composition, verification stills, and an updated storyboard progress row.

- [ ] **Step 1: Import the component in `src/Root.tsx`**

After the existing line:

```tsx
import { Ch4Page4PPU } from "./scenes/04-美術整合/Ch4Page4PPU";
```

add:

```tsx
import { Ch4Page6SpriteSheet } from "./scenes/04-美術整合/Ch4Page6SpriteSheet";
```

- [ ] **Step 2: Register the composition**

Immediately after the closing `/>` of the `Ch4-Page4-PPU` `<Composition>` block (the one ending with `height={1080}` then `/>`), add:

```tsx
      <Composition
        id="Ch4-Page6-SpriteSheet"
        component={Ch4Page6SpriteSheet}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 3: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0.

- [ ] **Step 4: Render verification stills**

Run:

```powershell
npx.cmd remotion still Ch4-Page6-SpriteSheet .renders/ch4-page6-s14-def.png --frame=150 --scale=0.25
npx.cmd remotion still Ch4-Page6-SpriteSheet .renders/ch4-page6-s15-scatter.png --frame=345 --scale=0.25
npx.cmd remotion still Ch4-Page6-SpriteSheet .renders/ch4-page6-s15-contrast.png --frame=585 --scale=0.25
```

Expected:

- `s14-def` shows the `Sprite Sheet` title and the definition sentence with `多張 Sprite` and `同一張圖片` on pale-yellow backgrounds.
- `s15-scatter` shows 7 scattered, rotated tiles on the left with the `✕ 多檔案管理困難` label.
- `s15-contrast` shows the framed 3×3 sheet of 9 tiles on the right with `✓ 一張圖集中管理`, and the left side noticeably dimmed.

- [ ] **Step 5: Update the storyboard progress row**

In `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md`, change only the page-6 row from:

```markdown
| 6 | `Ch4-Page6-SpriteSheet` | S14–S16 | Sprite Sheet 定義、管理對比與範例圖 | Sprite Sheet 圖片素材 | ⏳ 待製作 |
```

to:

```markdown
| 6 | `Ch4-Page6-SpriteSheet` | S14–S16 | Sprite Sheet 定義、管理對比與範例圖 | Sprite Sheet 圖片素材 | 🔧 S14–S15 已完成（S16 待素材） |
```

- [ ] **Step 6: Final checks**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- `npm.cmd run lint` exits 0.
- `git diff --check` reports no whitespace errors.
- Status shows the new Page6 component, Root registration, and storyboard progress update (spec/plan already committed).

- [ ] **Step 7: Remove temporary render outputs**

Delete only the generated stills:

```powershell
Remove-Item .renders/ch4-page6-s14-def.png, .renders/ch4-page6-s15-scatter.png, .renders/ch4-page6-s15-contrast.png -ErrorAction SilentlyContinue
```

- [ ] **Step 8: Commit**

```powershell
git add "src/Root.tsx" "docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md"
git commit -m "feat(ch4-p6): register Ch4-Page6-SpriteSheet and sync storyboard"
```

---

## Notes for the implementer

- Frame windows overlap intentionally: S14 fades to opacity 0 by frame 228 (`S14_OUT`), and the S14 block stops rendering at frame 240, while S15 starts rendering at frame 228 and fades in over `S15_IN`. This produces a clean crossfade with no popping.
- `S15` is the final shot; the composition ends at frame 600, so S15 has no fade-out window.
- All animation is frame-driven via `interpolate` / `spring`. Do not introduce CSS transitions.
- Tile colors come only from existing tokens (`CAT_ART`, `RED`, `BLUE`, `YELLOW`, `GREEN`, `CAT_PLAN`, `CAT_CODE`); do not add new colors.
- The page is deliberately left at `🔧 S14–S15 已完成` rather than `✅ 已完成` because S16 still needs an unmade example image.
