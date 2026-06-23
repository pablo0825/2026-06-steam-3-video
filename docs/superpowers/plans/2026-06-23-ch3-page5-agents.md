# Ch3 Page 5 AGENTS.md (S11–S13) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the fixed S11–S12 `AGENTS.md` concept animation and a separate S13 screen-recording placeholder, with each visual responsibility isolated for easier maintenance.

**Architecture:** Use four focused components. `Ch3Page5AgentsDefinition` renders only S11's minimal definition. `Ch3Page5AgentsFlow` renders only S12's question + rules → AI → compliant answer flow. `Ch3Page5Agents` sequences those two fixed shots into one 510-frame composition. `Ch3Page5AgentsDemo` is a separate 180-frame guide/placeholder for the single continuous S13 recording, so the final editor can replace or extend it without changing S11–S12 timing.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Easing`, `interpolate`, `Sequence`, `spring`, `useCurrentFrame`, `useVideoConfig`), shared theme tokens from `src/theme/colors.ts`.

## Global Constraints

- Fixed animation composition ID: `Ch3-Page5-Agents`.
- Fixed animation duration: 510 frames at 30 fps, 1920 × 1080.
- S11 occupies frames `0–150` (5 seconds).
- S12 occupies frames `150–510` (12 seconds).
- Demo placeholder composition ID: `Ch3-Page5-AgentsDemo`.
- Demo placeholder duration: 180 frames at 30 fps, 1920 × 1080; the real screen recording may be longer in DaVinci Resolve.
- S11 contains only title `AGENTS.md` and definition `讓 AI 了解專案需求與協作規則`.
- In S11, highlight `專案需求` and `協作規則` in yellow.
- S12 contains four semantic units: `使用者問題`, `AGENTS.md`, `AI`, and `符合專案規則的回答`.
- S12 visual flow is `使用者問題 + AGENTS.md → AI → 符合專案規則的回答`.
- S13 is one continuous recording, not two separate shots: create `AGENTS.md` → write `請使用日文回覆` → open a new Codex conversation → ask a short question → verify the response follows the rule.
- Use `AGENTS.md` everywhere; never use singular `AGENT.md`.
- Use only frame-driven Remotion animation; no CSS transitions, CSS animations, or Tailwind animation classes.
- Use the established white background, dark text, yellow emphasis, blue semantic nodes, and warm-gray card borders.
- Do not create a fake code editor or fake Codex response in S13; the placeholder describes required recording steps only.
- Do not commit the final documentation/status task until the user has reviewed the animation or explicitly requests a commit.

---

### Task 1: Create the S11 definition component

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx`

**Interfaces:**
- Consumes: `TEXT_DARK`, `SUBTLE`, `WHITE`, `YELLOW`.
- Produces: named component `Ch3Page5AgentsDefinition`, designed for a 150-frame local timeline.

- [ ] **Step 1: Verify the component does not exist**

Run:

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsDefinition.tsx does not exist'
  exit 1
}
```

Expected: exit 1 with `RED: Ch3Page5AgentsDefinition.tsx does not exist`.

- [ ] **Step 2: Create the complete S11 component**

Create `src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx`:

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

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Ch3Page5AgentsDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, [34, 58], [0, 1], clamp);
  const out = interpolate(frame, [126, 148], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          fontSize: 94,
          fontWeight: 900,
          letterSpacing: 3,
          color: TEXT_DARK,
          opacity: titleIn,
          transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
        }}
      >
        AGENTS.md
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
        讓 AI 了解
        <span style={{ color: YELLOW, fontWeight: 800 }}>專案需求</span>
        與
        <span style={{ color: YELLOW, fontWeight: 800 }}>協作規則</span>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Verify S11 lint and render**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0.

Task 3 registers the parent composition before a still can be rendered.

### Task 2: Create the S12 flow component

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx`

**Interfaces:**
- Consumes: `BLUE`, `CARD_BORDER`, `SUBTLE`, `TEXT_DARK`, `WHITE`, `YELLOW`, `withAlpha`.
- Produces: named component `Ch3Page5AgentsFlow`, designed for a 360-frame local timeline.

- [ ] **Step 1: Write a failing structural assertion**

