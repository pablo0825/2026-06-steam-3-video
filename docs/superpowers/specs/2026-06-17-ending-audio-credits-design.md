# 片尾「音樂與音效」引用 — 設計規格

- 日期：2026-06-17
- 範圍：`src/scenes/Page10Ending.tsx`（單一檔案）
- 目標：在片尾上捲名單的最後、知點 logo 之前，加入本片使用之背景音樂與音效的引用（Freesound.org，CC0）。

## 背景

片尾 `Page10Ending.tsx` 是一段連續上捲的名單卷軸：
主持人照片 ＋「感謝各位聆聽」→「製作團隊」名單（製作單位／人名／經費補助單位／計畫名稱）→ 知點 logo 收尾。

目前專案尚未使用 `<Audio>`（`public/thud.mp3` 存在但未被引用）。本次只新增「引用文字」，與音訊是否實際放入影片無關。

## 要呈現的內容

兩筆來源皆來自 Freesound.org，授權皆為 CC0，並一併顯示上傳日期。

```
                音樂與音效                ← 區段標題（藍，FS_TITLE 60）

                  背景音樂                ← 標籤（灰，FS_LABEL 26）
        "Background Music" — NastelBom    ← 內容（深，FS_BODY 32）
         Freesound.org · CC0 · 2026/1/9   ← meta 小字（灰，24）

                   音效                   ← 標籤（灰）
   "Opening bottle with falling cap"      ← 內容（深）
          — freesound_community
        Freesound.org · CC0 · 2022/8/31   ← meta 小字（灰）
```

文字內容（精確值）：
- 區段標題：`音樂與音效`
- 第 1 筆 — 標籤：`背景音樂`／內容：`"Background Music" — NastelBom`／meta：`Freesound.org · CC0 · 2026/1/9`
- 第 2 筆 — 標籤：`音效`／內容：`"Opening bottle with falling cap" — freesound_community`／meta：`Freesound.org · CC0 · 2022/8/31`

## 版面

- 插入位置：在「計畫名稱」區塊之後、logo（目前約第 181 行 `<Img src={LOGO} .../>`）之前，置於同一個上捲容器內，跟著畫布一起捲動。
- 沿用既有名單的字級階梯與配色，與「製作團隊」一致：
  - 區段標題：`fontSize: FS_TITLE`、`fontWeight: 800`、`color: BLUE`、`letterSpacing: 4`
  - 標籤：`fontSize: FS_LABEL`、`color: SUBTLE`、`fontWeight: 600`
  - 內容：`fontSize: FS_BODY`、`color: TEXT_DARK`、`fontWeight: 500`
  - meta 小字：`fontSize: 24`、`color: SUBTLE`、`fontWeight: 500`
- 與上方「計畫名稱」之間留一段間距（約 `marginTop: 80`），兩筆來源之間留中等間距（約 32）。

## 捲動時間調整（本次唯一的邏輯變更）

插入此區塊會把 logo 往下推約 380–420px。為了讓 logo 仍停在原本的定位、且捲速維持不變：

- 現況：`SCROLL_START = 90`、`SCROLL_END = 430`（捲動 340 frames）、`SCROLL_DISTANCE = 1500` → 約 4.4 px/frame；本頁 `durationInFrames = 450`。
- 調整方向：
  - `SCROLL_DISTANCE`：1500 → 約 1900（＋插入區塊高度）。
  - `SCROLL_END`：維持相同捲速下，340 → 約 430 frames，即 `SCROLL_END ≈ 520`。
  - 本頁 `durationInFrames`（於 `src/FullVideo.tsx`）：450 → 約 560，確保捲到定位後仍有短暫停留收尾。
- 上述為估算值；實作時以實際捲動到 logo 定位、且首尾留白自然為準微調。

## 不做（YAGNI）

- 不新增 `<Audio>`、不實際放入音訊。
- 不改動其他頁面或既有名單內容。
- 不加入超連結（影片為非互動輸出）。

## 驗收

- 上捲到名單尾端時，先出現「音樂與音效」兩筆引用，最後接 logo 停住收尾。
- 文字、授權、日期與上述「精確值」一致。
- 捲速與既有名單一致，無突兀加速；logo 最終定位與調整前相當。
