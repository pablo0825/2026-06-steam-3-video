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
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [210, 250] as const;
const HINT = [240, 270] as const; // 底部提示句，比高亮稍晚
const ENDING_FADE = [306, 330] as const;

export const Ch4Page2S05Knowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: out,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KnowledgeNav
          prompt="先認識幾個重要觀念"
          tags={TAGS}
          hintText="先從「遊戲畫面大小」開始 →"
          frame={frame}
          fps={fps}
          tagFirst={TAG_FIRST}
          tagStep={TAG_STEP}
          highlight={HIGHLIGHT}
          hint={HINT}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
