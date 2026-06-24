# 第 3 集第 13 頁（S24 結尾）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立第 3 集 S24 結尾 composition，沿用第 2 集片尾版型，只調整素材來源為 Rhythm Doctor 與 Celeste 兩款遊戲。

**Architecture:** 以 `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx` 為模板，新增一個第 3 集專用 scene：`Ch3Page13Ending.tsx`。片尾仍是「主持人照片＋感謝文字」停留後，整張畫布上捲顯示製作團隊、補助計畫、計畫名稱、素材來源，最後淡入黑場。`Root.tsx` 註冊新 composition `Ch3-Page13-Ending`，不改 S23。

**Tech Stack:** Remotion 4、React 19、TypeScript；動畫使用 `useCurrentFrame()`、`spring()`、`interpolate()`；圖片使用 Remotion `Img` 與 `staticFile()`；測試使用 Node 內建 `node:test` 讀取原始碼字串。

## Global Constraints

- 不修改 `src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx`。
- 直接參考 `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx` 的版型與時間軸。
- 主持人照片沿用 `staticFile("01-實驗介紹/host-yujia.jpg")`。
- 素材來源只保留「遊戲畫面」一節，且只列 `Rhythm Doctor` 與 `Celeste`。
- 不載入或播放遊戲影片；素材來源只是片尾文字引用。
- Composition ID 使用 `Ch3-Page13-Ending`。
- Scene export 使用 `export const Ch3Page13Ending: React.FC`。
- Duration 初始沿用第 2 集片尾 `690` frames；若目視檢查發現兩筆素材來源讓捲動停留過長，可在實作時縮短，但測試需同步鎖定實際值。
- `npm run lint` 必須通過。

---

## File Structure

```
src/scenes/03-程式實作/Ch3Page13Ending.tsx
  第 3 集 S24 結尾 scene；大部分複用 Ch2Page10Ending 版型，素材來源縮為兩款遊戲。

src/Root.tsx
  import 並註冊 Ch3-Page13-Ending composition。

tests/ch3-page13-ending.test.mjs
  以字串斷言 scene、素材來源與 Root 註冊。

docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md
  實作完成後，將第 13 頁狀態更新為已完成。
```

---

## Task 1: 新增第 3 集 S24 Ending Scene 與測試

**Files:**
- Create: `tests/ch3-page13-ending.test.mjs`
- Create: `src/scenes/03-程式實作/Ch3Page13Ending.tsx`

**Interfaces:**
- Produces: `export const Ch3Page13Ending: React.FC`
- Consumes: `staticFile("01-實驗介紹/host-yujia.jpg")` and theme colors from `../../theme/colors`

- [ ] **Step 1: Write the failing test**

Create `tests/ch3-page13-ending.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sceneDir = new URL("../src/scenes/03-程式實作/", import.meta.url);
const readScene = (name) => readFile(new URL(name, sceneDir), "utf8");
const readRoot = () => readFile(new URL("../src/Root.tsx", import.meta.url), "utf8");

test("S24 ending scene keeps the shared ending layout and host photo", async () => {
  const page = await readScene("Ch3Page13Ending.tsx");
  assert.match(page, /export const Ch3Page13Ending: React\.FC/);
  assert.match(page, /staticFile\("01-實驗介紹\/host-yujia\.jpg"\)/);
  assert.match(page, /感謝各位聆聽！/);
  assert.match(page, /祝大家開發順利/);
  assert.match(page, /製作團隊/);
  assert.match(page, /素材來源/);
});

test("S24 ending credits only keep Rhythm Doctor and Celeste game references", async () => {
  const page = await readScene("Ch3Page13Ending.tsx");
  assert.match(page, /label: "遊戲畫面"/);
  assert.match(page, /title: "Rhythm Doctor"/);
  assert.match(page, /creator: "7th Beat Games"/);
  assert.match(page, /title: "Celeste"/);
  assert.match(page, /creator: "Extremely OK Games"/);

  assert.doesNotMatch(page, /label: "圖片素材"/);
  assert.doesNotMatch(page, /Global Game Jam/);
  assert.doesNotMatch(page, /Storyboard/);
  assert.doesNotMatch(page, /STEM Games/);
  assert.doesNotMatch(page, /NextGen Blog/);
});

test("Root registers Ch3-Page13-Ending", async () => {
  const root = await readRoot();
  assert.match(root, /import \{ Ch3Page13Ending \}/);
  assert.match(root, /id="Ch3-Page13-Ending"/);
  assert.match(root, /component=\{Ch3Page13Ending\}/);
  assert.match(
    root,
    /component=\{Ch3Page13Ending\}[\s\S]*?durationInFrames=\{690\}/,
  );
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/ch3-page13-ending.test.mjs
```

