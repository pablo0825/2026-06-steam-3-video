# Ch4 Page4 PPU (S10-S12) — Design

- **Composition ID**：`Ch4-Page4-PPU`
- **檔案**：`src/scenes/04-美術整合/Ch4Page4PPU.tsx`
- **規格**：1920×1080 @ 30fps，字體沿用 `Noto Sans TC` 堆疊
- **總長**：1080 frames（36 秒）
- **對應分鏡**：第 4 集分鏡腳本「第 4 頁・素材大小的基礎單位：Unity unit、px 與 PPU」S10-S12
- **配色**：全部取自 `src/theme/colors.ts`，不新增主題色

## 目標與範圍

把 S10-S12 做成一支連續 Remotion composition，先提出 Unity `unit` 與美術圖 `px` 如何互相轉換的問題，再用 `PPU（Pixels Per Unit）` 回答，最後用 `PPU=100` 與 `PPU=128` 的左右對比示範為什麼要先決定 `1 unit` 對應多少 `px`。

本頁只做概念動畫；不做 S13 的 Unity 實機操作。

三段節奏：

| 段 | 內容 | Frame | 秒 |
|---|---|---|---:|
| S10 | `unit` / `px` 雙向轉換問題 | 0-240 | 8 |
| S11 | PPU 定義與重點句 | 240-630 | 13 |
| S12 | PPU=100 vs PPU=128 左右對比 | 630-1080 | 15 |

> S10 延長最後停留，讓觀眾有時間理解 unit 與 px 之間需要建立換算關係；總長調整為 1080 frames。

## 段落設計

### S10 — unit / px 轉換問題（0-240）

畫面：

- 白底 `WHITE`
- 上方標題：「素材大小的基礎單位」
- 左側大字 `unit`，下方小字「Unity 單位」，去掉方塊容器；主字使用 `BLUE`，小字使用 `SUBTLE`
- 右側大字 `px`，下方小字「美術圖單位」，去掉方塊容器；主字使用 `YELLOW`，小字使用 `SUBTLE`
- 中間兩條水平箭頭：
  - 上箭頭：`unit → px`
  - 下箭頭：`px → unit`
- 兩條箭頭使用語意色：上箭頭 `BLUE`、下箭頭 `YELLOW`；線段停在箭頭頭前方，避免線條凸出箭頭
- 箭頭群與 `unit` / `px` 主字對齊在同一個視覺帶，不浮在文字上方
- 兩條箭頭中央最後出現放大的 `?`，使用 `PANEL_BG` 圓形承托，並加淡藍邊線，避免和箭頭語意色混在一起

動畫：

- 標題先淡入或 spring 進場。
- `unit` 與 `px` 淡入或 spring 進場。
- 上箭頭由左到右 draw-on，指向 `px`。
- 下箭頭由右到左 draw-on，指向 `unit`。
- `?` 在兩條箭頭中央 pop 出來，整段停留後再銜接 S11。

設計重點：

- 這段是在「提出問題」，元素要少，避免提前解釋 PPU。
- 箭頭使用 inline SVG，透過 `strokeDasharray` / `strokeDashoffset` 做 draw-on。

### S11 — PPU 定義（240-630）

畫面：

- 延續白底。
- 移除上方提問標題，讓畫面只保留 PPU 定義本身。
- 版型參考 `src/scenes/03-程式實作/Ch3Page4Context.tsx` 的極簡定義頁。
- 中央大字 `PPU`
- 下方淡入 `Pixels Per Unit`
- 再下方出現重點句：`決定多少 px = 1 unit`
- 三層內容垂直置中，重新平衡上下留白。
- `多少 px = 1 unit` 或整句以黃色框 / 黃色底線強調。

動畫：

- `PPU` spring 淡入並微放大。
- `Pixels Per Unit` 由下淡入。
- 重點句由下升起。
- 黃色重點框或底線 draw-on，最後停留，讓觀眾理解這就是 S10 問號的答案。

設計重點：

- 這段是「回答問題」，畫面要比 S10 更安定。
- `PPU（Pixels Per Unit）` 不用等號呈現，避免語意上像公式。

### S12 — PPU=100 vs PPU=128 對比（630-1080）

畫面：

- 白底。
- 上方標題：「同一張 128×128 px 圖片」
- 左右兩張對比卡。

左卡：

- 標題 `PPU=100`
- 卡片中央顯示疊合方塊：白底虛線方塊代表 `1 unit`，上層色塊代表 `128 px`
- 上層 `128 px` 方塊略大於 `1 unit` 參考框，表示不吻合
- 結果句移到卡片外下方：紅色 `× 128 px ≠ 1 unit`

右卡：

- 標題 `PPU=128`
- 卡片中央顯示疊合方塊：白底虛線方塊代表 `1 unit`，上層色塊代表 `128 px`
- `128 px` 方塊與 `1 unit` 參考框大小吻合，表示對齊成功
- 結果句移到卡片外下方：綠色 `✓ 128 px = 1 unit`

底部結論：

- `先決定 1 unit 對應多少 px`

動畫：

- 左卡先出現，先顯示 `1 unit` 參考框，再顯示略大的 `128 px` 方塊，最後在卡片下方顯示叉叉結果。
- 右卡接著出現，先顯示 `1 unit` 參考框，再顯示剛好吻合的 `128 px` 方塊，最後在卡片下方顯示勾勾結果。
- 底部結論由下淡入，作為銜接 S13 實機示範的收束。

設計重點：

- 降低公式文字量，用疊合方塊讓「同一個 128 px，在不同 PPU 下是否等於 1 unit」更直覺。
- S12 不做 Unity 介面截圖，因為 S13 才是實機操作。

## 元件與架構

- 新增單一 page-level component：`Ch4Page4PPU`
- 內部以 frame 區間切換三段，沿用 `Ch4Page1Opening` / `Ch4Page2RelatedKnowledge` 的 frame-driven 寫法。
- 可在同檔內建立小型 helper component：
  - `UnitLabel`
  - `DrawArrow`
  - `PPUComparisonCard`
- 不抽跨頁共用元件；目前只有本頁需要這組 unit / px / PPU 圖解。
- 不使用圖片素材，全部用文字、div、inline SVG 畫出。

## 註冊

在 `src/Root.tsx` 新增 import：

```tsx
import { Ch4Page4PPU } from "./scenes/04-美術整合/Ch4Page4PPU";
```

並新增 composition：

```tsx
<Composition
  id="Ch4-Page4-PPU"
  component={Ch4Page4PPU}
  durationInFrames={1080}
  fps={30}
  width={1920}
  height={1080}
/>
```

## 非目標 / 範圍外

- 不製作 S13 Unity 實機示範。
- 不新增圖片素材。
- 不調整 `FullVideo` 串接。
- 不新增主題色。
- 不把這頁的 helper 抽成共用元件。

## 驗證

- S10：`unit` / `px` 左右大字清楚，兩條箭頭方向正確且線條不凸出箭頭，最後中央出現 `?` 並停留。
- S11：畫面依序呈現 `PPU`、`Pixels Per Unit`、`決定多少 px = 1 unit`，沒有使用等號解釋 PPU。
- S12：左卡 `PPU=100` 呈現 `128 px ≠ 1 unit`，右卡 `PPU=128` 呈現 `128 px = 1 unit`，底部結論為 `先決定 1 unit 對應多少 px`。
- `npm.cmd run lint` 無 ESLint / TypeScript 錯誤。
- Remotion still 檢查 frames：S10 約 `196`、S11 約 `490`、S12 約 `960`。
