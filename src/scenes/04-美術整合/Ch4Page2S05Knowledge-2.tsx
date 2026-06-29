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

// 第 4 集・第 2 頁・S05-2：相關知識導覽（330 幀，結尾淡出到 NEUTRAL_50）
//   三個相關知識標籤，聚焦「素材大小的基礎單位」。
//   複製自 Ch4Page2S05Knowledge，僅 highlightIndex 不同；暫以多檔處理，避免大改編號。
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [50, 90] as const; // 三項直接到位後提早跑高亮（複用版不重跑進場）
const OPENING_FADE = [0, 20] as const; // 開場淡入（與 Ch2/Ch3 一致）
const ENDING_FADE = [306, 330] as const;

export const Ch4Page2S05Knowledge2: React.FC = () => {
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
          highlightIndex={1}
          animateIn={false}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
