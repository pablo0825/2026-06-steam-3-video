# Ch3 Page 5 AGENTS.md（S11–S13）實作計畫

> **給執行此計畫的代理：** 必須使用 `superpowers:subagent-driven-development`（建議）或 `superpowers:executing-plans`，逐項執行本計畫。所有步驟以核取方塊（`- [ ]`）追蹤進度。

**目標：** 製作固定的 S11–S12 `AGENTS.md` 概念動畫，以及獨立的 S13 螢幕錄影佔位畫面。不同視覺職責分開處理，方便後續維護。

**架構：** 使用四個職責單一的元件。`Ch3Page5AgentsDefinition` 只負責 S11 的簡短定義；`Ch3Page5AgentsFlow` 只負責 S12 的「問題＋規則 → AI → 符合規則的回答」流程；`Ch3Page5Agents` 將前兩個固定畫面串成一個 510 幀的 Composition；`Ch3Page5AgentsDemo` 則是獨立的 180 幀 S13 連續操作指引／佔位畫面。後續可在剪輯軟體中替換或延長 S13，不影響 S11–S12 的時間安排。

**技術：** React、TypeScript、Remotion（`AbsoluteFill`、`Easing`、`interpolate`、`Sequence`、`spring`、`useCurrentFrame`、`useVideoConfig`），並使用 `src/theme/colors.ts` 的共用色彩。

## 全域限制

- 固定動畫 Composition ID：`Ch3-Page5-Agents`。
- 固定動畫長度：510 幀，30 fps，1920 × 1080。
- S11 使用第 `0–150` 幀，共 5 秒。
- S12 使用第 `150–510` 幀，共 12 秒。
- 示範佔位 Composition ID：`Ch3-Page5-AgentsDemo`。
- 示範佔位長度：180 幀，30 fps，1920 × 1080；正式螢幕錄影可在 DaVinci Resolve 中延長。
- S11 只顯示標題 `AGENTS.md` 與定義「讓 AI 了解專案需求與協作規則」。
- S11 的「專案需求」與「協作規則」使用黃色強調。
- S12 包含四個語意單位：「使用者問題」、「AGENTS.md」、「AI」、「符合專案規則的回答」。
- S12 的視覺流程為「使用者問題 + AGENTS.md → AI → 符合專案規則的回答」。
- S13 使用一段連續錄影，不拆成兩個畫面：建立 `AGENTS.md` → 寫入「請使用日文回覆」→ 開啟新的 Codex 對話 → 提出簡短問題 → 確認回答遵守規則。
- 全部使用 `AGENTS.md`，不可寫成單數的 `AGENT.md`。
- 動畫只能由 Remotion 幀數驅動，不使用 CSS transition、CSS animation 或 Tailwind 動畫類別。
- 沿用既有白底、深色文字、黃色強調、藍色語意節點與暖灰色卡片邊框。
- S13 不製作假的程式碼編輯器或假的 Codex 回覆；佔位畫面只說明正式錄影需要包含的步驟。
- 使用者尚未檢視動畫或明確要求 commit 前，不提交最後的文件與狀態更新。

---

### Task 1：建立 S11 定義元件

**檔案：**

- 新增：`src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx`

**介面：**

- 使用：`TEXT_DARK`、`SUBTLE`、`WHITE`、`YELLOW`。
- 產出：具名元件 `Ch3Page5AgentsDefinition`，使用 150 幀的區域時間軸。

- [ ] **Step 1：確認元件尚不存在**

執行：

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsDefinition.tsx does not exist'
  exit 1
}
```

預期：以 exit code 1 結束，並顯示：

```text
RED: Ch3Page5AgentsDefinition.tsx does not exist
```

- [ ] **Step 2：建立完整的 S11 元件**

依英文原始計畫 Task 1 Step 2 的完整程式碼，建立：

`src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx`

實作要求：

- 使用 `spring` 讓 `AGENTS.md` 標題縮放進場。
- 定義句稍後淡入。
- 「專案需求」與「協作規則」使用 `YELLOW`。
- 第 126–148 幀淡出，銜接 S12。
- 不加入其他說明卡片或圖示。

- [ ] **Step 3：檢查 S11 lint**

執行：

```powershell
npm.cmd run lint
```

預期：ESLint 與 TypeScript 皆以 exit code 0 結束。

需要等 Task 3 註冊父層 Composition 後，才能輸出靜態畫面。

### Task 2：建立 S12 流程元件

**檔案：**

- 新增：`src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx`

**介面：**

- 使用：`BLUE`、`CARD_BORDER`、`SUBTLE`、`TEXT_DARK`、`WHITE`、`YELLOW`、`withAlpha`。
- 產出：具名元件 `Ch3Page5AgentsFlow`，使用 360 幀的區域時間軸。

- [ ] **Step 1：執行預期失敗的結構檢查**

執行：

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsFlow.tsx does not exist'
  exit 1
}
```