Run:

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsFlow.tsx does not exist'
  exit 1
}
```

Expected: exit 1 with `RED: Ch3Page5AgentsFlow.tsx does not exist`.

- [ ] **Step 2: Create the complete S12 flow**

Create `src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx`:

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
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {
  ...clamp,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const CARD_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 390,
  height: 150,
  borderRadius: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: WHITE,
  border: `3px solid ${CARD_BORDER}`,
  boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
};

export const Ch3Page5AgentsFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const questionIn = interpolate(frame, [42, 72], [0, 1], ease);
  const rulesIn = interpolate(frame, [82, 112], [0, 1], ease);
  const inputLines = interpolate(frame, [118, 158], [0, 1], ease);
  const aiIn = spring({
    frame: frame - 148,
    fps,
    config: { damping: 17, stiffness: 115, overshootClamping: true },
  });
  const outputLine = interpolate(frame, [196, 230], [0, 1], ease);
  const answerIn = spring({
    frame: frame - 220,
    fps,
    config: { damping: 18, stiffness: 115, overshootClamping: true },
  });
  const transitionIn = interpolate(frame, [306, 334], [0, 1], ease);
  const out = interpolate(frame, [338, 358], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        fontFamily: FONT,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 112,
          transform: `translateX(-50%) scale(${interpolate(
            titleIn,
            [0, 1],
            [0.94, 1],
          )})`,
          opacity: titleIn,
          fontSize: 60,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        每次對話，AI 都會參考兩項資訊
      </div>

      <div
        style={{
          ...CARD_STYLE,
          left: 250,
          top: 270,
          opacity: questionIn,
          transform: `translateY(${interpolate(
            questionIn,
            [0, 1],
            [28, 0],
          )}px)`,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800, color: SUBTLE }}>
          這次的要求
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 38,
            fontWeight: 900,
            color: TEXT_DARK,
          }}
        >
          使用者問題
        </div>
      </div>

      <div
        style={{
          ...CARD_STYLE,
          right: 250,
          top: 270,
          opacity: rulesIn,
          transform: `translateY(${interpolate(
            rulesIn,
            [0, 1],
            [28, 0],
          )}px)`,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800, color: SUBTLE }}>
          專案的長期規則
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 38,
            fontWeight: 900,
            color: BLUE,
          }}
        >
          AGENTS.md
        </div>
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <marker
            id="agents-arrow-blue"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M0,0 L12,6 L0,12 Z" fill={BLUE} />
          </marker>
          <marker
            id="agents-arrow-yellow"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M0,0 L12,6 L0,12 Z" fill={YELLOW} />
          </marker>
        </defs>
        <path
          d="M640 345 C735 345 780 430 850 478"
          fill="none"
          stroke={BLUE}
          strokeWidth="6"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-blue)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - inputLines}
        />
        <path
          d="M1280 345 C1185 345 1140 430 1070 478"
          fill="none"
          stroke={BLUE}
          strokeWidth="6"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-blue)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - inputLines}
        />
        <path
          d="M960 620 L960 735"
          fill="none"
          stroke={YELLOW}
          strokeWidth="7"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-yellow)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - outputLine}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          width: 190,
          height: 190,
          transform: `translate(-50%, -50%) scale(${interpolate(
            aiIn,
            [0, 1],
            [0.86, 1],
          )})`,
          opacity: aiIn,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 54,
          fontWeight: 900,
          letterSpacing: 4,
          color: WHITE,
          backgroundColor: BLUE,
          boxShadow: `0 18px 42px ${withAlpha(BLUE, 0.24)}`,
        }}
      >
        AI
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 830,
          width: 760,
          minHeight: 128,
          transform: `translate(-50%, -50%) translateY(${interpolate(
            answerIn,
            [0, 1],
            [28, 0],
          )}px)`,
          opacity: answerIn,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 900,
          color: TEXT_DARK,
          backgroundColor: withAlpha(YELLOW, 0.1),
          border: `3px solid ${withAlpha(YELLOW, 0.7)}`,
        }}
      >
        符合
        <span style={{ color: YELLOW, margin: "0 10px" }}>專案規則</span>
        的回答
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          bottom: 58,
          transform: `translateX(-50%) translateY(${interpolate(
            transitionIn,
            [0, 1],
            [18, 0],
          )}px)`,
          opacity: transitionIn,
          fontSize: 28,
          fontWeight: 800,
          color: BLUE,
          letterSpacing: 2,
        }}
      >
        接下來實際建立並驗證 AGENTS.md →
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Verify S12 lint**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit 0.

### Task 3: Sequence S11–S12 and register the fixed composition

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page5Agents.tsx`
- Modify: `src/Root.tsx`

