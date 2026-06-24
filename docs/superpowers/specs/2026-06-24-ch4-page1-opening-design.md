# Ch4 Page1 Opening (S01–S04) — Design

- **Composition ID**：`Ch4-Page1-Opening`
- **檔案**：`src/scenes/04-美術整合/Ch4Page1Opening.tsx`
- **規格**：1920×1080 @ 30fps，白底 `WHITE`，字體沿用 `Noto Sans TC` 堆疊
- **總長**：1260 frames（42 秒）
- **對應分鏡**：第 4 集分鏡腳本「第 1 頁・開場、AI 生圖定位與本次重點」S01–S04
- **配色**：全部取自 `src/theme/colors.ts`，不新增主題色

## 目標與範圍

把第 4 集第 1 頁的 S01–S04 做成**一支連續動畫** composition，沿用前幾集開場版型，但中段（S02+S03）改為新的「AI 生圖的角色」概念 + 水平流程圖。本頁**不含**知識導覽（移到 S05/第 2 頁）。

四段節奏：

| 段 | 內容 | Frame | 秒 |
|---|---|---|---:|
| S01 | 開場標題（沿用前幾集版型） | 0–210 | 7 |
| S02 | AI 生圖的角色：先左右對比 → 對比淡出 → 建四節點流程 | 210–720 | 17 |
| S03 | 延續同一張流程圖（連續演化）：回饋箭頭「修正規格」+ 置中放大「提早讓問題出現」 | 720–1020 | 10 |
| S04 | 本次重點三卡（美術規格表／AI 生假素材／Unity 驗證規格） | 1020–1260 | 8 |

> 秒數依分鏡；最終節奏在 Remotion preview 微調，frame 邊界可小幅調整。

## 段落設計

### S01 — 開場標題（沿用，0–210）

直接複製 `Ch3Page1Opening` 的 S01 區塊，只改副標文字：

- 知點 logo 進場（spring）→ `LOGO_MOVE [40,70]` 上移縮小（top 460→150、width 560→220）
- `TITLE_START=72`：主標「VIBE GAME 教案」spring 進場 + 黃色底線 wipe（width 0→380）
- `SUB_START=96`：副標「**第 4 集・美術整合**」淡入
- `A_OUT [188,210]`：整段淡出

不新增任何邏輯，常數與 Ch3 一致。

### S02 — AI 生圖的角色（210–720）

標題「AI 生圖的角色」於段首進場並停留於上方。

**Beat A — 左右對比（約 210–390）**
- 左卡：「不是取代美術人員」，文字 `SUBTLE`（淡灰），語意為被否定的一面
- 右卡：「優化美術工作」，關鍵詞 `YELLOW` 強調
- 兩卡依序淡入 / spring 進場（左先右後）

**Beat A→B 轉場（約 360–410）**
- 左右對比兩卡**完全淡出**（依使用者決定，不保留為頂部脈絡）
- 標題「AI 生圖的角色」可保留或同步淡出，讓位給流程圖（保留較佳，維持段落主題）

**Beat B — 四節點水平流程（約 410–720）**
- 由左至右建立 4 節點：`AI 生假素材 → 匯入 Unity → 驗證規格 → 降低重工`
- 節點樣式沿用既有 flow idiom（參考 `Ch3Page5AgentsFlow`）：圓角卡（約 width 360–420 / radius 24 / `3px solid CARD_BORDER` / 柔和陰影），節點文字 `TEXT_DARK`
- 連接箭頭用 SVG path：`pathLength={1}` + `strokeDashoffset={1-progress}` draw-on，末端三角箭頭，線色 `BLUE`
- 節點與箭頭依序建立（node spring 進場 → 該段箭頭 draw-on → 下一個 node）
- 最後一節點「降低重工」高亮 `YELLOW`（邊框/文字轉黃 + 柔光）

### S03 — 延續流程圖（連續演化，720–1020）

**承接 S02 的同一張流程圖，不淡出、不重建。**

- 整組流程圖縮小並上移，騰出畫面中央空間
- 從流程末端「驗證規格」彈出問題提示卡（例如「規格不符？」）
- 畫出**回饋箭頭「修正規格」**，由「驗證規格」返回前段（指回「AI 生假素材／規格」起點），形成回饋迴圈；箭頭同樣 draw-on，色彩用 `YELLOW`（強調回饋）
- 置中放大主句「**提早讓問題出現**」spring 進場（`YELLOW` 或 `TEXT_DARK` + 黃底線），作為本段重點
- `S03_OUT`（約 998–1020）整段淡出，銜接 S04

### S04 — 本次重點（1020–1260）

沿用 `Ch2Page1Opening` 的「本次重點」版型（三張並排 vertical card）：

- 標題「本次重點」置中（fontSize 64 / weight 800）
- 下方三張卡片並排，依序由下升起（spring，逐張 stagger）：
  1. **美術規格表**
  2. **AI 生假素材**
  3. **Unity 驗證規格**
- 卡片樣式：`width ~520` / `padding 56px 40px` / `2px solid CARD_BORDER` / radius 28 / 柔和陰影；卡內可放 icon + 標題 + chip
- 關鍵詞以 `YELLOW`（強調）／`BLUE`（節點/工具語意）點亮
- 段尾保留停留，方便後製銜接

## 元件與架構

- 單一檔案 `Ch4Page1Opening.tsx`，匯出 `Ch4Page1Opening`，內部以 `frame` 區間切換四段（沿用 Ch3 page1 的 `frame < X && (...)` gating 寫法）
- 流程節點與箭頭**先內聯實作**於本檔，不抽共用元件
  - 理由：S18（第 8 頁）雖有類似流程，但節點/回饋結構不同且尚遠；先 inline，待 S18 真的需要時再抽（YAGNI）
- 常數（frame 邊界、節點座標、箭頭 path）集中在檔頭，比照既有場景

## 註冊

在 `src/Root.tsx` 新增「第 4 集・美術整合」區塊與 composition：

```tsx
<Composition
  id="Ch4-Page1-Opening"
  component={Ch4Page1Opening}
  durationInFrames={1260}
  fps={30}
  width={1920}
  height={1080}
/>
```

並加上對應 import。

## 非目標 / 範圍外

- 不做 S05 之後的頁面
- 不抽共用 flow 元件（待 S18 需要時再評估）
- 不新增主題色或品牌素材
- 不調整 `FullVideo` 串接（待整集 compositions 齊備後另行處理）

## 驗證

- Remotion preview 逐段確認四段節奏與連續性（特別是 S02→S03 流程圖**不重建**）
- 副標、節點文字、三卡內容與分鏡腳本一致
- `npx tsc --noEmit` 或 build 無型別錯誤
- 全片配色僅來自 `theme/colors.ts`
