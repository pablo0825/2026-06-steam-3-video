import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { SpecDocumentCard } from "./Ch3Page6SpecShared";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {
  ...clamp,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const DISCUSSION_CARDS = [
  "玩家按下空白鍵",
  "角色向上跳躍",
  "落地後才能再次起跳",
  "跳躍高度需要一致",
] as const;

const BenefitIcon: React.FC<{ type: "maintain" | "token" }> = ({ type }) => {
  if (type === "maintain") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
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
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
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

export const Ch3Page6SpecDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, [48, 82], [0, 1], ease);
  const collect = interpolate(frame, [300, 480], [0, 1], ease);
  const documentIn = interpolate(frame, [430, 540], [0, 1], ease);
  const benefitOne = interpolate(frame, [570, 615], [0, 1], ease);
  const benefitTwo = interpolate(frame, [625, 670], [0, 1], ease);
  const out = interpolate(frame, [760, 808], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        fontFamily: FONT,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 92,
          transform: `translateX(-50%) scale(${interpolate(
            titleIn,
            [0, 1],
            [0.92, 1],
          )})`,
          opacity: titleIn,
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: 3,
          color: TEXT_DARK,
        }}
      >
        Spec
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 205,
          transform: "translateX(-50%)",
          opacity: definitionIn,
          fontSize: 40,
          fontWeight: 750,
          color: SUBTLE,
          whiteSpace: "nowrap",
        }}
      >
        把討論整理成可
        <span style={{ color: YELLOW, fontWeight: 900 }}>長期保存</span>
        的
        <span style={{ color: YELLOW, fontWeight: 900 }}>規格文件</span>
      </div>

      {DISCUSSION_CARDS.map((text, index) => {
        const cardIn = interpolate(
          frame,
          [120 + index * 42, 150 + index * 42],
          [0, 1],
          ease,
        );
        const startX = 340 + index * 90;
        const startY = 360 + index * 125;
        const targetX = 960 + (index - 1.5) * 20;
        const targetY = 560 + (index - 1.5) * 14;
        const x = interpolate(collect, [0, 1], [startX, targetX], ease);
        const y = interpolate(collect, [0, 1], [startY, targetY], ease);
        const scale = interpolate(collect, [0, 1], [1, 0.42], ease);
        const rotate = interpolate(
          collect,
          [0, 1],
          [index % 2 === 0 ? -2 : 2, 0],
          ease,
        );
        const cardOpacity =
          cardIn * interpolate(documentIn, [0, 0.75, 1], [1, 1, 0], clamp);

        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 540,
              height: 92,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
              opacity: cardOpacity,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              fontSize: 30,
              fontWeight: 800,
              color: TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${CARD_BORDER}`,
              boxShadow: `0 14px 32px ${withAlpha(TEXT_DARK, 0.08)}`,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                marginRight: 20,
                borderRadius: "50%",
                backgroundColor: BLUE,
              }}
            />
            {text}
          </div>
        );
      })}

      <SpecDocumentCard
        opacity={documentIn}
        scale={interpolate(documentIn, [0, 1], [0.72, 1], ease)}
        x={960}
        y={570}
      />

      {[
        {
          label: "維護與擴充有依據",
          type: "maintain" as const,
          x: 235,
          opacity: benefitOne,
          direction: -1,
        },
        {
          label: "減少重複掃描與 Token 消耗",
          type: "token" as const,
          x: 1255,
          opacity: benefitTwo,
          direction: 1,
        },
      ].map((benefit) => (
        <div
          key={benefit.label}
          style={{
            position: "absolute",
            left: benefit.x,
            top: 755,
            width: 430,
            minHeight: 112,
            transform: `translateX(${interpolate(
              benefit.opacity,
              [0, 1],
              [benefit.direction * 36, 0],
            )}px)`,
            opacity: benefit.opacity,
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "0 28px",
            fontSize: 29,
            fontWeight: 850,
            color: TEXT_DARK,
            backgroundColor: withAlpha(BLUE, 0.05),
            border: `2px solid ${CARD_BORDER}`,
          }}
        >
          <div style={{ color: BLUE }}>
            <BenefitIcon type={benefit.type} />
          </div>
          {benefit.label}
        </div>
      ))}
    </AbsoluteFill>
  );
};
