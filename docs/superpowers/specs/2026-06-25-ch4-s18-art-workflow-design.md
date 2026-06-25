# Ch4 S18・美術整合實作流程（Ch4-Page8-ArtWorkflow）— 設計

- **日期**：2026-06-25
- **對應分鏡**：第 4 集「美術整合」S18 / 第 8 頁 `Ch4-Page8-ArtWorkflow`（簡報 17）
- **狀態**：分鏡標示 ⏳ 待製作；本 spec 為實作前設計
- **方案**：方案 A —— 改寫第 3 集 `Ch3Page7SpecWorkflow` 的流程圖技巧成獨立 Ch4 檔，不抽共用元件、不動 Ch3。

## 目標

製作約 9 秒的 SVG 水平流程圖，呈現美術整合的實驗流程：四個節點由左至右建立，藍色連線依序畫出，最後一條黃色回饋箭頭由末節點繞回「美術規格表」，標示「修正規格」。無固定旁白，為自走式視覺，與第 4 集其他頁的米白卡片風格一致。

## 非目標（Non-goals）

- 不加節點小圖示（採純文字節點，與 Ch3 一致）。
- 不抽共用 `FlowDiagram` 元件（流程圖目前僅 Ch3／Ch4 兩例，未達抽象門檻）。
- 不修改已完成的 `Ch3Page7SpecWorkflow`。
- 不含 Ch3 結尾的「開始實作 →」轉場。

## 檔案與註冊

- 新檔：`src/scenes/04-美術整合/Ch4Page8ArtWorkflow.tsx`，匯出 `Ch4Page8ArtWorkflow`。
- `Root.tsx` 新增：
  ```tsx
  <Composition
    id="Ch4-Page8-ArtWorkflow"
    component={Ch4Page8ArtWorkflow}
    durationInFrames={270}
    fps={30}
    width={1920}
    height={1080}
  />
  ```
- 共用設定取自 `src/theme/motion.ts`：`FONT`、`clamp`、`easeStandard`（即 `Easing.bezier(0.4, 0, 0.2, 1)`，Ch3 流程圖所用曲線）。

## 版面

- 背景：`NEUTRAL_50`（米白）。
- 標題：置中於上方，文字「美術整合實作流程」，`TEXT_DARK`、約 60px、900 字重。
- 四個節點（白底卡片 + `CARD_BORDER` 邊框、`TEXT_DARK` 文字）：
  - 卡片約 300×120，圓角 22。
  - 中心 x = `[300, 740, 1180, 1620]`（間距 440），中心 y ≈ 470。
  - 標籤（必要時兩行，字級約 28–30）：
    1. 依 Storyboard 列出物件
    2. 撰寫美術規格表
    3. 用 AI 生假素材
    4. 匯入 Unity 測試
- 節點間 3 段連線：`BLUE`、寬 6、`strokeLinecap: round`，以 `pathLength="1"` + `strokeDasharray="1"` + `strokeDashoffset` 做「畫出」效果，端點以三角形箭頭收尾（箭頭長度 30，連線只畫到箭頭底部）。
- 回饋迴圈：黃色（`YELLOW`）三次貝茲曲線，從節點 4（匯入 Unity 測試）底部往下繞回節點 2（美術規格表）底部，落點為向上三角箭頭；曲線底部壓一個白底膠囊標籤「修正規格」（`YELLOW` 邊框、淡陰影）。

## 動畫時序（270 幀 / 9 秒 @ 30fps）

| 階段 | 約略幀區間 | 行為 |
|---|---|---|
| 標題進場 | 0– | spring 彈入（scale 0.94→1 + 淡入） |
| 節點建立 | 第 i 個約 `10 + i*30` 起 | 由左至右 spring 彈入（scale 0.86→1），最後一個約 130 幀定位 |
| 連線畫出 | 各段於前一節點出現後 | 連線 `strokeDashoffset` 由 1→0 畫出，到端點時箭頭淡入、帶出下一節點 |
| 回饋迴圈 | 約 150→210 | 黃色曲線畫出 → 箭頭落點 → 膠囊標籤「修正規格」淡入；落點時「美術規格表」節點輕微黃色高亮 |
| 閱讀停留 | 約 210→242 | 維持完成畫面 |
| 結尾淡出 | 約 242→270 | 整體淡出到 `NEUTRAL_50`（最後 28 幀） |

> 時序為設計基準，實作時依實際觀感微調；總長維持 270 幀。若最終覺得過慢，可整體壓縮並把 `durationInFrames` 收回 240。

## 配色

| 元素 | 色 |
|---|---|
| 背景 | `NEUTRAL_50` |
| 節點卡片 | 白底 + `CARD_BORDER` 邊框、`TEXT_DARK` 文字 |
| 節點連線與箭頭 | `BLUE` |
| 回饋曲線、箭頭、標籤邊框 | `YELLOW` |
| 標題、標籤文字 | `TEXT_DARK` |
| 高亮中的「美術規格表」節點 | `YELLOW`（邊框/文字/陰影） |

## 驗證

- `npx tsc --noEmit` 通過。
- `npx eslint` 對新檔通過。
- 於 `remotion studio` 預覽 `Ch4-Page8-ArtWorkflow`，確認：四節點依序建立、三段藍線與箭頭、回饋黃線繞回「美術規格表」、結尾淡出到米白。

## 風險與後續

- 節點標籤較 Ch3 長，需確認兩行排版在 300px 卡片內不溢出；必要時縮字級或加寬卡片。
- 若日後出現第 3 個流程圖，再回頭把 Ch3／Ch4 共同邏輯抽成共用 `FlowDiagram` 元件（屆時三例可讓 props 設計更準）。
