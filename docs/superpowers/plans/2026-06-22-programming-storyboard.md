# 「程式實作」分鏡文件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可直接供 Remotion 動畫製作與後期剪輯使用的「程式實作」完整分鏡腳本。

**Architecture:** 以逐字稿作為 S01–S18 的旁白來源，簡報圖片作為內容與構圖參考，並沿用前兩章的 Markdown 分鏡格式。S19–S21 獨立處理為螢幕操作錄影，不補寫固定旁白；S22–S24 僅描述簡報既有文字與畫面。

**Tech Stack:** Markdown、Remotion 場景命名慣例、PowerShell、ripgrep、Git

## Global Constraints

- 輸出文件為 `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`。
- 逐字稿是 S01–S18 的主要旁白來源，僅修正明顯錯字與語句不順。
- 全文統一使用 `AGENTS.md`。
- S19–S21 是實際操作錄影，不新增固定旁白。
- S22–S24 不自行擴寫逐字稿未提供的旁白。
- 視覺延續前兩章的米白背景、深灰文字與黃色重點色。
- 場景編號使用 `S01` 至 `S24`，composition 預留為 `Ch3-PageN-*`。

---

### Task 1: 建立文件骨架與共同規範

**Files:**
- Create: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Reference: `docs/01-實驗介紹/steam - 3 - Vibe Game 教案 - 介紹實驗 - 分鏡腳本.md`
- Reference: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`

**Interfaces:**
- Consumes: 已核准的設計規格與前兩章文件格式。
- Produces: 影片資訊、圖例、進度表、場景章節、素材備註、製作檢查與純旁白稿的完整文件骨架。

- [ ] **Step 1: 建立標題與影片基本資訊**

加入章節名稱、影片類型、製作工具、預估片長、色彩及呈現圖例，文字風格對齊前兩章。

- [ ] **Step 2: 建立 S01–S24 進度表**

每列記錄場景編號、建議 composition ID、內容摘要、素材需求與狀態；初始狀態標示為「待製作」。

- [ ] **Step 3: 建立後段共同章節**

加入「素材與錄影需求」、「製作前檢查」及「純旁白稿」章節。

- [ ] **Step 4: 檢查文件骨架**

Run:

```powershell
rg -n "^#|^##|S0[1-9]|S1[0-9]|S2[0-4]" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: 文件具有主要章節，且 S01–S24 全部出現在進度表。

### Task 2: 撰寫 S01–S07 開場與 User Story

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Reference: `docs/03-程式實作/逐字稿.txt`
- Reference: `docs/03-程式實作/briefing-img/1.jpg` 至 `7.jpg`

**Interfaces:**
- Consumes: Task 1 的場景表格格式。
- Produces: S01–S07 的旁白、秒數、畫面、呈現及動態描述。

- [ ] **Step 1: 撰寫 S01–S03**

建立系列開場、本次重點及知識索引；重點卡片與知識項目依旁白逐項進場。

- [ ] **Step 2: 撰寫 S04–S05**

使用統一定義版型說明 User Story，並將「角色、需求、價值」拆成三個區塊。

- [ ] **Step 3: 撰寫 S06–S07**

S06 規劃 Rhythm Doctor 滿版影片；S07 逐欄填入完整 User Story 範例。

- [ ] **Step 4: 核對 User Story 段落**

Run:

```powershell
rg -n -C 3 "S0[1-7]|User Story|Rhythm Doctor|角色|需求|價值" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: S01–S07 順序完整，User Story 三欄與影片案例均有清楚描述。

### Task 3: 撰寫 S08–S13 Context 與 AGENTS.md

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Reference: `docs/03-程式實作/逐字稿.txt`
- Reference: `docs/03-程式實作/briefing-img/9.jpg` 至 `13.jpg`

**Interfaces:**
- Consumes: Task 1 的場景表格格式。
- Produces: S08–S13 的概念動畫、比喻畫面與操作錄影規劃。

- [ ] **Step 1: 撰寫 S08–S10**

用短期記憶、對話累積及固定容量書櫃依序解釋 Context。

- [ ] **Step 2: 撰寫 S11**

呈現 `AGENTS.md` 的用途，明確說明它是 Agent 協作時會讀取的專案規則文件。

- [ ] **Step 3: 撰寫 S12–S13**

規劃建立 `AGENTS.md`、寫入回覆規則及觀察結果的實際操作錄影；不虛構畫面中沒有的結果。

- [ ] **Step 4: 檢查命名一致性**

Run:

```powershell
rg -n "AGENT\.md|AGENTS\.md|Context|書櫃" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: 只出現 `AGENTS.md`，Context 與書櫃比喻均有對應場景。