預期：以 exit code 1 結束，並顯示：

```text
RED: Ch3Page5AgentsFlow.tsx does not exist
```

- [ ] **Step 2：建立完整的 S12 流程**

依英文原始計畫 Task 2 Step 2 的完整程式碼，建立：

`src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx`

實作要求：

- 標題為「每次對話，AI 都會參考兩項資訊」。
- 左側卡片顯示「這次的要求／使用者問題」。
- 右側卡片顯示「專案的長期規則／AGENTS.md」。
- 兩張卡片依序進場，再以藍色箭頭匯入中央的 `AI` 節點。
- `AI` 節點出現後，以黃色箭頭連接到「符合專案規則的回答」。
- 輸入箭頭使用 `agents-arrow-blue`。
- 輸出箭頭使用 `agents-arrow-yellow`，避免黃色路徑搭配藍色箭頭。
- 最後顯示「接下來實際建立並驗證 AGENTS.md →」。
- 第 338–358 幀淡出。

- [ ] **Step 3：檢查 S12 lint**

執行：

```powershell
npm.cmd run lint
```

預期：ESLint 與 TypeScript 皆以 exit code 0 結束。

### Task 3：串接 S11–S12 並註冊固定動畫

**檔案：**

- 新增：`src/scenes/03-程式實作/Ch3Page5Agents.tsx`
- 修改：`src/Root.tsx`

**介面：**

- 使用：`Ch3Page5AgentsDefinition`、`Ch3Page5AgentsFlow`。
- 產出：`Ch3Page5Agents` 與 Composition `Ch3-Page5-Agents`。

- [ ] **Step 1：建立父層 Sequence**

建立 `src/scenes/03-程式實作/Ch3Page5Agents.tsx`：

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

- [ ] **Step 2：註冊固定動畫 Composition**

在 `Ch3Page4Context` 的 import 後加入：

```tsx
import { Ch3Page5Agents } from "./scenes/03-程式實作/Ch3Page5Agents";
```

在 `Ch3-Page4-Context` 後加入：

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

- [ ] **Step 3：輸出 S11 與 S12 關鍵幀**

執行：

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s11.png --frame=90 --scale=0.25
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s12-inputs.png --frame=310 --scale=0.25
npx.cmd remotion still Ch3-Page5-Agents .renders/ch3-page5-s12-answer.png --frame=430 --scale=0.25
```

預期：

- 第 90 幀只顯示 S11 標題與定義。
- 第 310 幀顯示「使用者問題」與 `AGENTS.md` 匯入 `AI`。
- 第 430 幀顯示輸出回答卡，文字與箭頭不得被裁切。
- ESLint 與 TypeScript 皆以 exit code 0 結束。

- [ ] **Step 4：提交固定動畫**

```powershell
git add -- `
  'src/scenes/03-程式實作/Ch3Page5AgentsDefinition.tsx' `
  'src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx' `
  'src/scenes/03-程式實作/Ch3Page5Agents.tsx' `
  'src/Root.tsx'
