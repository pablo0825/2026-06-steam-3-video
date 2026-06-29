---
name: split-remotion-scenes
description: Split multi-shot Remotion scene files in this course video project into one-shot scene files. Use when the user asks to split or normalize Ch1/Ch2/Ch3/Ch4 Remotion scenes by storyboard shot ranges such as "ch3 S01-S24", "Ch3-Page1-Opening", or "拆成單鏡頭檔案"; update scene naming, backgrounds, shared motion imports, Remotion registrations, validation plans, and per-target commits.
---

# Split Remotion Scenes

## Overview

Use this skill to convert a chapter range from multi-shot Remotion scene files into one file per shot, following the existing Ch4 single-shot pattern.

The goal is not only to split code. Keep the storyboard, scene files, Remotion entry points, validation notes, and commits aligned.

## Chapter Inputs

Resolve the storyboard and scene directories from the requested chapter:

| Chapter | Scene dir | Storyboard |
|---|---|---|
| ch1 | `src/scenes/01-實驗介紹/` | `docs/01-實驗介紹/steam - 3 - Vibe Game 教案 - 介紹實驗 - 分鏡腳本.md` |
| ch2 | `src/scenes/02-遊戲設計/` | `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md` |
| ch3 | `src/scenes/03-程式實作/` | `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md` |
| ch4 | `src/scenes/04-美術整合/` | `docs/04-美術整合/steam - 3 - Vibe Game 教案 - 美術整合 - 分鏡腳本.md` |

If the user specifies a range such as `ch3 S01-S24`, process only targets that overlap the shot range. If they specify one composition such as `Ch3-Page1-Opening`, process only that composition.

## Required Workflow

1. Inspect current git status before edits. Do not stage or revert unrelated user changes.
2. Read the matching storyboard file and locate:
   - the "製作進度" table,
   - every target composition in scope,
   - the shot rows and seconds for each target.
3. Inspect current scene files and Remotion entry points, especially `src/Root.tsx` and `src/FullVideo.tsx` if present.
4. Create or update a total plan in `docs/superpowers/plans/`, named like `YYYY-MM-DD-ch3-s01-s24-scene-split.md`.
5. Process one target composition at a time. For each target:
   - write a short implementation plan in the total plan before editing,
   - split the source into one component file per shot,
   - replace the old multi-shot Remotion registrations with individual shot registrations,
   - validate the output,
   - fix validation issues,
   - check off the target in the total plan,
   - commit only the files changed for that target.
6. Continue to the next target until the requested range is complete.

Ask the user before editing when the storyboard and source code do not provide enough information to identify a reliable shot boundary, duration, visual ownership, or target file name. Do not guess across ambiguous shot boundaries.

## Naming Rules

Use a single-shot component and file name:

```text
Ch{chapter}Page{page}S{shotNumberTwoDigits}{ShortTitle}.tsx
```

Examples:

- `Ch3Page1S01Opening.tsx`
- `Ch3Page1S02Focus.tsx`
- `Ch4Page2S08WhySize.tsx`

Export the component with the same PascalCase name as the file. Keep suffixes concise and descriptive; prefer the existing storyboard/composition wording.

Composition IDs must include the shot number for split outputs, using the existing project style. Example: `Ch3-Page1-S01-Opening`.

Do not keep the old multi-shot composition id, wrapper component, or aggregate `Series` composition after a split unless the user explicitly asks for a compatibility wrapper. For example, after splitting `Ch3-Page1-Opening`, remove `id="Ch3-Page1-Opening"` and keep only ids such as `Ch3-Page1-S01-Opening`, `Ch3-Page1-S02-Focus`, and `Ch3-Page1-S03-KnowledgeNav`.

## Scene Rules

Every generated shot file must satisfy these rules:

1. Contain only one shot component.
2. Use `NEUTRAL_50` as the full-frame background.
3. Import shared motion values from `../../theme/motion`:

```tsx
import { FONT, clamp, easeOutExpo, easeStandard, easeSoft } from "../../theme/motion";
```

Import only the names actually used.

4. Do not define local `FONT`, `clamp`, or project-level ease constants if the shared value exists in `../../theme/motion`.
5. During exit transitions, fade the content layer, not the background. The outer frame must remain opaque:

```tsx
return (
  <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
    <AbsoluteFill style={{ opacity: contentOpacity }}>
      {/* shot content */}
    </AbsoluteFill>
  </AbsoluteFill>
);
```

6. Do not make the outermost `AbsoluteFill` transparent or apply exit opacity to it.
7. Preserve transparent overlay behavior only for intentional overlay compositions backed by external video. If a requested split includes overlay scenes and the storyboard is unclear, ask the user whether the output should remain transparent or be normalized to `NEUTRAL_50`.

## Duration And Timing

Prefer timing sources in this order:

1. Existing source code frame ranges and `Sequence` durations.
2. Existing `Root.tsx` composition durations.
3. Storyboard seconds converted with the project fps.

When splitting a multi-shot component, reset each new shot's local frame timeline to start at `0`. Convert old global frame references by subtracting that shot's start frame.

Example: if S02 was originally `210-450`, the new S02 component uses local frames `0-240`; an animation that previously started at `238` now starts at `28`.

## Plan Format

The total plan should be concise and operational:

```md
# Ch3 S01-S24 Scene Split Plan

- Scope: ch3 S01-S24
- Storyboard: docs/03-程式實作/...
- Scene dir: src/scenes/03-程式實作/

## Targets

- [ ] Ch3-Page1-Opening: S01-S03
  - Source: src/scenes/03-程式實作/Ch3Page1Opening.tsx
  - Outputs: Ch3Page1S01Opening.tsx, Ch3Page1S02Focus.tsx, Ch3Page1S03KnowledgeNav.tsx
  - Plan: ...
  - Validation: pending
  - Commit: pending
```

Update the checklist after each target. Include the final commit hash after committing.

## Validation

Run TypeScript, lint, or the closest existing project validation command when available. Also run:

```bash
python3 .agents/skills/split-remotion-scenes/scripts/validate_scene_split.py <scene-files>
```

Use the script for mechanical checks only. Still manually inspect the storyboard mapping, frame offsets, entry point updates, and fade behavior.

Validation must confirm:

- each new file maps to one storyboard shot,
- file/export naming matches the target shot,
- `NEUTRAL_50` is the outer background,
- shared `FONT`, `clamp`, and ease imports come from `../../theme/motion`,
- exit fades do not make the background transparent,
- old multi-shot entry points, old composition ids, and aggregate wrapper components are removed from active Remotion registration unless explicitly requested by the user.

## Commit Rules

Commit after each target composition validates. Stage only relevant files for that target:

- new split scene files,
- removed or replaced source scene file if applicable,
- `src/Root.tsx` / `src/FullVideo.tsx` entry updates,
- the total plan update.

Use a message like:

```text
split ch3 page1 scenes into S01-S03
```

If the worktree already contains unrelated changes, leave them unstaged.
