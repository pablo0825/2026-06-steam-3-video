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

// 第 3 集・第 1 頁・S03：知識導覽（354 幀，開場白底先停留 24 幀）
const HOLD = 24; // 開場白底先停留的幀數
const CONTENT_IN = [0, 20] as const;
const ENDING_FADE = [306, 330] as const;
const TAGS = ["User Story", "Context", "AGENTS.md", "Spec"] as const;
const TAG_STEP = 24;
const TAG_FIRST = 38;
const HILITE = [210, 242] as const;

export const Ch3Page1S03KnowledgeNav: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 整段延後 HOLD 幀，開場白底先多停留
  const f = frame - HOLD;
  const opacity =
    interpolate(f, CONTENT_IN, [0, 1], clamp) *
    interpolate(f, ENDING_FADE, [1, 0], clamp);

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
          frame={f}
          fps={fps}
          tagFirst={TAG_FIRST}
          tagStep={TAG_STEP}
          highlight={HILITE}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
