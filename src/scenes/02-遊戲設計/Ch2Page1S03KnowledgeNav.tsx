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

// 第 2 集・第 1 頁・S03：知識導覽（300 幀，前 30 幀白底停留）
const OPENING_HOLD = 30;
const CONTENT_IN = [OPENING_HOLD, OPENING_HOLD + 20] as const;
const TAGS = ["限制設計", "核心玩法", "核心循環", "Storyboard"] as const;
const TAG_STEP = 24;
const TAG_FIRST = OPENING_HOLD + 38;
const HILITE = [OPENING_HOLD + 186, OPENING_HOLD + 218] as const;
const ENDING_FADE = [270, 296] as const; // 於最後一格前完成淡出（300 幀的最後格為 299）

export const Ch2Page1S03KnowledgeNav: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity =
    interpolate(frame, CONTENT_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KnowledgeNav
          prompt="相關知識"
          tags={TAGS}
          frame={frame}
          fps={fps}
          tagFirst={TAG_FIRST}
          tagStep={TAG_STEP}
          highlight={HILITE}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
