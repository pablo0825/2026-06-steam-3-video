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

// 第 3 集・第 1 頁・S03-3：知識導覽（354 幀，開場白底先停留 24 幀，結尾淡出到 NEUTRAL_50）
//   四個相關知識標籤，聚焦「AGENTS.md」。
//   複製自 Ch3Page1S03KnowledgeNav，僅 highlightIndex 不同；暫以多檔處理，避免大改編號。
const HOLD = 24; // 開場白底先停留的幀數
const TAGS = ["User Story", "Context", "AGENTS.md", "Spec"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [50, 90] as const; // 四項直接到位後提早跑高亮（複用版不重跑進場）
const OPENING_FADE = [0, 20] as const; // 開場淡入（與 Ch2/Ch3 一致）
const ENDING_FADE = [306, 330] as const;

export const Ch3Page1S03KnowledgeNav3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 整段延後 HOLD 幀，開場白底先多停留
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
          highlightIndex={2}
          animateIn={false}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
