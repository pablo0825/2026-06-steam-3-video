import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";
import {
  CARD_TOP,
  CARD_W,
  CONFIRMER_X,
  Figure,
  PARTNER_X,
  QuestionBox,
  STORYBOARDS,
  StoryboardCard,
  slotStyle,
} from "./ConsensusStage";

// 第 2 集・第 7 頁・S21-03：沒去確認的下場（250 幀）
//   構圖與 S21-02 完全相同，差別只在「分鏡沒有傳出去」：確認者頭上的分鏡始終待在原地，
//   夥伴等不到，虛線問號框各自長出不一樣的想像畫面（sample-2／3）→ 各彈一個紅 ×
//   → 停在三張明顯不同的畫面上 → 結尾淡出。
const FIG_IN = [6, 34] as const;
const CARD_IN = [30, 64] as const; // 確認者頭上的分鏡（始終不動）
const BOX_IN = [56, 86] as const; // 夥伴頭上的虛線問號框
const IMAGINE = [
  [100, 132],
  [118, 150],
] as const; // 問號框各自長成不同的想像畫面
const BADGE_START = [160, 178] as const;
const BADGE_D = 56;
const CONTENT_OUT = [220, 249] as const;

export const Ch2Page7S21Consensus03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const figIn = interpolate(frame, FIG_IN, [0, 1], ease);
  const cardIn = interpolate(frame, CARD_IN, [0, 1], ease);
  const boxIn = interpolate(frame, BOX_IN, [0, 1], ease);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEUTRAL_50,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{ opacity }}>
        {/* 三人剪影：站位與 S21-02 相同 */}
        <div style={{ position: "absolute", inset: 0, opacity: figIn }}>
          <Figure cx={CONFIRMER_X} />
          {PARTNER_X.map((cx) => (
            <Figure key={cx} cx={cx} />
          ))}
        </div>

        {/* 確認者頭上的分鏡：沒有飛出去，只是待在原地 */}
        <StoryboardCard
          src={STORYBOARDS[0]}
          style={{
            ...slotStyle(CONFIRMER_X),
            opacity: cardIn,
            transform: `translateY(${interpolate(cardIn, [0, 1], [20, 0])}px) scale(${interpolate(
              cardIn,
              [0, 1],
              [0.94, 1],
            )})`,
          }}
        />

        {/* 兩位夥伴：問號框自己長成各自的想像（各不相同）→ 紅 × */}
        {PARTNER_X.map((cx, i) => {
          const grow = interpolate(frame, IMAGINE[i], [0, 1], ease);
          const pop = spring({
            frame: frame - BADGE_START[i],
            fps,
            config: { damping: 12, stiffness: 170 },
          });
          return (
            <React.Fragment key={cx}>
              <QuestionBox
                style={{ ...slotStyle(cx), opacity: boxIn * (1 - grow) }}
              />
              <StoryboardCard
                src={STORYBOARDS[i + 1]}
                style={{
                  ...slotStyle(cx),
                  opacity: grow,
                  transform: `scale(${interpolate(grow, [0, 1], [0.92, 1])})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: cx + CARD_W / 2 - BADGE_D / 2,
                  top: CARD_TOP - BADGE_D / 2,
                  transform: `scale(${pop})`,
                }}
              >
                <VerdictBadge kind="fail" size={BADGE_D} shadow />
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