**Interfaces:**
- Consumes: `Ch3Page5AgentsDefinition`, `Ch3Page5AgentsFlow`.
- Produces: `Ch3Page5Agents` and composition `Ch3-Page5-Agents`.

- [ ] **Step 1: Create the parent sequence**

Create `src/scenes/03-程式實作/Ch3Page5Agents.tsx`:

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Ch3Page5AgentsDefinition } from "./Ch3Page5AgentsDefinition";
import { Ch3Page5AgentsFlow } from "./Ch3Page5AgentsFlow";

export const Ch3Page5Agents: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={150}>
        <Ch3Page5AgentsDefinition />
      </Sequence>
      <Sequence from={150} durationInFrames={360}>
        <Ch3Page5AgentsFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Register the fixed composition**

Add imports after `Ch3Page4Context`:

```tsx
import { Ch3Page5Agents } from "./scenes/03-程式實作/Ch3Page5Agents";
```

Add after `Ch3-Page4-Context`:

```tsx
      <Composition
        id="Ch3-Page5-Agents"
        component={Ch3Page5Agents}
        durationInFrames={510}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 3: Render S11 and S12 keyframes**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s11.png --frame=90 --scale=0.25
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s12-inputs.png --frame=310 --scale=0.25
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s12-answer.png --frame=430 --scale=0.25
```

Expected:

- Frame 90 shows only the S11 title and definition.
- Frame 310 shows `使用者問題` and `AGENTS.md` feeding into `AI`.
- Frame 430 shows the output answer card and no clipped text/arrows.
- ESLint and TypeScript exit 0.

- [ ] **Step 4: Commit the fixed animation**

```powershell
git add -- `
  'src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx' `
  'src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx' `
  'src/scenes/03-程式實作/Ch3Page5Agents.tsx' `
  'src/Root.tsx'
git commit -m "feat(ch3-p5): add AGENTS.md concept animation"
```

### Task 4: Create the single S13 demo placeholder

**Files:**
- Create: `src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx`
- Modify: `src/Root.tsx`

**Interfaces:**
- Produces: `Ch3Page5AgentsDemo` and composition `Ch3-Page5-AgentsDemo`.
- The final editor replaces or extends this placeholder with one continuous screen recording.

- [ ] **Step 1: Write a failing structural assertion**

Run:

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsDemo.tsx does not exist'
  exit 1
}
```

Expected: exit 1.

- [ ] **Step 2: Create the demo placeholder**

Create `src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx`:

```tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  DASH_BORDER,
  PANEL_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const STEPS = [
  "建立 AGENTS.md",
  "寫入「請使用日文回覆」",
  "開啟新對話並提問",
  "確認規則生效",
] as const;

