# Ch4 Page6 Sprite Sheet (S14-S15) — Design

- **Composition ID**：`Ch4-Page6-SpriteSheet`
- **檔案**：`src/scenes/04-美術整合/Ch4Page6SpriteSheet.tsx`
- **規格**：1920×1080 @ 30fps，字體沿用 `Noto Sans TC` 堆疊
- **總長**：600 frames（20 秒）
- **對應分鏡**：第 4 集分鏡腳本「第 6 頁・認識 Sprite Sheet」S14-S15
- **配色**：全部取自 `src/theme/colors.ts`，不新增主題色

## 目標與範圍

把 S14-S15 做成一支連續 Remotion composition：先用極簡定義卡說明「Sprite Sheet 是把多張 Sprite 放在同一張圖片中的素材格式」，再用左右對比凸顯「多檔案散亂管理困難」對上「一張圖集中管理」的差異。

本頁本次只做 S14、S15 兩段概念動畫。S16（Sprite Sheet 範例圖講解）需要尚未製作的圖片素材（`briefing-img/15.jpg`），留待素材就緒後再延長本 composition 補上，不在本次範圍。

採方法 A：單一 composition，內部以 frame 區間切換兩段並做 crossfade，沿用 `Ch4Page4PPU` / `Ch3Page4Context` 的 frame-driven 寫法。日後補 S16 只需延長 duration、加一組 frame 窗。

兩段節奏：

| 段 | 內容 | Frame | 秒 |
|---|---|---|---:|
| S14 | Sprite Sheet 極簡定義卡 | 0-228 | ~7.6 |
| S15 | 散亂 vs. 集中 左右對比 | 228-600 | ~12.4 |

## 段落設計

### S14 — Sprite Sheet 定義卡（0-228）

畫面（沿用 `src/scenes/03-程式實作/Ch3Page4Context.tsx` 極簡定義版型）：

- 底 `NEUTRAL_50`，內容垂直置中。
- 中央大標題 `Sprite Sheet`（`TEXT_DARK`，約 150px，fontWeight 900）。
- 標題下方定義句：「Sprite Sheet 是把多張 Sprite 放在同一張圖片中的素材格式」（約 46px，`TEXT_DARK`）。
- 定義句中「多張 Sprite」與「同一張圖片」兩個關鍵詞以 `YELLOW` 淡黃色襯底高亮（`withAlpha(YELLOW, ...)` 襯底，文字維持深色）。

動畫：

| frame | 動作 |
|---|---|
| 8-40 | 標題 `Sprite Sheet` spring 淡入並微放大（scale 0.9→1） |
| 44-70 | 定義句由下淡入（translateY 28→0） |
| 90-112 | 關鍵詞「多張 Sprite」淡黃襯底高亮淡入 |
| 120-142 | 關鍵詞「同一張圖片」淡黃襯底高亮淡入 |
| 142-200 | 停留 |
| 200-228 | 整段淡出，銜接 S15 |

設計重點：

- 這段是「下定義」，元素要少、安定，避免提前帶出對比資訊。
- 強調採淡黃襯底高亮（不是底線 wipe、不是直接轉色），與本頁強調語彙一致。

### S15 — 散亂 vs. 集中 對比（228-600）

畫面（沿用 `src/scenes/03-程式實作/Ch3Page7SpecPractice.tsx` 左右對比節奏）：

- 中央一條淡色虛線分隔（`DIVIDER`），左右各半。
- 左右使用同一組「簡化色塊 + 極簡幾何圖示」tile 素材（地板／磚／尖刺／金幣／草／箱…），凸顯「散開 → 收進一張圖」。
- 左半（反例）：7 個散亂小 tile，彼此略微錯位、輕微旋轉，排列凌亂；下方標籤 `✕ 多檔案管理困難`（`RED` 叉、文字弱化）。
- 右半（正解）：一張大「Sprite Sheet」外框（`CARD_BORDER` 框 + `PANEL_BG` 底），內部 3×3 整齊格線，9 格放整齊排列的 tile；下方標籤 `✓ 一張圖集中管理`（`GREEN` 勾、`YELLOW` 強調）。
- tile 數量左 7、右 9，不做一一對應，重點在「散 vs. 集中」的視覺感受。

動畫：

| frame | 動作 |
|---|---|
| 228-262 | S15 場景淡入（承接 S14 淡出） |
| 270-345 | 左側 7 個散亂 tile 逐張 spring 彈入（錯位 + 微旋轉，stagger 約 10f） |
| 350-382 | 左側 `✕ 多檔案管理困難` 淡入 |
| 392-428 | 右側大圖外框由下升起（translateY + 淡入） |
| 428-495 | 右側內部格線描繪 + 9 格 tile 整齊逐格淡入 |
| 500-532 | 右側 `✓ 一張圖集中管理` 淡入 |
| 540-578 | 最終強調：右側微亮（輕陰影／scale 1.02），左側單純降透明度至約 0.45 |
| 578-600 | 停留收尾 |

設計重點：

- 左側 tile 用錯位 + 微旋轉表現「散亂、難管理」；右側用整齊格線表現「集中、好管理」。
- 最終照分鏡只做「左側降透明度」凸顯右側，不做「散亂被吸進大圖」的位移動畫，控制複雜度。

## 元件與架構

- 新增單一 page-level component：`Ch4Page6SpriteSheet`。
- 內部以 frame 區間切換兩段，沿用 `Ch4Page4PPU` 的 frame-driven 寫法與具名 frame 窗常數。
- 可在同檔內建立小型 helper component：
  - `SpriteTile`（簡化色塊 + 圖示的單一 tile）
  - `HighlightWord`（S14 淡黃襯底高亮詞）
  - `ContrastLabel`（S15 ✕／✓ 標籤）
- 不抽跨頁共用元件；目前只有本頁需要這組 tile / 對比圖解。
- 不使用圖片素材，全部用文字、div、inline SVG 畫出。

## 註冊

在 `src/Root.tsx` 新增 import：

```tsx
import { Ch4Page6SpriteSheet } from "./scenes/04-美術整合/Ch4Page6SpriteSheet";
```

並新增 composition：

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

## 非目標 / 範圍外

- 不製作 S16 Sprite Sheet 範例圖講解（需尚未製作的圖片素材）。
- 不製作 S17 Unity 實機示範。
- 不新增圖片素材。
- 不調整 `FullVideo` 串接（與本章其他頁一致）。
- 不新增主題色。
- 不把這頁的 helper 抽成共用元件。

## 驗證

- S14：標題 `Sprite Sheet` 與定義句清楚呈現，「多張 Sprite」「同一張圖片」兩詞為淡黃襯底高亮，最後整段淡出。
- S15：左側 7 個 tile 散亂彈入並出現 `✕ 多檔案管理困難`；右側大圖外框 + 3×3 共 9 格整齊 tile 出現並出現 `✓ 一張圖集中管理`；最終右側微亮、左側降透明度。
- `npm run lint` 無 ESLint / TypeScript 錯誤。
- Remotion still 檢查 frames：S14 約 `150`、S15 散亂約 `340`、S15 對比完成約 `560`。
