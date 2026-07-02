import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  CARD_BORDER,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { SpecDocumentCard } from "./Ch3Page6SpecShared";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";
const CARD_ENTER_STAGGER = 18;
const CARD_ENTER_DURATION = 30;
const CARDS_OUT = [216, 252] as const; // 集中後極短停留，再往中心收攏＋縮小淡出

const DISCUSSION_CARDS = [
  {
    text: "玩家按下空白鍵",
    x: 390,
    y: 315,
    rotate: -3,
  },
  {
    text: "角色向上跳躍",
    x: 1510,
    y: 300,
    rotate: 2.5,
  },
  {
    text: "落地後才能再次起跳",
    x: 430,
    y: 775,
    rotate: 2,
  },
  {
    text: "跳躍高度需要一致",
    x: 1480,
    y: 785,
    rotate: -2.5,
  },
] as const;

export const Ch3Page6S14SpecWorkflow: React.FC = () => {
  const frame = useCurrentFrame();

  const collect = interpolate(frame, [112, 212], [0, 1], easeOutExpo);
  // 集合到中間後往上移動一小段＋淡出消失，視窗隨即出現
  const cardsExit = interpolate(frame, CARDS_OUT, [0, 1], easeOutExpo);
  const documentIn = interpolate(frame, [250, 320], [0, 1], easeOutExpo);
  const split = interpolate(frame, [352, 442], [0, 1], easeOutExpo);
  const headingIn = interpolate(frame, [432, 477], [0, 1], easeOutExpo);
  const benefitOne = interpolate(frame, [462, 512], [0, 1], easeOutExpo);
  const benefitTwo = interpolate(frame, [517, 567], [0, 1], easeOutExpo);
  const out = interpolate(frame, [620, 658], [1, 0], clamp);

  const documentX = interpolate(split, [0, 1], [960, 550], easeOutExpo);
  const documentScale =
    interpolate(documentIn, [0, 1], [0.72, 1], easeOutExpo) *
    interpolate(split, [0, 1], [1, 0.82], easeOutExpo);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {DISCUSSION_CARDS.map((card, index) => {
          const enterStart = 12 + index * CARD_ENTER_STAGGER;
          const individualIn = interpolate(
            frame,
            [enterStart, enterStart + CARD_ENTER_DURATION],
            [0, 1],
            easeOutExpo,
          );
          const rise = interpolate(individualIn, [0, 1], [42, 0], easeOutExpo);
          const targetX = 960 + (index - 1.5) * 20;
          const targetY = 545 + (index - 1.5) * 13;
          // 先集中到扇形位置，再於淡出時往正中心收攏＋縮小
          const collectedX = interpolate(
            collect,
            [0, 1],
            [card.x, targetX],
            easeOutExpo,
          );
          const collectedY = interpolate(
            collect,
            [0, 1],
            [card.y, targetY],
            easeOutExpo,
          );
          const collectedScale = interpolate(
            collect,
            [0, 1],
            [1, 0.44],
            easeOutExpo,
          );
          // 集合後往上移動一小段再淡出（不收攏、不縮小）
          const x = collectedX;
          const y = collectedY - interpolate(cardsExit, [0, 1], [0, 70]);
          const scale = collectedScale;
          const rotate = interpolate(
            collect,
            [0, 1],
            [card.rotate, 0],
            easeOutExpo,
          );
          const opacity = individualIn * (1 - cardsExit);

          return (
            <div
              key={card.text}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 500,
                height: 108,
                transform: `translate(-50%, calc(-50% + ${rise}px)) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                borderRadius: 22,
                display: "flex",
                alignItems: "center",
                padding: "0 34px",
                fontSize: 30,
                fontWeight: 800,
                color: TEXT_DARK,
                backgroundColor: WHITE,
                border: `3px solid ${CARD_BORDER}`,
                boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.1)}`,
              }}
            >
              {card.text}
            </div>
          );
        })}

        <SpecDocumentCard
          opacity={documentIn}
          scale={documentScale}
          x={documentX}
          y={550}
        />

        <div
          style={{
            position: "absolute",
            left: 1050,
            top: 320,
            opacity: headingIn,
            transform: `translateY(${interpolate(
              headingIn,
              [0, 1],
              [20, 0],
            )}px)`,
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: 2,
            color: SUBTLE,
          }}
        >
          整理成 Spec 後
        </div>

        {[
          {
            label: "維護與擴充有依據",
            description: "可以查閱文件，了解功能的設計決策",
            top: 420,
            opacity: benefitOne,
          },
          {
            label: "減少 Token 消耗",
            description: "AI 不必每次都要，重新理解專案",
            top: 620,
            opacity: benefitTwo,
          },
        ].map((benefit, index) => (
          <div
            key={benefit.label}
            style={{
              position: "absolute",
              left: 1050,
              top: benefit.top,
              width: 690,
              transform: `translateY(${interpolate(
                benefit.opacity,
                [0, 1],
                [28, 0],
              )}px)`,
              opacity: benefit.opacity,
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                fontSize: 124,
                fontWeight: 800,
                lineHeight: 1,
                color: TEXT_DARK,
              }}
            >
              0{index + 1}
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: TEXT_DARK }}>
                {benefit.label}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 26,
                  fontWeight: 600,
                  color: SUBTLE,
                }}
              >
                {benefit.description}
              </div>
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
