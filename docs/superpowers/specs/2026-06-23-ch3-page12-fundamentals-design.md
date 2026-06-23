# 第 3 集・第 12 頁 設計：提醒「基本功很重要」（S23）

- 日期：2026-06-23
- 對應分鏡：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` 第 12 頁（S23）
- 狀態：設計定稿，待寫實作計畫

## 目標

製作第 12 頁 S23：一張白底「文字卡＋SVG 動畫」提醒頁，約 10.5 秒，傳達「AI 寫程式很快，但基本功仍然重要」。

- 標題：`提醒：基本功很重要`
- 重點一：AI 寫程式很快，不代表程式語法或 Unity 操作不重要
- 重點二：有基本功，才能更快找到問題，並清楚描述給 AI
- 圖示動畫：程式碼 ＋ Unity 圖示匯入放大鏡（基本功 → 找到問題）
- 結論：`基本功 × AI 協作`

沿用本集既有視覺語彙與元件，不引入新主題色或新風格。

## 整體結構

單一檔案、單一 composition（白底全螢幕，不涉及透明 Overlay 或影片）。

```
src/scenes/03-程式實作/Ch3Page12Fundamentals.tsx   // S23 全部內容
src/Root.tsx                                        // 註冊 Ch3-Page12-Fundamentals
```

- Composition：`id="Ch3-Page12-Fundamentals"`、component `Ch3Page12Fundamentals`、`durationInFrames={315}`、fps 30、1920×1080。
- 註冊位置：接在 `Ch3-Page7-SpecPractice` 之後（目前第 3 集最後一個已註冊的 composition）。

## 共用慣例

- 字型：`"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif`
- 色票（`theme/colors`）：TEXT_DARK 文字、SUBTLE 次要、YELLOW 強調、BLUE「AI」、WHITE 底、CARD_BORDER、withAlpha
- 緩動：`Easing.bezier(0.4, 0, 0.2, 1)`；進場用 `spring`（仿 `Ch3Page6SpecStructure`、`Ch3Page5AgentsFlow`）
- fps 30；1920×1080
- 圖示：單色線稿（`fill none`、`stroke currentColor`、`strokeWidth 3`、圓角），預設灰（SUBTLE），強調時轉 YELLOW——與全集圖示一致

## 版面與動態（白底，約 315 frame）

由上而下四個區塊：

### 1. 標題（top ≈ 110，置中）

- `提醒：基本功很重要`（TEXT_DARK，特大字重）；「基本功」以 YELLOW 強調
- 動態：`spring` 進場（淡入 ＋ 輕微 scale），frame 0–30

### 2. 兩段重點（依序由下升起）

乾淨文字列，左側以細色條（YELLOW）或編號 ①② 當錨點；**不另放圖示**（圖示集中在第 3 區的匯入動畫，避免重複）。

- ① AI 寫程式很快，**不代表程式語法或 Unity 操作不重要**（關鍵詞 YELLOW）
- ② 有基本功，才能**更快找到問題**，並清楚描述給 AI（關鍵詞 YELLOW）
- 位置：重點① top ≈ 280、重點② top ≈ 400（置中對齊或左對齊於同一基準線）
- 動態：各列 `spring` 由下（+24px）升起並淡入；重點① 40–80、重點② 95–135

### 3. 圖示匯入（中下方，y ≈ 600）

- `程式碼` 圖示（左，x ≈ 760，`< >` 折線線稿）＋ `Unity` 圖示（右，x ≈ 1160，簡化立方體線稿＋小字「Unity」）
- 兩圖示滑向中央（x = 960）並匯入一個 `放大鏡` 圖示（圓＋握把）
- 放大鏡黃色高亮（象徵「基本功 → 找到問題」）
- 動態：程式碼／Unity 進場 150–180 → 滑向中央並淡出、放大鏡淡入放大 185–235 → 放大鏡 YELLOW 高亮 235–255
- 圖示皆附小字標示（程式語法／Unity／找到問題），單色線稿、預設灰

> Unity 圖示用簡化立方體線稿＋小字「Unity」，不完全複製官方 logo（版權與比例考量）。

### 4. 結論（top ≈ 850，置中）

- `基本功 × AI 協作`：「基本功」YELLOW、「× 」TEXT_DARK、「AI」BLUE、「協作」TEXT_DARK
- 動態：放大鏡高亮後淡入並輕微上移，frame 260–295；停留後整頁淡出 300–315

## 不做（YAGNI）

- 不新增主題色、字型或全域樣式。
- 不重現 Unity 官方 logo；用簡化線稿示意。
- 不做與本頁無關的圖示元件抽象（圖示就近內聯於本檔）。

## 驗證方式

- Remotion Studio 開啟 `Ch3-Page12-Fundamentals`，逐 frame 檢查：標題進場 → 兩段重點依序升起 → 程式碼／Unity 匯入放大鏡並高亮 → 結論「基本功 × AI 協作」淡入 → 整頁淡出。
- 測試（檔案結構斷言，沿用 `tests/ch3-page6-spec.test.mjs` 模式）：標題、兩段重點關鍵字、三個圖示、結論文字、`backgroundColor: WHITE`。
- `npm run lint`（eslint + tsc）通過。