git commit -m "feat(ch3-p5): add AGENTS.md concept animation"
```

### Task 4：建立單一的 S13 操作佔位畫面

**檔案：**

- 新增：`src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx`
- 修改：`src/Root.tsx`

**介面：**

- 產出：`Ch3Page5AgentsDemo` 與 Composition `Ch3-Page5-AgentsDemo`。
- 最終剪輯時，以一段連續的螢幕錄影取代或延長此佔位畫面。

- [ ] **Step 1：執行預期失敗的結構檢查**

執行：

```powershell
$p='src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx'
if (-not (Test-Path $p)) {
  Write-Output 'RED: Ch3Page5AgentsDemo.tsx does not exist'
  exit 1
}
```

預期：以 exit code 1 結束。

- [ ] **Step 2：建立示範佔位畫面**

依英文原始計畫 Task 4 Step 2 的完整程式碼，建立：

`src/scenes/03-程式實作/Ch3Page5AgentsDemo.tsx`

畫面需包含下列四個步驟：

1. 建立 `AGENTS.md`
2. 寫入「請使用日文回覆」
3. 開啟新對話並提問
4. 確認規則生效

實作要求：

- 標題為「實際操作 AGENTS.md」。
- 中央以虛線框顯示「連續螢幕錄影待補」。
- 補充文字為「建立規則 → 開啟新對話 → 驗證回覆」。
- 不模擬實際編輯器或 Codex 介面。

- [ ] **Step 3：註冊示範佔位 Composition**

加入 import：

```tsx
import { Ch3Page5AgentsDemo } from "./scenes/03-程式實作/Ch3Page5AgentsDemo";
```

註冊：

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

- [ ] **Step 4：檢查並輸出佔位畫面**

執行：

```powershell
npm.cmd run lint
npx.cmd remotion still Ch3-Page5-AgentsDemo .renders/ch3-page5-s13-demo.png --frame=90 --scale=0.25
```

預期：

- 單一佔位畫面包含四個連續操作步驟。
- 不建立分開的 S12／S13 錄影 Composition。
- ESLint 與 TypeScript 皆以 exit code 0 結束。

### Task 5：同步分鏡文件並進行最終驗證

**檔案：**

- 修改：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- 驗證：全部 Page 5 元件與 `src/Root.tsx`。

- [ ] **Step 1：更新進度表**

將 Page 5 的列替換為：

```text
| 5 | `Ch3-Page5-Agents`／`Ch3-Page5-AgentsDemo` | S11–S13 | `AGENTS.md` 定義、運作方式與連續實機示範 | SVG 動畫＋螢幕錄影 | ✅ 已完成 |
```

- [ ] **Step 2：重新劃分分鏡職責**

將目前的 S11–S13 替換為：

```text
| S11 | AGENTS.md 是跟 AI 協作時的重要文件。 | 5 | 極簡定義版型：標題「AGENTS.md」，定義「讓 AI 了解專案需求與協作規則」；黃色強調「專案需求」「協作規則」。 | 文字卡 | 標題縮放彈入 → 定義句淡入 → 停留 → 淡出。 |
| S12 | 每次跟 AI 對話時，除了我們提出的問題，AI 還會讀取這份文件，了解專案需求，讓它提供的回答更符合我們的要求。接下來實際操作給大家看，了解怎麼建立 AGENTS.md，以及它的功能。 | 12 | 「使用者問題」與「AGENTS.md」兩張卡匯入 AI，AI 再輸出「符合專案規則的回答」；下方顯示實際操作提示。 | SVG動畫 | 問題卡進場 → 規則卡進場 → 連線匯入 AI → 回答卡展開 → 實際操作提示淡入。 |
| S13 | （實機示範，依操作內容講解） | 依錄影 | 一段連續錄影：建立 `AGENTS.md` → 寫入「請使用日文回覆」→ 開啟新的 Codex 對話並提問 → 確認回覆遵守規則。 | 螢幕錄影 | 只使用一段連續錄影；等待回覆可加速，重要檔名、規則文字與實際回覆維持正常速度；結尾淡出至 Spec。 |
```

- [ ] **Step 3：更新錄影備註**

將 `S12–S13：建立並驗證 AGENTS.md` 改為：

```text
- S13：以一段連續錄影建立並驗證 `AGENTS.md`。
```

將時間備註中的 `S12–S13、S19–S21` 改為 `S13、S19–S21`。

- [ ] **Step 4：執行最終驗證**

執行：

```powershell
npm.cmd run lint
git diff --check
git status --short
```

預期：

- ESLint 與 TypeScript 皆以 exit code 0 結束。
- 沒有空白字元錯誤。
- 變更範圍只包含 Page 5 元件、`Root.tsx`、分鏡文件與本 Plan。

- [ ] **Step 5：檢查並刪除暫存輸出**

檢查：

- `.renders/ch3-page5-s11.png`
- `.renders/ch3-page5-s12-inputs.png`
- `.renders/ch3-page5-s12-answer.png`
- `.renders/ch3-page5-s13-demo.png`

確認：

- 字體風格一致。
- 箭頭清楚可辨識。
- 元件之間沒有重疊。
- S13 只使用一個統一的錄影佔位畫面。

解析各檔案的完整路徑，且只刪除 `.renders/ch3-page5-*.png`。

- [ ] **Step 6：回報並等待檢視**

回報：

- `Ch3-Page5-Agents`：510 幀，包含 S11–S12。
- `Ch3-Page5-AgentsDemo`：180 幀的 S13 佔位畫面。
- Lint 與視覺檢查結果。
- 使用者尚未檢視動畫或明確要求 commit 前，不執行 commit。

---

## 自我檢查

- **需求涵蓋：** Task 1 處理 S11 定義；Task 2 處理 S12 流程；Task 3 處理可維護的檔案拆分與固定時間安排；Task 4 處理合併後的 S13 連續錄影；Task 5 同步分鏡文件。
- **佔位內容檢查：** 唯一的佔位畫面是刻意保留的 S13 錄影指引，且已明確列出錄影步驟與替換方式。
- **型別與命名一致性：** 所有匯出元件名稱皆與 `Root.tsx` 一致；S11 與 S12 的區域時間合計為 510 幀；示範畫面使用獨立的 180 幀 Composition。
- **範圍：** 本計畫不製作正式螢幕錄影，也不修改 S14 之後的內容。

## 原始計畫中的完整程式碼

本中文版為了避免翻譯或重複貼上造成程式碼差異，Task 1、Task 2 與 Task 4 的完整程式碼以英文原始計畫為唯一準確來源：

`docs/superpowers/plans/2026-06-23-ch3-page5-agents.md`

執行實作時，說明與驗收條件依本中文版閱讀；實際程式碼區塊則直接使用原始計畫對應 Task 的 Step 2。
