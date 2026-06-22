# Chapter 2 Page 10 Ending Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build S27–S28 as a Chapter 2 ending composition that preserves the first episode’s host-photo introduction, continuous credits scroll, and black fade while replacing the material credits with the six sources used in the game-design episode.

**Architecture:** Copy the proven visual structure from `src/scenes/01-實驗介紹/Page10Ending.tsx` into a chapter-specific `Ch2Page10Ending` component. Keep production-team and funding sections unchanged, then render material sources from typed data grouped into image materials and self-recorded gameplay. Extend the composition to 690 frames so the larger source list scrolls at approximately the same readable speed as the first episode.

**Tech Stack:** React, TypeScript, Remotion (`AbsoluteFill`, `Img`, `interpolate`, `spring`, `staticFile`, `useCurrentFrame`, `useVideoConfig`), existing color tokens.

## Global Constraints

- Create `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`; do not modify the first episode’s `Page10Ending.tsx`.
- Register composition ID `Ch2-Page10-Ending`.
- Composition dimensions: 1920 × 1080, 30 fps.
- Composition duration: 690 frames（23 秒）.
- Reuse `public/01-實驗介紹/host-yujia.jpg`; do not duplicate the image.
- Preserve the first episode’s white background, centered 1120px credits canvas, typography hierarchy, and black fade.
- S27 copy:
  - `感謝各位聆聽！`
  - `祝大家開發順利`
- Preserve production-team data:
  - 南臺科技大學 多媒體與電腦娛樂科學系
  - 教授 黃永銘
  - 研究助理 郭育嘉
  - 研究生 李哲偉
  - 經費補助單位：國科會
  - Existing STEAM project name verbatim from `Page10Ending.tsx`
- Group sources under `圖片素材` and `遊戲畫面`.
- Do not display full URLs in the video. Display source domains in small meta text; keep complete URLs in the storyboard document.
- Rhythm Doctor must not display a release date.
- Celeste may display `遊戲發行於 2018/01/25`.
- Dates labeled `查閱於` are access dates, not publication dates.
- Do not claim a creator or publication date when the source page does not provide one.
- Use frame-driven Remotion animation only; no CSS transitions or CSS animations.
- Preserve all unrelated working-tree changes, especially Page 4 and Page 7 edits.
- Do not commit unless the user explicitly requests it.

---

### Task 1: Establish the Chapter 2 ending contract and component shell

**Files:**
- Create: `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`

**Interfaces:**
- Consumes: `public/01-實驗介紹/host-yujia.jpg`.
- Produces: named React component `Ch2Page10Ending`.
- Produces source-data types:

```tsx
type CreditSource = {
  title: string;
  creator: string;
  detail: string;
  domain?: string;
};

type CreditSection = {
  label: "圖片素材" | "遊戲畫面";
  items: CreditSource[];
};
```

- [ ] **Step 1: Run a failing static contract check**

Run:

```powershell
$p='src\scenes\02-遊戲設計\Ch2Page10Ending.tsx'
if(Test-Path $p){ throw 'Unexpected existing component' }
Write-Output 'RED expected: Ch2Page10Ending.tsx does not exist'
exit 1
```

Expected: exit code 1 with the expected missing-component message.

- [ ] **Step 2: Create the component shell and timing**

Copy the imports and visual tokens used by the first episode ending. Define:

```tsx
const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const HOST_PHOTO = staticFile("01-實驗介紹/host-yujia.jpg");

const HOLD_FRAMES = 120;
const SCROLL_START = HOLD_FRAMES;
const SCROLL_END = 660;
const SCROLL_DISTANCE = 3200;
const FADE_START = 630;
const FADE_END = 660;

const FS_TITLE = 60;
const FS_BODY = 32;
const FS_LABEL = 26;
const FS_META = 24;
```

Rationale:

- S27 receives 4 seconds before scrolling.
- S28 receives 18 seconds of scrolling and one final second of black.
- `3200px` is the visually verified distance for the compact two-line source entries: image sources pass the frame around frame 430, gameplay sources around frame 565, and the final entry leaves before the black fade.

- [ ] **Step 3: Implement the shared animation calculations**

Use:

```tsx
const introIn = spring({
  frame,
  fps,
  config: { damping: 14, stiffness: 110 },
});

const scrollY = interpolate(
  frame,
  [SCROLL_START, SCROLL_END],
  [0, -SCROLL_DISTANCE],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  },
);

const blackIn = interpolate(frame, [FADE_START, FADE_END], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

- [ ] **Step 4: Verify the shell compiles**

Run:

```powershell
npm.cmd run lint
```

Expected: ESLint and TypeScript exit with code 0.

### Task 2: Reproduce S27 and the production-team section

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`

**Interfaces:**
- Consumes: `HOST_PHOTO`, `introIn`, and existing theme tokens.
- Produces: S27 introduction and the unchanged production/funding credit blocks.

- [ ] **Step 1: Implement the long scrolling canvas**

Use the same container structure as the first episode:

