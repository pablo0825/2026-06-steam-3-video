# Ch3 Page 5 S12 Horizontal Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change S12 into a left-to-right flow that shows the current question, conversation context, and `AGENTS.md` feeding into AI before a compliant answer appears.

**Architecture:** Keep the change inside `Ch3Page5AgentsFlow`. Replace the top input cards with a three-card vertical stack on the left, converge three animated blue paths into the center AI node, then animate one yellow path toward the answer card on the right.

**Tech Stack:** React, TypeScript, Remotion, SVG.

## Global Constraints

- Preserve the existing 360-frame S12 duration.
- Preserve the delayed arrowhead behavior; arrowheads must not appear before their paths.
- Input order: `使用者問題` → `Context` → `AGENTS.md`.
- Visual direction: left → center AI → right answer.
- Title: `AI 會綜合多項資訊回答`.
- Do not add back the removed bottom transition text.

---

### Task 1: Rebuild the S12 information flow

**Files:**

- Modify: `src/scenes/03-程式實作/Ch3Page5AgentsFlow.tsx`
- Modify: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`

**Interfaces:**

- Consumes: existing theme colors and Remotion timing helpers.
- Produces: the existing `Ch3Page5AgentsFlow` component with a horizontal three-input flow.

- [ ] **Step 1: Run a failing structural check**

Verify that the current component lacks `對話脈絡`, still uses the old title, and does not contain three input cards.

- [ ] **Step 2: Implement the layout**

Use three left-side cards:

```text
對話脈絡 / Context
這次的要求 / 使用者問題
專案的長期規則 / AGENTS.md
```

Draw three blue paths toward the center AI node. Render arrowheads as independent SVG groups after the paths are nearly complete. Draw a yellow path from AI to the right-side answer card and reveal that card last.

- [ ] **Step 3: Synchronize the storyboard**

Update only the S12 visual and animation descriptions. Keep the approved narration unchanged.

- [ ] **Step 4: Verify**

Run:

```powershell
npm.cmd run lint
npm.cmd run build
git diff --check
```

Render keyframes for cards, input paths, AI, output path, and final answer. Confirm the flow is visually left-to-right and contains no overlap.

---

## Self-Review

- The design includes all three information sources without claiming they are technically separate from the model context.
- The animation order is explicit.
- The change is limited to S12 and its storyboard description.
