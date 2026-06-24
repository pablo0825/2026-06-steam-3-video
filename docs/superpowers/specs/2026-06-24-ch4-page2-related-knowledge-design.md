# Ch4 Page2 Related Knowledge (S05-S08) — Design

- **Composition ID**：`Ch4-Page2-RelatedKnowledge`
- **檔案**：`src/scenes/04-美術整合/Ch4Page2RelatedKnowledge.tsx`
- **規格**：1920×1080 @ 30fps，字體沿用 `Noto Sans TC` 堆疊
- **總長**：840 frames（28 秒）
- **對應分鏡**：第 4 集分鏡腳本「第 2 頁・相關知識與遊戲畫面大小」S05-S08
- **配色**：全部取自 `src/theme/colors.ts`，不新增主題色
- **圖片素材**：
  - S07：`public/04-美術整合/screen-size-landscape.png`
  - S08：`public/04-美術整合/screen-size-portrait.png`

## 目標與範圍

把第 4 集第 2 頁的 S05-S08 做成一支連續 Remotion composition，先以 `Ch2Page1Opening` 的知識導覽版型建立三個觀念標籤，再用兩張實際範例圖示範橫式與直式遊戲畫面大小。

本頁只處理「相關知識導覽」與「遊戲畫面大小」；不做 S09 的 Figma / Unity 實機示範。

四段節奏：

| 段 | 內容 | Frame | 秒 |
|---|---|---|---:|
| S05 | 三個相關知識標籤，聚焦「遊戲畫面大小」 | 0-330 | 11 |
| S06 | 橫式 / 直式尺寸卡 | 330-540 | 7 |
| S07 | 橫式遊戲畫面滿版圖 | 540-690 | 5 |
| S08 | 直式遊戲畫面置中，黑底補兩側 | 690-840 | 5 |

> 秒數依分鏡；最終節奏可在 Remotion preview 微調，但四段總長先固定為 840 frames。

## 段落設計

### S05 — 相關知識導覽（0-330）

參考 `src/scenes/02-遊戲設計/Ch2Page1Opening.tsx` 的 S3「知識導覽」結構，但文案換成美術整合章節的三個觀念。

畫面：

- 白底 `WHITE`
- 上方提示文字：「先認識幾個重要觀念」
- 中央三個膠囊標籤：
  1. `遊戲畫面大小`
  2. `素材大小的基礎單位`
  3. `Sprite Sheet`
- 三個標籤正下方顯示提示句：`先從「遊戲畫面大小」開始 →`

動畫：

- 三個標籤依序由下往上 spring 進場，stagger 約 24 frames。
- 三個標籤都到位後，`遊戲畫面大小` 放大並轉為高亮：
  - background：由 `CHIP_BG` 轉為 `BLUE`
  - text：由 `TEXT_DARK` 轉為 `WHITE`
  - scale：約 1 -> 1.06
  - boxShadow：使用 `withAlpha(BLUE, 0.22)`
- 高亮進度使用先快後慢 easing，例如 `Easing.bezier(0.16, 1, 0.3, 1)`，避免看起來像線性變化。
- 其餘兩個標籤維持淡灰 / 一般狀態，不要搶焦點。
- 提示句跟著高亮進度淡入，放在三個標籤正下方，不要離標籤太遠。

建議 constants：

```ts
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [210, 250] as const;
const S05_OUT = [306, 330] as const;
```

### S06 — 遊戲畫面大小尺寸卡（330-540）

畫面：

- 白底 `WHITE`
- 標題：「遊戲畫面大小」
- 中央左右兩張尺寸卡：
  - 左：`1920×1080`，副標 `16:9 橫式`
  - 右：`1080×1920`，副標 `9:16 直式`
- 尺寸數字直接以深色粗體呈現，不加黃色底線或 highlight bar；副標使用淡藍膠囊標籤。

動畫：

- 標題淡入或 spring 進場。
- 左右尺寸卡由左右滑入。
- 段尾淡出銜接 S07 的圖片滿版。

建議 constants：

```ts
const S06_IN = [330, 354] as const;
const S06_OUT = [516, 540] as const;
```

### S07 — 橫式畫面滿版（540-690）

素材：

