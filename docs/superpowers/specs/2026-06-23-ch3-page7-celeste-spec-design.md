# 第 3 集・第 7 頁 設計：Celeste 跳躍 Spec 與實作流程（S16–S18）

- 日期：2026-06-23
- 對應分鏡：`docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` 第 7 頁（S16–S18）
- 狀態：已實作並合併（`main`）。本文件已於數輪視覺微調後同步至最終版本（S17 改為文件卡、S18 前半改為左右對比、後半改為順流式串接）。

## 目標

製作第 7 頁的三個鏡頭：

- **S16**：Celeste 影片全螢幕，開頭疊「Spec 案例／Celeste：跳躍功能」標題群組。
- **S17**：影片上蓋半透明黑遮罩，置中顯示一張深色半透明 Spec 文件卡（`jump-spec.md`）。
- **S18**：白底全螢幕動畫，前半「一個功能，一份 Spec」左右對比，後半 Spec 實作流程圖。

沿用本集既有的視覺語彙與元件，不引入新主題色或新風格。

## 整體結構（方案 ①・分離式，仿 Page 3）

S16–S17 為「透明 Overlay 疊在影片上」，S18 為「白底全螢幕 SVG 動畫」，兩者渲染性質不同，因此分離為不同 composition。與第 3 頁（節奏醫生）已建立的「Overlay／預覽」雙 composition 慣例一致，剪輯流程最順。

### 元件拆檔

