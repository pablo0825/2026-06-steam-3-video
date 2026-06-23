# 第 3 集・第 7 頁 設計：Celeste 跳躍 Spec 與實作流程（S16–S18）

- 日期：2026-06-23
- 對應分鏡：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` 第 7 頁（S16–S18）
- 狀態：設計定稿，待寫實作計畫

## 目標

製作第 7 頁的三個鏡頭：

- **S16**：Celeste 影片全螢幕，開頭疊「Spec 案例／Celeste：跳躍功能」標題群組。
- **S17**：影片上蓋半透明黑遮罩，置中顯示「跳躍功能 Spec」六欄位表格。
- **S18**：白底全螢幕動畫，前半「一個功能，一份 Spec」，後半 Spec 實作流程圖。

沿用本集既有的視覺語彙與元件，不引入新主題色或新風格。

## 整體結構（方案 ①・分離式，仿 Page 3）

S16–S17 為「透明 Overlay 疊在影片上」，S18 為「白底全螢幕 SVG 動畫」，兩者渲染性質不同，因此分離為不同 composition。與第 3 頁（節奏醫生）已建立的「Overlay／預覽」雙 composition 慣例一致，剪輯流程最順。

### 元件拆檔

```
Ch3Page7CelesteSpec.tsx          // 預覽容器 = GameplayPlaceholder + Overlay（僅供 Studio 預覽）
Ch3Page7CelesteSpecOverlay.tsx   // 透明 Overlay：S16 標題群組 + S17 遮罩 + Spec 表格（輸出給剪輯軟體疊影片）
Ch3Page7SpecPractice.tsx         // S18 白底容器，Sequence 串兩個子場景：
  ├─ Ch3Page7SpecPerFeature.tsx  // S18 前半「一個功能，一份 Spec」
  └─ Ch3Page7SpecWorkflow.tsx    // S18 後半 Spec 實作流程圖
```

### Composition 註冊（`src/Root.tsx`）

- `Ch3-Page7-CelesteSpec`（預覽，placeholder + overlay）
- `Ch3-Page7-CelesteSpec-Overlay`（透明 overlay，剪輯用）
- `Ch3-Page7-SpecPractice`（S18 白底）

> 渲染目標分離：剪輯端只取 S16–S17 的透明 Overlay 疊在實際 Celeste 影片上；S18 當完整白底片段獨立輸出後接在時間軸上。

## 共用慣例

- 字型：`"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif`
- 主色：`theme/colors`（YELLOW 強調、BLUE 文件/流程、TEXT_DARK、WHITE、BLACK 遮罩、SUBTLE、CARD_BORDER、NEUTRAL_300、withAlpha）
- 緩動：`Easing.bezier(0.4, 0, 0.2, 1)`；節點/卡片進場用 `spring`（仿 `Ch3Page5AgentsFlow`、`Ch3Page6SpecStructure`）
- fps：30；畫面 1920×1080
- 影片素材：S16、S17 的實際 Celeste 影片由剪輯軟體處理，Remotion 僅輸出透明 Overlay；Studio 預覽以 `GameplayPlaceholder` 佔位（icon 自訂、title「Celeste」、subtitle 標示為剪輯素材）

## 場景設計

### S16 標題群組（Overlay，0–240 frame，約 8 秒）

仿 `Ch3Page3RhythmDoctorOverlay` 的 S06 段。

- 透明背景，置中放射柔光（`radial-gradient`，黑色，淡入）
- 標題群組（由下升起）：
  - 小標：`Spec 案例`（YELLOW，字距寬）
  - 主標：`Celeste`（WHITE，特大，約 104px）
  - 副標：`跳躍功能`（WHITE 半透明）
  - 黃色短線（YELLOW，圓角，柔光）
- 動態：柔光淡入（約 0–18）→ 標題淡入並上移（約 10–38）→ 停約 2 秒 → 整組淡出（約 196–222）

### S17 半透明黑底 ＋ 置中 Spec 表格（Overlay，約 240–780 frame）

沿用 S07 的半透明黑遮罩，但內容改為置中的完整 Spec 表格。

- 影片上蓋半透明黑遮罩（BLACK，約 0.6 不透明度淡入；段末淡出）
- 置中標題：`跳躍功能 Spec`（WHITE）
- 下方置中表格，左欄=欄位名（深色字／NEUTRAL_300 灰底膠囊，仿 S07 tag），右欄=內容（WHITE 字）：

| 欄位 | 內容 |
|---|---|
| User Story | 身為玩家，我想要控制角色跳上平台、越過障礙。 |
| Input / Output | 按下空白鍵／角色向上跳躍，並受重力影響回到地面。 |
| Rules | 角色接觸地面時才能跳躍；滯空時不可連續跳躍。 |
| Non-goals | 不包含二段跳、攀牆與跳躍動畫。 |
| Acceptance Criteria | （三項，核取方塊直排）☑ 按下空白鍵會跳躍；☑ 落地後可再次跳躍；☑ 滯空時重複按鍵不會再次跳躍。 |
| Notes | 無。 |

- Acceptance Criteria 列右欄用三個 ☑ 子項直排呈現，該列高度較其他列高；其餘列維持單行。
- 動態：遮罩淡入 → 標題淡入 → 六列由上而下 `spring` 逐列填入（stagger，仿 S07 三列、`Ch3Page6SpecStructure` 卡片）
- 時間：Overlay composition 總長約 780 frame，S17 段約 240–780（數值可於實作微調）

### S18 白底實作頁（`Ch3Page7SpecPractice`，約 720 frame）

白底全螢幕，`Sequence` 串兩個子場景。

#### 前半 `Ch3Page7SpecPerFeature`「一個功能，一份 Spec」（約 330 frame）

- 標題：`一個功能，一份 Spec`
- 正例先建立：三個功能方塊 → 各自連線到一份獨立 Spec 文件（沿用 `SpecDocumentCard` 風格）
- 反例：三個功能擠進同一份文件、連線糾結 → 短暫震動後淡出（不用紅色製造過度負面，改用灰／黃警示）
- 結論小標：`一個功能 → 一份 Spec`
- 動態：正例節點與連線依序出現 → 反例建立 → 反例短暫震動並淡出 → 留正例與結論

#### 後半 `Ch3Page7SpecWorkflow` 實作流程圖（約 390 frame）

沿用 `Ch3Page5AgentsFlow` 的卡片＋`strokeDashoffset` 繪線＋三角箭頭手法。

- 標題：`Spec 實作流程`
- 流程節點依序彈入（`spring`）：`User Story → Spec → Plan → AI／使用者實作 → 手動驗證`
- 連線逐段繪製（`strokeDashoffset` 由 1→0），箭頭隨後淡入
- 驗證節點黃色高亮
- 回饋箭頭：自「手動驗證」繪回「Spec」，標示驗證失敗的迴圈
- 收尾：`開始實作` 轉場字樣淡入
- 動態：節點彈入 → 連線逐段繪製 → 驗證節點高亮 → 回饋箭頭繪回 Spec → 「開始實作」淡入

## 不做（YAGNI）

- 不在 Remotion 內重現實際 Celeste 影片或縮放影片（由剪輯軟體處理）。
- 不新增主題色、字型或全域樣式。
- 不重構與本頁無關的既有元件。

## 驗證方式

- Remotion Studio 開啟三個 composition，逐 frame 檢查 S16 標題進出場、S17 六列逐列填入與 ☑ 子項、S18 兩段動態與回饋箭頭。
- 確認 Overlay composition 背景透明（疊在影片上不會出現白底）。
- `npm run lint` 通過。
