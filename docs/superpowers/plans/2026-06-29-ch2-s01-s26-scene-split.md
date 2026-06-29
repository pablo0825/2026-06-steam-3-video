# Ch2 S01-S26 Scene Split Plan

- Scope: ch2 S01-S26
- Storyboard: `docs/02-遊戲設計/steam - 3 - Vibe Game 教案 - 遊戲設計 - 分鏡腳本.md`
- Scene dir: `src/scenes/02-遊戲設計/`
- Acceptance:
  - Split multi-shot scene files into one-shot scene files.
  - Use shot-numbered file/component/composition names.
  - Use `NEUTRAL_50` as opaque full-frame background unless the scene is an intentional alpha overlay.
  - Import `FONT`, `clamp`, and shared easing values from `../../theme/motion`.
  - Fade content layers on exit; do not fade the outer background.

## Targets

- [x] Ch2-Page1-Opening: S01-S03
  - Source: `src/scenes/02-遊戲設計/Ch2Page1Opening.tsx`
  - Outputs: `Ch2Page1S01Opening.tsx`, `Ch2Page1S02Focus.tsx`, `Ch2Page1S03KnowledgeNav.tsx`
  - Plan: split the existing three internal ranges into independent local timelines: S01 210f, S02 240f, S03 270f. Replace the old `Ch2-Page1-Opening` registration with shot-numbered registrations.
  - Validation: `validate_scene_split.py` OK; `npm run lint` OK; old active Root id/export removed.
  - Commit: `62e5bba` (`split ch2 page1 scenes into S01-S03`)

- [x] Ch2-Page2-Constraint: S04-S06
  - Source: `src/scenes/02-遊戲設計/Ch2Page2Constraint.tsx`
  - Outputs: `Ch2Page2S04Constraint.tsx`, `Ch2Page2S05GameJam.tsx`, `Ch2Page2S06Question.tsx`
  - Plan: split definition, Game Jam explanation, and transition question into local timelines. Source has 930f while storyboard seconds total 810f; use source timing and note storyboard timing needs review after split.
  - Validation: `validate_scene_split.py` OK; `npm run lint` OK; old active Root id/export removed.
  - Commit: `ec7826e` (`split ch2 page2 scenes into S04-S06`)

- [x] Ch2-Page3-RhythmDoctor: S07-S09
  - Source: `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctor.tsx`, `src/scenes/02-遊戲設計/Ch2Page3RhythmDoctorOverlay.tsx`
  - Outputs: `Ch2Page3S07RhythmDoctor.tsx`, `Ch2Page3S07RhythmDoctorOverlay.tsx`, `Ch2Page3S08Limit.tsx`, `Ch2Page3S08LimitOverlay.tsx`, `Ch2Page3S09ConstraintMethod.tsx`
  - Plan: preserve transparent overlay behavior for S07/S08 because the storyboard specifies external gameplay footage plus alpha overlay; S09 must be opaque `NEUTRAL_50`. Source has 740f while storyboard seconds total 810f; use source timing and note storyboard timing needs review after split.
  - Validation: `validate_scene_split.py` OK for preview/opaque files; overlay files manually checked as intentional alpha outputs with `calculateAlphaOverlayMetadata`; `npm run lint` OK; old active Root ids/exports removed.
  - Commit: `a65a255` (`split ch2 page3 scenes into S07-S09`)

- [x] Ch2-Page4-CorePlay: S10-S12
  - Source: `src/scenes/02-遊戲設計/Ch2Page4CorePlay.tsx`, `src/scenes/02-遊戲設計/Ch2Page4CorePlayOverlay.tsx`
  - Outputs: `Ch2Page4S10CorePlay.tsx`, `Ch2Page4S11Celeste.tsx`, `Ch2Page4S11CelesteOverlay.tsx`, `Ch2Page4S12Actions.tsx`, `Ch2Page4S12ActionsOverlay.tsx`
  - Plan: preserve transparent overlay behavior for S11/S12 because the storyboard specifies external gameplay footage plus alpha overlay; S10 must be opaque `NEUTRAL_50`. Source has 700f while storyboard timing is approximate; use source timing and note storyboard timing needs review after split.
  - Validation: `validate_scene_split.py` OK for preview/opaque files; overlay files manually checked as intentional alpha outputs with `calculateAlphaOverlayMetadata`; `npm run lint` OK; old active Root ids/exports removed.
  - Commit: pending

- [ ] Ch2-Page5-CoreLoop: S13-S15
  - Source: `src/scenes/02-遊戲設計/Ch2Page5CoreLoop.tsx`
  - Outputs: `Ch2Page5S13CoreLoop.tsx`, `Ch2Page5S14LoopFramework.tsx`, `Ch2Page5S15MonsterLoop.tsx`
  - Plan: split the framework introduction, loop diagram build, and monster-game walkthrough while keeping `CoreLoopDiagram.tsx` as a shared helper if useful.
  - Validation: pending
  - Commit: pending

- [ ] Ch2-Page6-LoopCeleste: S16-S17
  - Source: `src/scenes/02-遊戲設計/Ch2Page6LoopCeleste.tsx`
  - Outputs: `Ch2Page6S16CelesteVideo.tsx`, `Ch2Page6S17CelesteLoop.tsx`
  - Plan: split placeholder video card and Celeste loop comparison.
  - Validation: pending
  - Commit: pending

- [ ] Ch2-Page7-Storyboard: S18-S22
  - Source: `src/scenes/02-遊戲設計/Ch2Page7Storyboard.tsx`
  - Outputs: `Ch2Page7S18StoryboardIntro.tsx`, `Ch2Page7S19Examples.tsx`, `Ch2Page7S20Readable.tsx`, `Ch2Page7S21Consensus.tsx`, `Ch2Page7S22Checklist.tsx`
  - Plan: split the existing storyboard sequence into five shot files.
  - Validation: pending
  - Commit: pending

- [ ] Ch2-Page8-DocDemo: S23-S24
  - Source: missing from `src/scenes/02-遊戲設計/`
  - Outputs: needs user decision
  - Plan: storyboard references a placeholder/demo composition, but no corresponding implementation file or Root registration exists. Marked for user decision; do not synthesize new scene files without direction.
  - Validation: blocked
  - Commit: not applicable

- [ ] Ch2-Page9-BoardDemo: S25-S26
  - Source: missing from `src/scenes/02-遊戲設計/`
  - Outputs: needs user decision
  - Plan: storyboard references a placeholder/demo composition, but no corresponding implementation file or Root registration exists. Marked for user decision; do not synthesize new scene files without direction.
  - Validation: blocked
  - Commit: not applicable

## Notes

- Page8 and Page9 have storyboard entries but no current implementation files or Root registrations.
- Page3 and Page4 include intentional alpha overlay compositions backed by external video; the transparent overlay exception applies only to those overlay outputs.