export const Ch3Page5AgentsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 115 },
  });
  const contentIn = interpolate(frame, [18, 42], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(
            titleIn,
            [0, 1],
            [0.92, 1],
          )})`,
          opacity: titleIn,
          fontSize: 68,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
        }}
      >
        實際操作 AGENTS.md
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 250,
          transform: "translateX(-50%)",
          display: "flex",
          gap: 18,
          opacity: contentIn,
        }}
      >
        {STEPS.map((step, index) => (
          <div
            key={step}
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 800,
              color: BLUE,
              backgroundColor: `${BLUE}12`,
              whiteSpace: "nowrap",
            }}
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 650,
          width: 1240,
          height: 600,
          transform: "translate(-50%, -50%)",
          opacity: contentIn,
          borderRadius: 28,
          border: `4px dashed ${DASH_BORDER}`,
          backgroundColor: PANEL_BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div style={{ fontSize: 100 }}>🎬</div>
        <div style={{ fontSize: 46, fontWeight: 900, color: TEXT_DARK }}>
          連續螢幕錄影待補
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: SUBTLE }}>
          建立規則 → 開啟新對話 → 驗證回覆
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Register the demo placeholder**

Add:

```tsx
import { Ch3Page5AgentsDemo } from "./scenes/03-程式實作/Ch3Page5AgentsDemo";
```

Register:

```tsx
      <Composition
        id="Ch3-Page5-AgentsDemo"
        component={Ch3Page5AgentsDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 4: Verify and render the placeholder**

Run:

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page5-AgentsDemo .renders/ch3-page5-s13-demo.png --frame=90 --scale=0.25
```

Expected:

- One placeholder contains all four continuous recording steps.
- There is no separate S12/S13 recording composition.
- ESLint and TypeScript exit 0.

### Task 5: Synchronize the storyboard and run final verification

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Verify: all Page 5 components and `src/Root.tsx`.

- [ ] **Step 1: Update the progress table**

Replace the Page 5 row with:

```text
| 5 | `Ch3-Page5-Agents`／`Ch3-Page5-AgentsDemo` | S11–S13 | `AGENTS.md` 定義、運作方式與連續實機示範 | SVG 動畫＋螢幕錄影 | ✅ 已完成 |
```

- [ ] **Step 2: Split the storyboard responsibilities**

Replace the current S11–S13 rows with:

```text
| S11 | AGENTS.md 是跟 AI 協作時的重要文件。 | 5 | 極簡定義版型：標題「AGENTS.md」，定義「讓 AI 了解專案需求與協作規則」；黃色強調「專案需求」「協作規則」。 | 文字卡 | 標題縮放彈入 → 定義句淡入 → 停留 → 淡出。 |
| S12 | 每次跟 AI 對話時，除了我們提出的問題，AI 還會讀取這份文件，了解專案需求，讓它提供的回答更符合我們的要求。接下來實際操作給大家看，了解怎麼建立 AGENTS.md，以及它的功能。 | 12 | 「使用者問題」與「AGENTS.md」兩張卡匯入 AI，AI 再輸出「符合專案規則的回答」；下方顯示實際操作提示。 | SVG動畫 | 問題卡進場 → 規則卡進場 → 連線匯入 AI → 回答卡展開 → 實際操作提示淡入。 |
| S13 | （實機示範，依操作內容講解） | 依錄影 | 一段連續錄影：建立 `AGENTS.md` → 寫入「請使用日文回覆」→ 開啟新的 Codex 對話並提問 → 確認回覆遵守規則。 | 螢幕錄影 | 只使用一段連續錄影；等待回覆可加速，重要檔名、規則文字與實際回覆維持正常速度；結尾淡出至 Spec。 |
```

- [ ] **Step 3: Update recording notes**

Change `S12–S13：建立並驗證 AGENTS.md` to:

```text
- S13：以一段連續錄影建立並驗證 `AGENTS.md`。
```

Change the timing note from `S12–S13、S19–S21` to `S13、S19–S21`.

- [ ] **Step 4: Run final verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit 0.
- No whitespace errors.
- Changes are limited to the Page 5 components, `Root.tsx`, storyboard, and this plan.

- [ ] **Step 5: Inspect and remove temporary renders**

Inspect:

- `.renders/ch3-page5-s11.png`
- `.renders/ch3-page5-s12-inputs.png`
- `.renders/ch3-page5-s12-answer.png`
- `.renders/ch3-page5-s13-demo.png`

Confirm typography consistency, readable arrows, no overlap, and one unified S13 recording placeholder. Resolve each path and remove only `.renders/ch3-page5-*.png`.

- [ ] **Step 6: Report for review**

Report:

- `Ch3-Page5-Agents`: 510 frames, S11–S12.
- `Ch3-Page5-AgentsDemo`: 180-frame S13 placeholder.
- Lint and visual verification results.
- Do not commit until the user reviews the animation or explicitly requests a commit.

---

## Self-Review

- **Spec coverage:** S11 definition is Task 1; S12 flow is Task 2; separate maintainable files and fixed sequencing are Task 3; combined S13 recording is Task 4; storyboard synchronization is Task 5.
- **Placeholder scan:** The only placeholder is the intentional S13 recording guide, with exact recording steps and replacement behavior.
- **Type consistency:** All exported component names match `Root.tsx`; S11 and S12 local durations sum to 510 frames; the demo uses its own 180-frame composition.
- **Scope:** This plan does not implement the real screen recording or modify S14 onward.
