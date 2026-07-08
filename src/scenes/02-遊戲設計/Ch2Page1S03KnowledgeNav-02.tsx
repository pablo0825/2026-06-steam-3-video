import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { KnowledgeNav } from "../../components/KnowledgeNav";

// 第 2 集・第 1 頁・S03-02：知識導覽，核心玩法高亮（300 幀）
const HOLD = 30;
const TAGS = ["限制設計", "核心玩法", "核心循環", "Storyboard"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [50, 90] as const;
const OPENING_FADE = [0, 20] as const;
const ENDING_FADE = [242, 266] as const; // 提前於最後一格前完成淡出（f=frame-30；300 幀最後格 299）

export const Ch2Page1S03KnowledgeNav02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - HOLD;

  const inOp = interpolate(f, OPENING_FADE, [0, 1], clamp);
  const out = interpolate(f, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: inOp * out,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KnowledgeNav
          prompt="相關知識"
          tags={TAGS}
          frame={f}
          fps={fps}
          tagFirst={TAG_FIRST}
          tagStep={TAG_STEP}
          highlight={HIGHLIGHT}
          highlightIndex={1}
          animateIn={false}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