```tsx
<div
  style={{
    position: "absolute",
    left: 960,
    top: 0,
    transform: `translate(-50%, ${scrollY}px)`,
    width: 1120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  {/* S27 and S28 content */}
</div>
```

- [ ] **Step 2: Implement S27**

Reuse the first episode’s host-photo block:

```tsx
<Img
  src={HOST_PHOTO}
  style={{
    width: 600,
    height: "auto",
    borderRadius: 12,
    boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.12)}`,
  }}
  from={-13}
/>
```

Render:

```text
感謝各位聆聽！
祝大家開發順利
```

Keep the same 100px main title, 46px subtitle, and spring scale from 0.92 to 1.

- [ ] **Step 3: Copy the production-team and funding sections exactly**

After a `360px` gap, render:

1. `製作團隊`
2. `製作單位`
3. `南臺科技大學 多媒體與電腦娛樂科學系`
4. Professor/research-assistant/graduate-student rows
5. Divider
6. `經費補助單位` → `國科會`
7. `計畫名稱` → the existing full STEAM project title

Do not rewrite names, roles, organization, or project title.

- [ ] **Step 4: Render S27 and team checkpoints**

Run:

```powershell
New-Item -ItemType Directory -Force '.renders' | Out-Null
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-s27-intro.png --frame=70 --scale=0.25
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-s28-team.png --frame=250 --scale=0.25
```

Expected:

- Frame 70 shows the complete host photo and both S27 lines.
- Frame 250 shows the production-team section centered and readable.

### Task 3: Add normalized material-source data

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`

**Interfaces:**
- Produces constant `CREDIT_SECTIONS: CreditSection[]`.
- Consumes: no external runtime data.

- [ ] **Step 1: Add the image-material credits**

Use exactly:

```tsx
const CREDIT_SECTIONS: CreditSection[] = [
  {
    label: "圖片素材",
    items: [
      {
        title: "Global Game Jam 2019 at MIT",
        creator: "MIT Game Lab",
        detail: "活動照片 · 活動期間 2019/01/25–2019/01/27",
        domain: "gamelab.mit.edu",
      },
      {
        title: "“Virus Attack” Storyboard",
        creator: "MIT 2.744 Student Submission",
        detail: "發布日期不詳 · 查閱於 2026/05/26",
        domain: "web.mit.edu",
      },
      {
        title: "“Multipanel Storyboard”",
        creator: "STEM Games",
        detail: "發布日期不詳 · 查閱於 2026/05/26",
        domain: "stemgames.org.au",
      },
      {
        title: "“Storyboards and Playboards”",
        creator: "NextGen Blog",
        detail: "發布於 2022/09/14",
        domain: "elliotnextgen.wordpress.com",
      },
    ],
  },
```

Do not label Google Search as the source. Google was only how the source pages were discovered.

- [ ] **Step 2: Add the gameplay credits**

Append:

```tsx
  {
    label: "遊戲畫面",
    items: [
      {
        title: "Celeste",
        creator: "Extremely OK Games",
        detail: "遊戲畫面自行錄製 · 遊戲發行於 2018/01/25",
      },
      {
        title: "Rhythm Doctor",
        creator: "7th Beat Games",
        detail: "遊戲畫面自行錄製",
      },
    ],
  },
];
```

Do not add `2020/06/17` or another release date to Rhythm Doctor.

- [ ] **Step 3: Run a source-data contract check**

Run:

```powershell
$p='src\scenes\02-遊戲設計\Ch2Page10Ending.tsx'
$text=Get-Content -Raw -Encoding utf8 $p
$required=@(
  'Global Game Jam 2019 at MIT',
  '“Virus Attack” Storyboard',
  '“Multipanel Storyboard”',
  '“Storyboards and Playboards”',
  'Celeste',
  'Rhythm Doctor',
  '遊戲畫面自行錄製'
)
$missing=$required | Where-Object { -not $text.Contains($_) }
if($missing.Count){ throw ('Missing credits: '+($missing -join ', ')) }
if($text.Contains('2020/06/17')){ throw 'Rhythm Doctor must not show 2020/06/17' }
'PASS'
```

Expected: `PASS`.

### Task 4: Render grouped material credits and black ending

**Files:**
- Modify: `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`

**Interfaces:**
- Consumes: `CREDIT_SECTIONS`.
- Produces: readable grouped source credits and final black fade.

- [ ] **Step 1: Add the material-source heading**

After the project-title block, use:

```tsx
<div
  style={{
    marginTop: 170,
    fontSize: FS_TITLE,
    fontWeight: 800,
    color: BLUE,
    letterSpacing: 4,
  }}
>
  素材來源
</div>
```

- [ ] **Step 2: Render source sections from data**

For each `CreditSection`:

- Render the section label using `FS_LABEL`, `SUBTLE`, and 48px top spacing.
- Render each item as one title row and one meta row.
- Title row:

