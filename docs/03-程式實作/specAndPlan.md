# 執行單一 Unity 功能切片

請讀取：

- @Game Implementation Roadmap
- AGENTS.md
- 切片引用的設計文件、Storyboard
- 相關 Spec、Plan、程式、場景與 Prefab

執行：

<Feature Slice ID>

流程：

Spec → Plan → AI 實作與驗證 → 人類整合與驗收 → 更新 Roadmap → Commit

一次只處理一個切片，不得擴大範圍或自行開始下一個切片。若已有進度，依 Roadmap Status 繼續，不重做已核准工作。

## 開始前檢查

確認：

- 切片存在。
- Depends On 皆為 Accepted。
- 沒有其他切片正在執行或等待人工整合。
- 專案現況與 Roadmap 一致。

合法狀態以 Roadmap 的 `Roadmap Status Definitions` 為唯一來源。階段改變時同步更新 Status、Status Note、Last Updated。

若規則衝突、設計不足或缺少資源，設為 Blocked；Status Note 記錄原因、原狀態及解除條件，解除後回到原狀態。

## 文件

文件使用中文；程式名稱、Unity API、路徑與狀態值維持英文。

- Spec：
  `docs/specs/<id>/<id>-<name>-spec.md`

- Plan：
  `docs/plans/<id>/<id>-<name>-plan.md`

`<name>` 使用英文 kebab-case。更新原本 Roadmap，不因日期建立新 Roadmap。建立文件前先搜尋既有文件，並遵循 AGENTS.md 的專案慣例。

文件加入：

- Feature ID
- Status
- Created
- Last Updated
- Extends／Supersedes（適用時）

## 文件版本

- 尚未 Accepted：修改原 Spec／Plan，重新核准受影響文件。
- 已 Accepted 且新增玩家行為：建立新 Feature ID、Spec、Plan。
- 擴充舊功能：新 Spec 記錄 `Extends`，舊 Spec 保持有效。
- 完全取代：新 Spec 記錄 `Supersedes`；舊 Spec 標示 `Superseded`，舊 Plan 保留為歷史紀錄。
- 純 Bug 修復且不改需求：保留原 Spec，建立 Bug Record。
- 不使用 `v2`、`final`、`new` 等版本名稱，也不刪除歷史文件。

若目標切片已 Accepted，但尚未建立新的變更切片，先提出新切片並停止等待核准。

## 1. Spec

Status 為 Pending 時建立 Spec，包含：

- Purpose／User Story
- Input／Output／Rules
- Included／Excluded
- Preliminary Integration Contract
- AI Acceptance
- Human Unity Acceptance
- Open Questions

Spec 只定義「做什麼」，不寫詳細實作方式。

完成後提供路徑與中文摘要，停止等待核准。核准後：

- Spec Status → Approved
- Roadmap Status → Spec Approved

## 2. Plan

Spec 核准後建立 Plan，包含：

- Goal／Scope／Files
- Implementation Steps
- Risks／Open Issues

使用勾選框列出：

- AI Implementation Tasks
- AI Verification
- Human Unity Integration
- Human Unity Acceptance
- Documentation Updates

Plan 必須依據 Spec，寫清楚程式工作、Component、腳本掛載、Inspector、Prefab、Layer、Tag 與驗證方式。若與 Spec 不一致，先修訂並重新核准 Spec。

完成後提供路徑與中文摘要，停止等待核准。核准後：

- Plan Status → Approved
- Roadmap Status → Plan Approved

## Existing — Unverified

不要直接重寫：

- 有 Spec／Plan：依其條件驗證。
- 沒有：依 Roadmap 的 Planned AI Verification 與 Acceptance 驗證。
- 資訊不足：回到 Spec。
- 發現缺漏：回到對應階段。
- 全部通過：設為 Accepted。

## 3. AI 實作與驗證

開始時：

- Roadmap Status → Implementing
- 僅執行核准 Plan
- 保留不相關修改
- 完成項目更新為 `[x]`
- 不修改 Unity 生成目錄
- 不編造 `.meta` 或 GUID，也不任意修改既有 `.meta`

實作完成：

- Roadmap Status → AI Verification
- 執行可用的編譯、測試、靜態分析及介面檢查
- 只勾選實際執行並取得證據的項目

不得宣稱未執行的 Unity、Play Mode、畫面、碰撞或物理驗證已通過。

驗證失敗則回到 Implementing；通過則：

- Roadmap Status → Ready for User Integration
- 回報修改檔案、驗證結果及人工驗收清單
- 停止等待我驗收
- 不要 Commit

## 4. 人類整合與驗收

我開始驗收時：

- Roadmap Status → User Verification

只有我能勾選人工整合及驗收項目。

失敗時：

- 需求錯誤 → Pending，回到 Spec
- Plan 遺漏 → Spec Approved，回到 Plan
- 程式錯誤 → Implementing
- Unity 設定未完成 → Ready for User Integration
- 缺少決定或資源 → Blocked

只有我明確確認通過後：

- 勾選人工項目
- Roadmap Status → Accepted
- 更新 Spec、Plan、Roadmap

## 5. Commit

只有 Accepted 後才能準備 Commit。

先列出預計提交的檔案並停止等待我確認。我同意後，僅提交本切片相關的：

- Spec、Plan
- 程式與測試
- Unity 資產與必要 `.meta`
- Roadmap 與驗證紀錄

Commit 訊息：

`feat(<Feature Slice ID>): <功能名稱>`

不要 Push。完成後回報 Commit ID、修改檔案、AI／人類驗收及最終狀態，然後停止。