```
Ch3Page7CelesteSpec.tsx          // 預覽容器 = GameplayPlaceholder + Overlay（僅供 Studio 預覽）
Ch3Page7CelesteSpecOverlay.tsx   // 透明 Overlay：S16 標題群組 + S17 遮罩 + Spec 文件卡（輸出給剪輯軟體疊影片）
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
- 主色：`theme/colors`（YELLOW 強調/☑、BLUE 文件標題列/流程、GREEN ✓、RED ✗、TEXT_DARK、WHITE、BLACK 遮罩/深色卡、SUBTLE、CARD_BORDER、withAlpha）
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

### S17 半透明黑遮罩 ＋ 置中 Spec 文件卡（Overlay，約 240–780 frame）

沿用 S07 的半透明黑遮罩，內容為一張置中、深色半透明的 Spec 文件卡（單一焦點）。
> 設計演進：原為「灰膠囊 + 偏左六列表格」，因偏左失衡、欄列鬆散、不像一份檔案，改為置中文件卡；並移除上方多餘標題「跳躍功能 Spec」（S16 已先打出主題、卡片檔名列已標明功能），讓畫面只剩單一卡片焦點。曾試做白底版，最終定為深色半透明（保留影片氛圍、與 S16 深色調一致）。

- 影片上蓋半透明黑遮罩（BLACK，約 0.6 不透明度淡入；段末淡出）
- 文件卡：垂直＋水平置中，寬約 1080，圓角；深色半透明卡身（`withAlpha(BLACK, 0.82)`）＋ 細白邊（`withAlpha(WHITE, 0.14)`）
  - 檔名標題列：BLUE 底、白字、檔案圖示 ＋ `jump-spec.md`
  - 欄位列（六列）：左欄欄位名（弱化白 `withAlpha(WHITE, 0.6)`）＋ 右欄內容（WHITE）；列間以細分隔線（`withAlpha(WHITE, 0.1)`）區隔

| 欄位 | 內容 |
|---|---|
| User Story | 身為玩家，我想要控制角色跳上平台、越過障礙。 |
| Input / Output | 按下空白鍵／角色向上跳躍，並受重力影響回到地面。 |
| Rules | 角色接觸地面時才能跳躍；滯空時不可連續跳躍。 |
| Non-goals | 不包含二段跳、攀牆與跳躍動畫。 |
| Acceptance Criteria | （三項，核取方塊直排）☑ 按下空白鍵會跳躍；☑ 落地後可再次跳躍；☑ 滯空時重複按鍵不會再次跳躍。 |
| Notes | 無。 |

- Acceptance Criteria 列右欄用三個 ☑（YELLOW）子項直排呈現，該列高度較其他列高；其餘列維持單行。
- 動態：遮罩淡入 → 文件卡淡入 → 六列由上而下 `spring` 逐列填入（stagger，仿 `Ch3Page6SpecStructure` 卡片）
- 時間：Overlay composition 總長約 780 frame，S17 段約 240–780（`ROW_START = [320, 372, 424, 476, 528, 580]`，數值可於實作微調）

### S18 白底實作頁（`Ch3Page7SpecPractice`，約 720 frame）

白底全螢幕，`Sequence` 串兩個子場景。

#### 前半 `Ch3Page7SpecPerFeature`「一個功能，一份 Spec」左右對比（約 330 frame）

> 設計演進：原為「正例 ＋ 糾結反例震動淡出 ＋ 底部結論」，因震動顯雜、對比不夠清楚，改為乾淨的左右對比：兩邊用相同的正常顏色（藍膠囊／藍標題文件卡），差別只在「結構 ＋ ✓／✗」，移除震動與底部結論。

- 標題：`一個功能，一份 Spec`（置頂置中）
- 中央細虛線分隔，左右兩個對稱面板：
  - **左＝正例**：三個功能膠囊（`跳躍`／`衝刺`／`攀牆`，BLUE）各自以中性藍灰連線連到一份獨立小文件卡（`jump-spec.md`／`dash-spec.md`／`climb-spec.md`）→ 下方綠色 **✓**（GREEN）
  - **右＝反例**：三個功能匯聚連線到單一文件卡（`all-spec.md`，內容列較多示意「塞滿」）→ 下方紅色 **✗**（RED）
- 連線用中性藍灰（`withAlpha(BLUE, 0.5)`），不預先暗示好壞，由 ✓／✗ 傳達對比
- 動態（順序出現）：正例先完整建立（膠囊→文件→連線→✓，約 0–135）→ 反例後出現（膠囊→文件→匯聚連線→✗，約 140–270）→ 兩邊並陳 hold → 整頁淡出（300–330）
- 版面：標題與內容下移置中、上下留白平衡

#### 後半 `Ch3Page7SpecWorkflow` 實作流程圖（約 390 frame）

沿用 `Ch3Page5AgentsFlow` 的卡片＋`strokeDashoffset` 繪線＋三角箭頭手法。

> 設計演進：原為「五節點全部先彈入、再回頭逐段補線」，看起來像線是後補的；改為**順流式串接**——節點出現後，其連線往右畫出去帶出下一個節點（`STRIDE` 控制節奏），讀起來是流程一步步長出。另兩項修正：回饋迴圈起點離「手動驗證」節點底部留間距（`FB_Y` ＝節點底 +36）、整體下壓（`FB_DEPTH` 850），避免黃線貼著黃節點；連線只畫到箭頭底部（`ARROW_LEN`），由三角形當尖端，避免線戳出箭頭。

- 標題：`Spec 實作流程`
- 五節點：`User Story → Spec → Plan → AI／使用者實作 → 手動驗證`（橫向等距，中心 x = 230／590／950／1310／1670）
- 順流式串接：節點 `spring` 彈入 → 該段藍色連線 `strokeDashoffset` 由 1→0 畫出、三角箭頭淡入 → 帶出下一個節點（依序重複）
- 連線只畫到箭頭底部（`L x2 - ARROW_LEN`），三角形當尖端
- 驗證節點黃色高亮
- 回饋迴圈：自「手動驗證」往下、繞回「Spec」的黃色曲線（起點與節點底留間距、整體下壓），白底「驗證失敗 → 回 Spec」標籤壓在迴圈上
- 收尾：`開始實作 →` 轉場字樣淡入
- 動態：節點→連線→下一節點 逐步長出 → 驗證節點高亮 → 回饋曲線繪回 Spec → 「開始實作」淡入 → 整頁淡出

## 不做（YAGNI）

- 不在 Remotion 內重現實際 Celeste 影片或縮放影片（由剪輯軟體處理）。
- 不新增主題色、字型或全域樣式。
- 不重構與本頁無關的既有元件。

## 驗證方式

- Remotion Studio 開啟三個 composition，逐 frame 檢查 S16 標題進出場、S17 文件卡逐列填入與 ☑ 子項、S18 前半左右對比順序出現（✓／✗）與後半順流式串接、回饋迴圈。
- 確認 Overlay composition 背景透明（疊在影片上不會出現白底；根 `AbsoluteFill` 不可有不透明底色，已有測試把關）。
- 測試：`node --test tests/ch3-page7-celeste-spec.test.mjs`（檔案結構斷言）。
- `npm run lint`（eslint + tsc）通過。
