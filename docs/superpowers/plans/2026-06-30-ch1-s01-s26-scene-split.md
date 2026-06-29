# Ch1 S01-S26 Scene Split Plan

- Scope: ch1 S01-S26
- Storyboard: `docs/01-實驗介紹/steam - 3 - Vibe Game 教案 - 介紹實驗 - 分鏡腳本.md`
- Scene dir: `src/scenes/01-實驗介紹/`
- Acceptance:
  - Split multi-shot scene files into one-shot scene files.
  - Use shot-numbered file/component/composition names.
  - Use `NEUTRAL_50` as opaque full-frame background.
  - Import `FONT`, `clamp`, and shared easing values from `../../theme/motion`.
  - Fade content layers on exit; do not fade the outer background.

## Targets

- [x] Page1-Opening: S01-S02
  - Source: `src/scenes/01-實驗介紹/Page1Opening.tsx`
  - Outputs: `Ch1Page1S01Opening.tsx`, `Ch1Page1S02Title.tsx`
  - Plan: split logo/host opening and title/subtitle into independent local timelines. Replace old `Page1-Opening` registration with shot-numbered registrations and update `FullVideo`.
  - Validation: `validate_scene_split.py` OK; `npm run lint` OK; old active Root/FullVideo id/export removed.
  - Commit: `fb6bcd8` (`split ch1 page1 scenes into S01-S02`)

- [x] Page2-AI: S03-S05
  - Source: `src/scenes/01-實驗介紹/Page2AIToPrototype.tsx`
  - Outputs: `Ch1Page2S03AINode.tsx`, `Ch1Page2S04Domains.tsx`, `Ch1Page2S05PlayablePrototype.tsx`
  - Plan: split AI node, AI-to-domains expansion, and convergence to playable prototype. Source duration 330f while storyboard seconds total 540f; use source timing and note storyboard timing needs review after split.
  - Validation: `validate_scene_split.py` OK; old active Root/FullVideo id/export removed. `npm run lint` currently blocked by unrelated dirty Ch3 Root/file changes outside this target.
  - Commit: pending

- [ ] Page3-Prototype: S06-S09
  - Source: `src/scenes/01-實驗介紹/Page3Prototype.tsx`
  - Outputs: `Ch1Page3S06Question.tsx`, `Ch1Page3S07DefinitionRange.tsx`, `Ch1Page3S08FastPlayable.tsx`, `Ch1Page3S09ValidateQuestion.tsx`
  - Plan: split prototype question, broad definition, fastest playable version, and validation purpose.
  - Validation: pending
  - Commit: pending

- [ ] Page4-PrototypeVideo: S10-S11
  - Source: `src/scenes/01-實驗介紹/Page4PrototypeVideo.tsx`
  - Outputs: `Ch1Page4S10PrototypeVideo.tsx`, `Ch1Page4S11GameplayQuestion.tsx`
  - Plan: split centered prototype video intro and left-video/right-annotation explanation.
  - Validation: pending
  - Commit: pending

- [ ] Page5-Goal: S12-S14
  - Source: `src/scenes/01-實驗介紹/Page5PrototypeGoal.tsx`
  - Outputs: `Ch1Page5S12PrototypeGoal.tsx`, `Ch1Page5S13QuestionCards.tsx`, `Ch1Page5S14Validated.tsx`
  - Plan: split prototype goal, three validation cards, and verified stamps.
  - Validation: pending
  - Commit: pending

- [ ] Page6-Flow: S15-S16
  - Source: `src/scenes/01-實驗介紹/Page6Flow.tsx`
  - Outputs: `Ch1Page6S15ExperimentFlow.tsx`, `Ch1Page6S16CurrentPart.tsx`
  - Plan: split four-step experiment flow and Codex/current-video highlight.
  - Validation: pending
  - Commit: pending

- [ ] Page7-Codex: S17-S18
  - Source: `src/scenes/01-實驗介紹/Page7Codex.tsx`
  - Outputs: `Ch1Page7S17CodexAgent.tsx`, `Ch1Page7S18ComputerAccess.tsx`
  - Plan: split Codex AI Agent intro and computer/file operation explanation.
  - Validation: pending
  - Commit: pending

- [ ] Page8-Compare: S19-S21
  - Source: `src/scenes/01-實驗介紹/Page8Compare.tsx`
  - Outputs: `Ch1Page8S19ChatGPT.tsx`, `Ch1Page8S20Codex.tsx`, `Ch1Page8S21NoManualWork.tsx`
  - Plan: split ChatGPT side, Codex side, and conclusion comparison.
  - Validation: pending
  - Commit: pending

- [ ] Page9-Placeholder: S22
  - Source: `src/scenes/01-實驗介紹/Page9Placeholder.tsx`
  - Outputs: `Ch1Page9S22CodexDemoPlaceholder.tsx`
  - Plan: split the implemented placeholder card for the Codex operation segment.
  - Validation: pending
  - Commit: pending

- [ ] Page9 implementation recording: S23-S24
  - Source: missing from `src/scenes/01-實驗介紹/`
  - Outputs: needs user decision
  - Plan: storyboard describes implementation recording content, but no corresponding Remotion scene file exists beyond the S22 placeholder. Marked for user decision; do not synthesize new scene files without direction.
  - Validation: blocked
  - Commit: not applicable

- [ ] Page10-Ending: S25-S26
  - Source: `src/scenes/01-實驗介紹/Page10Ending.tsx`
  - Outputs: `Ch1Page10S25Thanks.tsx`, `Ch1Page10S26Credits.tsx`
  - Plan: split host/thanks opening and rolling credits.
  - Validation: pending
  - Commit: pending

## Notes

- `Page0LogoIntro.tsx` is not part of the storyboard S01-S26 scope and is left unchanged.
- S23-S24 currently have storyboard rows but no Remotion implementation file beyond `Page9Placeholder.tsx`.
