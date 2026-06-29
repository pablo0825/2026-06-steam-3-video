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

// 第 3 集・第 1 頁・S03-4：知識導覽（330 幀，結尾淡出到 NEUTRAL_50）
//   四個相關知識標籤，聚焦「Spec」。
//   複製自 Ch3Page1S03KnowledgeNav，僅 highlightIndex 不同；暫以多檔處理，避免大改編號。
const TAGS = ["User Story", "Context", "AGENTS.md", "Spec"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [50, 90] as const; // 四項直接到位後提早跑高亮（複用版不重跑進場）
const OPENING_FADE = [0, 20] as const; // 開場淡入（與 Ch2/Ch3 一致）
const ENDING_FADE = [306, 330] as const;

export const Ch3Page1S03KnowledgeNav4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOp = interpolate(frame, OPENING_FADE, [0, 1], clamp);
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

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
          frame={frame}
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
