import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  BLUE,
  CARD_BORDER,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { SpecDocumentCard } from "./Ch3Page6SpecShared";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";
const CARD_ENTER_STAGGER = 18;
const CARD_ENTER_DURATION = 30;

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

const BenefitIcon: React.FC<{ type: "maintain" | "token" }> = ({ type }) => {
  if (type === "maintain") {
    return (
      <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M12 10v22m0-22 8 8m-8-8-8 8m8 14c8-8 16-8 24 0m0 0-8-8m8 8-8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        d="M15 20h18M15 28h11"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="m31 31 4 4 7-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Ch3Page6S14SpecWorkflow: React.FC = () => {
  const frame = useCurrentFrame();

  const collect = interpolate(frame, [112, 212], [0, 1], easeOutExpo);
  const documentIn = interpolate(frame, [180, 250], [0, 1], easeOutExpo);
  const split = interpolate(frame, [275, 365], [0, 1], easeOutExpo);
  const headingIn = interpolate(frame, [345, 390], [0, 1], easeOutExpo);
  const benefitOne = interpolate(frame, [375, 425], [0, 1], easeOutExpo);
  const benefitTwo = interpolate(frame, [430, 480], [0, 1], easeOutExpo);
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
        const x = interpolate(collect, [0, 1], [card.x, targetX], easeOutExpo);
        const y = interpolate(collect, [0, 1], [card.y, targetY], easeOutExpo);
        const scale = interpolate(collect, [0, 1], [1, 0.44], easeOutExpo);
        const rotate = interpolate(
          collect,
          [0, 1],
          [card.rotate, 0],
          easeOutExpo,
        );
        const opacity =
          individualIn *
          interpolate(documentIn, [0, 0.7, 1], [1, 1, 0], clamp);

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
            <span
              style={{
                width: 14,
                height: 14,
                marginRight: 20,
                flex: "0 0 auto",
                borderRadius: "50%",
                backgroundColor: BLUE,
              }}
            />
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
          top: 290,
          opacity: headingIn,
          transform: `translateY(${interpolate(
            headingIn,
            [0, 1],
            [20, 0],
          )}px)`,
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: 2,
          color: TEXT_DARK,
        }}
      >
        整理成 Spec 後
      </div>

      {[
        {
          label: "維護與擴充有依據",
          description: "功能的設計決策能被持續查閱",
          type: "maintain" as const,
          top: 400,
          opacity: benefitOne,
        },
        {
          label: "減少重複掃描與 Token 消耗",
          description: "AI 不必每次重新理解整個專案",
          type: "token" as const,
          top: 620,
          opacity: benefitTwo,
        },
      ].map((benefit) => (
        <div
          key={benefit.label}
          style={{
            position: "absolute",
            left: 1050,
            top: benefit.top,
            width: 690,
            height: 166,
            transform: `translateY(${interpolate(
              benefit.opacity,
              [0, 1],
              [28, 0],
            )}px)`,
            opacity: benefit.opacity,
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: "0 34px",
            color: TEXT_DARK,
            backgroundColor: WHITE,
            border: `2px solid ${CARD_BORDER}`,
            boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
          }}
        >
          <div
            style={{
              width: 82,
              height: 82,
              flex: "0 0 auto",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BLUE,
              backgroundColor: WHITE,
              boxShadow: `0 10px 24px ${withAlpha(TEXT_DARK, 0.07)}`,
            }}
          >
            <BenefitIcon type={benefit.type} />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>
              {benefit.label === "維護與擴充有依據" ? (
                <>
                  維護與擴充
                  <span style={{ color: YELLOW }}>有依據</span>
                </>
              ) : (
                <>
                  減少重複掃描與
                  <span style={{ color: YELLOW }}> Token 消耗</span>
                </>
              )}
            </div>
            <div
              style={{
                marginTop: 13,
                fontSize: 25,
                fontWeight: 650,
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
