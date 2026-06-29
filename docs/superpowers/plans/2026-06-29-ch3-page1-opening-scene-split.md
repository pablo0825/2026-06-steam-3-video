# Ch3 Page1 Opening Scene Split Plan

- Scope: `Ch3-Page1-Opening` / S01-S03
- Storyboard: `docs/03-程式實作/steam - 3 - Vibe Game 教案 - 程式實作 - 分鏡腳本.md`
- Scene dir: `src/scenes/03-程式實作/`
- Source: `src/scenes/03-程式實作/Ch3Page1Opening.tsx`

## Targets

- [x] `Ch3-Page1-Opening`: S01-S03
  - Source timing:
    - S01: frames 0-210, opening title, exit fade 188-210
    - S02: frames 210-450, focus cards, local duration 240
    - S03: frames 450-780, knowledge navigation, local duration 330
  - Outputs:
    - `Ch3Page1S01Opening.tsx`
    - `Ch3Page1S02Focus.tsx`
    - `Ch3Page1S03KnowledgeNav.tsx`
  - Implementation plan:
    - Move each shot into a single exported React component with a local frame timeline starting at 0.
    - Normalize outer backgrounds to `NEUTRAL_50`.
    - Replace local `FONT` and inline clamp objects with imports from `../../theme/motion`.
    - Update `src/Root.tsx` to register only individual S01-S03 compositions.
    - Remove the old multi-shot source file and old `Ch3-Page1-Opening` composition id from active imports/registrations.
  - Validation:
    - `python3 .agents/skills/split-remotion-scenes/scripts/validate_scene_split.py src/scenes/03-程式實作/Ch3Page1S01Opening.tsx src/scenes/03-程式實作/Ch3Page1S02Focus.tsx src/scenes/03-程式實作/Ch3Page1S03KnowledgeNav.tsx` passed.
    - `npm run lint` passed.
    - Manual inspection confirmed S01/S02/S03 use local frame timelines, retain `NEUTRAL_50` as the opaque outer background, and remove the old active multi-shot entry point from `src/Root.tsx`.
  - Commit: included in target commit `split ch3 page1 scenes into S01-S03`