Expected: FAIL because `Ch3Page13Ending.tsx` does not exist and `Root.tsx` has no registration yet.

- [ ] **Step 3: Create the S24 scene from the Ch2 ending template**

Create `src/scenes/03-程式實作/Ch3Page13Ending.tsx` by copying `src/scenes/02-遊戲設計/Ch2Page10Ending.tsx`, then make these exact changes:

```tsx
// Rename the export:
export const Ch3Page13Ending: React.FC = () => {
```

Use this `CREDIT_SECTIONS` value:

```tsx
const CREDIT_SECTIONS: CreditSection[] = [
  {
    label: "遊戲畫面",
    items: [
      {
        title: "Rhythm Doctor",
        creator: "7th Beat Games",
        detail: "遊戲畫面自行錄製",
      },
      {
        title: "Celeste",
        creator: "Extremely OK Games",
        detail: "遊戲畫面自行錄製 · 遊戲發行於 2018/01/25",
      },
    ],
  },
];
```

Keep the existing `HOST_PHOTO`, `PROJECT_NAME`, scroll timing constants, typography constants, and JSX layout unless a lint error requires a small cleanup.

- [ ] **Step 4: Run the scene test again**

Run:

```bash
node --test tests/ch3-page13-ending.test.mjs
```

Expected: The first two tests pass; the Root registration test still fails.

---

## Task 2: Register `Ch3-Page13-Ending`

**Files:**
- Modify: `src/Root.tsx`
- Test: `tests/ch3-page13-ending.test.mjs`

**Interfaces:**
- Consumes: `Ch3Page13Ending` from `./scenes/03-程式實作/Ch3Page13Ending`
- Produces: Remotion composition `Ch3-Page13-Ending`

- [ ] **Step 1: Add the import**

In `src/Root.tsx`, add this import near the other 第 3 集 imports:

```tsx
import { Ch3Page13Ending } from "./scenes/03-程式實作/Ch3Page13Ending";
```

- [ ] **Step 2: Add the composition after S23**

In `src/Root.tsx`, immediately after the existing `Ch3-Page12-Fundamentals` composition, add:

```tsx
      <Composition
        id="Ch3-Page13-Ending"
        component={Ch3Page13Ending}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
```

- [ ] **Step 3: Run the targeted test**

Run:

```bash
node --test tests/ch3-page13-ending.test.mjs
```

Expected: PASS, 3 tests.

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS. If it fails with an unused import from the copied file, remove only that unused import.

---

## Task 3: Update Storyboard Progress After Verification

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Test: `rg -n "Ch3-Page13-Ending|S24" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"`

**Interfaces:**
- Consumes: Verified `Ch3-Page13-Ending` composition
- Produces: Storyboard progress table showing S24 complete

- [ ] **Step 1: Update the progress table**

Change the Page 13 row from:

```md
| 13 | `Ch3-Page13-Ending` | S24 | 感謝與收尾 | 知點 logo | ⏳ 待製作 |
```

to:

```md
| 13 | `Ch3-Page13-Ending` | S24 | 感謝與收尾 | 知點 logo | ✅ 已完成 |
```

- [ ] **Step 2: Confirm the row**

Run:

```bash
rg -n "Ch3-Page13-Ending|S24" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: The Page 13 row shows `✅ 已完成`; the S24 storyboard section remains unchanged.

---

## Final Verification

- [ ] Run targeted tests:

```bash
node --test tests/ch3-page13-ending.test.mjs
```

- [ ] Run lint:

```bash
npm run lint
```

- [ ] Optional one-frame render check:

```bash
npx remotion still Ch3-Page13-Ending --scale=0.25 --frame=120
```

Expected visual at frame 120: white background, host photo, `感謝各位聆聽！`, and `祝大家開發順利`.

- [ ] Optional mid-scroll render check:

```bash
npx remotion still Ch3-Page13-Ending --scale=0.25 --frame=520
```

Expected visual at frame 520: ending credits are scrolling; no picture-material credits appear; only the two game references appear under `遊戲畫面`.

## Self-Review

- S24 uses the Ch2 ending layout as requested.
- Only asset reference requiring `staticFile()` is the existing host photo.
- Credits list keeps only Rhythm Doctor and Celeste under game footage.
- S23 is untouched.
- Root has a dedicated `Ch3-Page13-Ending` composition.
- Tests cover scene text, restricted credit list, and Root registration.