```tsx
<div
  style={{
    marginTop: 18,
    maxWidth: 1020,
    fontSize: FS_BODY,
    lineHeight: 1.45,
    color: TEXT_DARK,
    fontWeight: 600,
  }}
>
  {item.title} — {item.creator}
</div>
```

- Meta row:

```tsx
<div
  style={{
    marginTop: 7,
    fontSize: FS_META,
    lineHeight: 1.45,
    color: SUBTLE,
    fontWeight: 500,
  }}
>
  {item.detail}
  {item.domain ? ` · ${item.domain}` : ""}
</div>
```

- Use 28px bottom spacing between items.

- [ ] **Step 3: Add the final black overlay**

At the end of the composition:

```tsx
<AbsoluteFill style={{ backgroundColor: BLACK, opacity: blackIn }} />
```

The overlay must be the last rendered layer.

- [ ] **Step 4: Render material and ending checkpoints**

Run:

```powershell
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-s28-image-sources.png --frame=430 --scale=0.25
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-s28-game-sources.png --frame=565 --scale=0.25
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-s28-fade.png --frame=645 --scale=0.25
npx.cmd remotion still Ch2-Page10-Ending .renders/page10-final-black.png --frame=675 --scale=0.25
```

Expected:

- Image and gameplay source groups are readable without overlap.
- Full URLs are absent.
- Frame 645 is partially darkened.
- Frame 675 is completely black.

### Task 5: Register the composition and synchronize the storyboard document

**Files:**
- Modify: `src/Root.tsx`
- Modify: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`

**Interfaces:**
- Consumes: `Ch2Page10Ending`.
- Produces: registered composition and complete source-reference documentation.

- [ ] **Step 1: Register Page 10**

Add:

```tsx
import { Ch2Page10Ending } from "./scenes/02-遊戲設計/Ch2Page10Ending";
```

Register:

```tsx
<Composition
  id="Ch2-Page10-Ending"
  component={Ch2Page10Ending}
  durationInFrames={690}
  fps={30}
  width={1920}
  height={1080}
/>
```

- [ ] **Step 2: Update the Page 10 production status and duration**

Change the Page 10 status from `⏳ 待製作` to:

```text
🛠️ 初稿完成（含素材來源）
```

Update the Page 10 note to state:

```text
目前 Remotion composition：`Ch2-Page10-Ending`，30 fps、690 frames（約 23 秒）。
```

Do not change the S27 spoken copy unless the user separately confirms new narration.

- [ ] **Step 3: Add complete URLs to the document**

Add a source-reference block after S28:

```markdown
> 素材來源完整連結：
> - Global Game Jam 2019 at MIT — MIT Game Lab  
>   https://gamelab.mit.edu/event/global-game-jam-2019-at-mit/
> - “Virus Attack” Storyboard — MIT 2.744 Student Submission  
>   https://web.mit.edu/2.744/studentSubmissions/conceptSketches/she_wolf/kuklov/storyboard/
> - “Multipanel Storyboard” — STEM Games  
>   https://www.stemgames.org.au/shared/resources/m3.-multipanel1_.svg
> - “Storyboards and Playboards” — NextGen Blog  
>   https://elliotnextgen.wordpress.com/storyboards-and-playboards/
> - Celeste — Extremely OK Games；遊戲畫面自行錄製
> - Rhythm Doctor — 7th Beat Games；遊戲畫面自行錄製
```

- [ ] **Step 4: Verify registration and documentation**

Run:

```powershell
rg -n "Ch2-Page10-Ending|durationInFrames=\{690\}" src/Root.tsx
rg -n "Global Game Jam 2019|Virus Attack|Multipanel Storyboard|Storyboards and Playboards|Rhythm Doctor" "docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md"
```

Expected: composition, duration, and all six source entries are found.

### Task 6: Final verification and cleanup

**Files:**
- Verify: `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`
- Verify: `src/Root.tsx`
- Verify: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`
- Preserve: existing Page 4 and Page 7 working-tree changes

**Interfaces:**
- Produces: verified S27–S28 implementation ready for user review.

- [ ] **Step 1: Run static verification**

Run:

```powershell
npm.cmd run lint
git diff --check
git status --short
```

Expected:

- ESLint and TypeScript exit 0.
- No whitespace errors.
- Existing unrelated changes remain present and untouched.

- [ ] **Step 2: Inspect all rendered checkpoints**

Confirm:

- S27 host photo is complete and not cropped.
- S27 remains static long enough to read.
- Production-team and funding sections match Episode 1.
- All six source entries appear exactly once.
- Source groups and meta text are readable at 1920 × 1080.
- Credits fully leave the frame before the black overlay completes.

- [ ] **Step 3: Remove temporary render files**

Resolve `.renders`, verify each generated filename begins with `page10-`, and delete only those PNG files. Remove `.renders` only if empty afterward.

- [ ] **Step 4: Report for review**

Report:

- Composition ID and duration
- S27 timing
- Material-source grouping
- Rhythm Doctor date omission
- lint and visual-verification results

Do not commit until the user explicitly requests it.