### Task 4: 撰寫 S14–S18 Spec 與實作流程

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Reference: `docs/03-程式實作/逐字稿.txt`
- Reference: `docs/03-程式實作/briefing-img/14.jpg` 至 `19.jpg`

**Interfaces:**
- Consumes: Task 1 的場景表格格式。
- Produces: S14–S18 的 Spec 定義、欄位、案例、注意事項與流程動畫。

- [ ] **Step 1: 撰寫 S14–S15**

使用定義版型呈現 Spec 的兩項作用，再依序顯示六個 Spec 欄位。

- [ ] **Step 2: 撰寫 S16–S17**

S16 規劃 Celeste 滿版影片；S17 逐欄填入跳躍功能 Spec。

- [ ] **Step 3: 撰寫 S18**

先呈現「一個功能、一份 Spec」，再建立 User Story → Spec → Plan → 實作 → 手動驗證的流程與回饋箭頭。

- [ ] **Step 4: 核對 Spec 欄位及流程**

Run:

```powershell
rg -n "Input/Output|Non-goals|Acceptance Criteria|User Story.*Spec.*Plan|一個功能" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: 六個欄位與完整實作流程均被記錄。

### Task 5: 撰寫 S19–S24 實際操作、補充與結尾

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Reference: `docs/03-程式實作/briefing-img/20.jpg` 至 `25.jpg`

**Interfaces:**
- Consumes: Task 1 的場景表格格式。
- Produces: S19–S24 的操作錄影、靜態重點頁與結尾規劃。

- [ ] **Step 1: 撰寫 S19**

記錄建立 Unity 專案、Codex 專案聊天串、`AGENTS.md` 與 Spec 資料夾的必要錄影節點。

- [ ] **Step 2: 撰寫 S20–S21**

記錄從 User Story、Spec、Plan 到 AI 實作，以及依驗收項目人工驗證的必要錄影節點；旁白欄標示「依實際操作講解」。

- [ ] **Step 3: 撰寫 S22–S24**

重製更新舊功能、基本功提醒與感謝結尾，不新增簡報外的旁白。

- [ ] **Step 4: 核對操作段落**

Run:

```powershell
rg -n -C 3 "S19|S20|S21|實際操作|依實際操作講解|S22|S23|S24" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: S19–S21 明確標為操作錄影，S22–S24 沒有新增固定旁白。

### Task 6: 完成素材表、純旁白稿與整體驗證

**Files:**
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`

**Interfaces:**
- Consumes: Task 2–5 已完成的全部場景。
- Produces: 可交付的完整分鏡文件。

- [ ] **Step 1: 整理素材與錄影需求**

列出 Rhythm Doctor、Celeste、書櫃圖片、Unity、Codex、`AGENTS.md`、Spec 與 Plan 錄影需求，保留簡報已提供的來源文字。

- [ ] **Step 2: 建立純旁白稿**

依 S01–S18 順序整理修正後旁白；S19–S24 不加入未提供的固定旁白。

- [ ] **Step 3: 檢查場景完整性與禁用文字**

Run:

```powershell
rg -n "TBD|TODO|AGENT\.md" "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: 無輸出。

- [ ] **Step 4: 檢查 Markdown 與變更範圍**

Run:

```powershell
git diff --check -- "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
git status --short
```

Expected: `git diff --check` 無輸出；狀態只顯示預期文件與原本既存的未追蹤檔案。

- [ ] **Step 5: 檢視最終差異**

Run:

```powershell
git diff -- "docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md"
```

Expected: 新文件完整包含 S01–S24、素材備註、製作檢查及純旁白稿。
