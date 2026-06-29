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

// 第 2 集・第 1 頁・S03：知識導覽（270 幀）
const CONTENT_IN = [0, 20] as const;
const TAGS = ["限制設計", "核心玩法", "核心循環"] as const;
const TAG_STEP = 24;
const TAG_FIRST = 38;
const HILITE = [186, 218] as const;

export const Ch2Page1S03KnowledgeNav: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, CONTENT_IN, [0, 1], clamp);

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
          prompt="先認識幾個重要觀念"
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
