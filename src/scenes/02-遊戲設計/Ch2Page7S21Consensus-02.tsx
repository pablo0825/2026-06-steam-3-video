import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import {
  FONT,
  clamp,
  easeStandard,
  easeOutExpo as ease,
} from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";
import {
  CARD_H,
  CARD_MID_Y,
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

// 第 2 集・第 7 頁・S21-02：去跟夥伴確認想法（260 幀）
//   三人進場（左：確認者，右：兩位夥伴）→ 確認者頭上出現分鏡 → 夥伴頭上是虛線問號框
//   → 分鏡「複製一份」沿弧線飛向夥伴，落地取代問號框並彈出 ✓
//   → 三人頭上是同一張畫面，停留 → 結尾淡出。S21-03 是同構圖的反例。
const FIG_IN = [6, 34] as const;
const CARD_IN = [30, 64] as const; // 確認者頭上的分鏡
const BOX_IN = [56, 86] as const; // 夥伴頭上的虛線問號框
const FLY = [
  [100, 136],
  [120, 156],
] as const; // 兩張複製卡先後飛出
const BADGE_D = 56;
const CONTENT_OUT = [230, 259] as const;

const ARC_LIFT = 130; // 弧線最高點比卡片中心高多少（控制點取兩倍，貝茲頂點才是這個值）

// 二次貝茲：自確認者卡片中心飛向夥伴卡片中心，中途向上拱起。
const arcPoint = (toX: number, t: number) => {
  const u = 1 - t;
  return {
    x: u * u * CONFIRMER_X + 2 * u * t * ((CONFIRMER_X + toX) / 2) + t * t * toX,
    y: CARD_MID_Y - 4 * u * t * ARC_LIFT,
  };
};

export const Ch2Page7S21Consensus02: React.FC = () => {
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
        {/* 三人剪影：確認者在左，兩位夥伴在右 */}
        <div style={{ position: "absolute", inset: 0, opacity: figIn }}>
          <Figure cx={CONFIRMER_X} />
          {PARTNER_X.map((cx) => (
            <Figure key={cx} cx={cx} />
          ))}
        </div>

        {/* 確認者頭上的分鏡：飛出去的是複製品，原本這張始終留著 */}
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

        {/* 兩位夥伴：虛線問號框 →（分鏡落地）→ 同一張分鏡 + ✓ */}
        {PARTNER_X.map((cx, i) => {
          const [, end] = FLY[i];
          const landed = interpolate(frame, [end - 2, end + 8], [0, 1], clamp);
          const pop = spring({
            frame: frame - (end + 6),
            fps,
            config: { damping: 12, stiffness: 170 },
          });
          return (
            <React.Fragment key={cx}>
              <QuestionBox
                style={{ ...slotStyle(cx), opacity: boxIn * (1 - landed) }}
              />
              <StoryboardCard
                src={STORYBOARDS[0]}
                style={{
                  ...slotStyle(cx),
                  opacity: landed,
                  transform: `scale(${interpolate(landed, [0, 1], [1.06, 1])})`,
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
                <VerdictBadge kind="pass" size={BADGE_D} shadow />
              </div>
            </React.Fragment>
          );
        })}

        {/* 飛行中的複製卡：起飛→落地期間可見，落地瞬間交棒給夥伴頭上的卡 */}
        {PARTNER_X.map((toX, i) => {
          const [start, end] = FLY[i];
          if (frame < start || frame > end) {
            return null;
          }
          const t = interpolate(frame, [start, end], [0, 1], easeStandard);
          const p = arcPoint(toX, t);
          // 飛行中微縮，落地前回到原尺寸
          const s = 1 - 0.08 * Math.sin(Math.PI * t);
          return (
            <StoryboardCard
              key={toX}
              src={STORYBOARDS[0]}
              style={{
                position: "absolute",
                left: p.x - CARD_W / 2,
                top: p.y - CARD_H / 2,
                transform: `scale(${s})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