- `staticFile("04-美術整合/screen-size-landscape.png")`
- 目前素材尺寸：2560×1440，比例 16:9，可直接以 `objectFit: "cover"` 滿版到 1920×1080。

畫面：

- 圖片滿版鋪滿整個 1920×1080 畫面。
- 左上角小字標示 `1920×1080`。
- 尺寸標籤要低調，不要蓋住範例圖主視覺：
  - fontSize 約 26-30
  - color `WHITE`
  - 背景可用 `withAlpha(TEXT_DARK, 0.58)` 的半透明圓角底
  - left / top 約 32

動畫：

- 圖片淡入，保持穩定。
- 可加非常輕微 scale 1.01 -> 1.0，但不要做明顯 zoom，以免影響「畫面大小」示範。
- 左上角尺寸標籤淡入。
- 段尾淡出到黑底，銜接 S08。

建議 constants：

```ts
const LANDSCAPE_IMAGE = staticFile("04-美術整合/screen-size-landscape.png");
const S07_IN = [540, 564] as const;
const S07_OUT = [666, 690] as const;
```

### S08 — 直式畫面置中，黑底補邊（690-840）

素材：

- `staticFile("04-美術整合/screen-size-portrait.png")`
- 目前素材尺寸：1260×2736，直式比例不是精準 9:16。實作時以完整高度為優先，使用 `objectFit: "contain"` 放進固定高度容器，左右空白用黑色填滿。

畫面：

- 整體背景為黑色。
- 直式圖片完整高度置中顯示，不裁切圖片內容。
- 左右留白維持黑色，不加裝飾、不加模糊背景。
- 左上角小字標示 `1080×1920`。
- 尺寸標籤同 S07，使用白字與半透明深色底；黑底區域上仍保留標籤底色以維持一致。

動畫：

- 黑底先出現。
- 直式圖片淡入置中。
- 左上角尺寸標籤淡入。
- 結尾保留 18-24 frames 停留，方便銜接 S09 實機示範或下一段標題卡。

建議 constants：

```ts
const PORTRAIT_IMAGE = staticFile("04-美術整合/screen-size-portrait.png");
const S08_IN = [690, 714] as const;
```

## 元件與架構

- 新增單一 page-level component：`Ch4Page2RelatedKnowledge`
- 內部以 frame 區間切換四段，沿用 `Ch4Page1Opening` / `Ch2Page1Opening` 的 gating 寫法。
- 可在同檔內建立小型 helper component：
  - `KnowledgeTag`
  - `SizeCard`
  - `DimensionLabel`
- 不抽跨頁共用元件；S05 雖參考 Ch2，但這頁文字、時序與素材展示都不同，先保持單檔自足。
- 圖片使用 Remotion `<Img>` 與 `staticFile()`，不直接從 `docs/` 載入。

## 註冊

在 `src/Root.tsx` 新增 import：

```tsx
import { Ch4Page2RelatedKnowledge } from "./scenes/04-美術整合/Ch4Page2RelatedKnowledge";
```

並新增 composition：

```tsx
<Composition
  id="Ch4-Page2-RelatedKnowledge"
  component={Ch4Page2RelatedKnowledge}
  durationInFrames={840}
  fps={30}
  width={1920}
  height={1080}
/>
```

## 非目標 / 範圍外

- 不製作 S09 實機示範。
- 不新增或修改圖片素材；使用現有 `screen-size-landscape.png` 與 `screen-size-portrait.png`。
- 不把簡報 `briefing-img/7.jpg` / `briefing-img/8.jpg` 直接放入 Remotion。
- 不調整 `FullVideo` 串接。
- 不新增主題色。

## 驗證

- Remotion preview 檢查 S05 三個標籤依序進場，且最後明確聚焦「遊戲畫面大小」。
- S05 提示句必須位於三個標籤正下方，文字為 `先從「遊戲畫面大小」開始 →`。
- S06 尺寸卡不顯示黃色底線或 highlight bar。
- S07 圖片必須滿版覆蓋整個 1920×1080，左上角標示 `1920×1080`。
- S08 背景必須為黑色，直式圖片完整置中，不裁切，左上角標示 `1080×1920`。
- `npx tsc --noEmit` 或 build 無型別錯誤。
- 全頁配色來自 `src/theme/colors.ts`，黑底例外可直接使用 `#000`。
