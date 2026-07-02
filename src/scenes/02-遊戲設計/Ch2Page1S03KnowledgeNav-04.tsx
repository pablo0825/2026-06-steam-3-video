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

// 第 2 集・第 1 頁・S03-04：知識導覽，Storyboard 高亮（300 幀）
const HOLD = 30;
const TAGS = ["限制設計", "核心玩法", "核心循環", "Storyboard"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [50, 90] as const;
const OPENING_FADE = [0, 20] as const;
const ENDING_FADE = [245, 269] as const;

export const Ch2Page1S03KnowledgeNav04: React.FC = () => {
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
          highlightIndex={3}
          animateIn={false}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
