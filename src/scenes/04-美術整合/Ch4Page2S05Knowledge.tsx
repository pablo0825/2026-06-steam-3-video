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

// 第 4 集・第 2 頁・S05：相關知識導覽（330 幀，結尾淡出到 NEUTRAL_50）
//   三個相關知識標籤，聚焦「遊戲畫面大小」。
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 87; // 整段開頭較原本晚 15 幀，開場多停一點白底
const TAG_STEP = 24;
const HIGHLIGHT = [225, 265] as const;
const OPENING_FADE = [15, 35] as const; // 先停約 15 幀白底，再讓「相關知識」淡入
const ENDING_FADE = [306, 330] as const;

export const Ch4Page2S05Knowledge: React.FC = () => {
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
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
