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

type IconType =
  | "person"
  | "io"
  | "rules"
  | "boundary"
  | "check"
  | "notes";

const FIELDS = [
  {
    title: "User Story",
    description: "從使用者角度描述功能",
    icon: "person" as const,
  },
  {
    title: "Input / Output",
    description: "玩家輸入什麼，遊戲回應什麼",
    icon: "io" as const,
  },
  {
    title: "Rules",
    description: "功能的規則與限制",
    icon: "rules" as const,
  },
  {
    title: "Non-goals",
    description: "這次不實作的範圍",
    icon: "boundary" as const,
  },
  {
    title: "Acceptance Criteria",
    description: "怎樣才算完成",
    icon: "check" as const,
  },
  {
    title: "Notes",
    description: "其他補充與備註",
    icon: "notes" as const,
  },
] as const;

const FieldIcon: React.FC<{ type: IconType }> = ({ type }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "person") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="15" r="7" {...common} />
        <path d="M10 39c2-9 8-13 14-13s12 4 14 13" {...common} />
      </svg>
    );
  }
  if (type === "io") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M7 16h30m0 0-8-7m8 7-8 7M41 32H11m0 0 8-7m-8 7 8 7"
          {...common}
        />
      </svg>
    );
  }
  if (type === "rules") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M10 10h28v28H10zM17 18h14M17 25h14M17 32h9"
          {...common}
        />
      </svg>
    );
  }
  if (type === "boundary") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="9" width="30" height="30" rx="5" {...common} />
        <path d="M15 33 33 15" {...common} />
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="9" width="30" height="30" rx="5" {...common} />
        <path d="m16 24 6 6 11-13" {...common} />
      </svg>
    );
  }
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M11 8h26v32H11zM17 17h14M17 24h14M17 31h9"
        {...common}
      />
    </svg>
  );
};

export const Ch3Page6SpecStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const collect = interpolate(frame, [730, 870], [0, 1], ease);
  const documentIn = interpolate(frame, [790, 900], [0, 1], ease);
  const tipIn = interpolate(frame, [870, 915], [0, 1], ease);
  const out = interpolate(frame, [980, 1018], [1, 0], clamp);

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
          top: 84,
          transform: `translateX(-50%) scale(${interpolate(
            titleIn,
            [0, 1],
            [0.94, 1],
          )})`,
          opacity: titleIn,
          fontSize: 68,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
        }}
      >
        Spec 結構
      </div>

      {FIELDS.map((field, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const startX = 250 + column * 550;
        const startY = 250 + row * 300;
        const cardIn = spring({
          frame: frame - (70 + index * 28),
          fps,
          config: { damping: 17, stiffness: 110, overshootClamping: true },
        });
        const highlightStart = 250 + index * 80;
        const highlight = interpolate(
          frame,
          [
            highlightStart,
            highlightStart + 18,
            highlightStart + 62,
            highlightStart + 78,
          ],
          [0, 1, 1, 0],
          clamp,
        );
        const x = interpolate(collect, [0, 1], [startX, 960], ease);
        const y = interpolate(collect, [0, 1], [startY, 570], ease);
        const collectScale = interpolate(collect, [0, 1], [1, 0.3], ease);
        const cardOpacity =
          cardIn * interpolate(documentIn, [0, 0.72, 1], [1, 1, 0], clamp);
        const accent = highlight > 0.15 ? YELLOW : SUBTLE;

        return (
          <div
            key={field.title}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 470,
              height: 225,
              transform: `scale(${collectScale * interpolate(
                highlight,
                [0, 1],
                [1, 1.04],
              )})`,
              transformOrigin: "center",
              opacity: cardOpacity,
              borderRadius: 26,
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "0 34px",
              backgroundColor: WHITE,
              border: `3px solid ${
                highlight > 0.15 ? YELLOW : CARD_BORDER
              }`,
              boxShadow: `0 18px 42px ${withAlpha(
                highlight > 0.15 ? YELLOW : TEXT_DARK,
                highlight > 0.15 ? 0.14 : 0.07,
              )}`,
            }}
          >
            <div style={{ color: accent, flex: "0 0 auto" }}>
              <FieldIcon type={field.icon} />
            </div>
            <div>
              <div
                style={{
                  fontSize: field.title === "Acceptance Criteria" ? 30 : 34,
                  fontWeight: 900,
                  color: highlight > 0.15 ? YELLOW : TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                {field.title}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 25,
                  fontWeight: 700,
                  lineHeight: 1.45,
                  color: SUBTLE,
                }}
              >
                {field.description}
              </div>
            </div>
          </div>
        );
      })}

      <SpecDocumentCard
        opacity={documentIn}
        scale={interpolate(documentIn, [0, 1], [0.72, 1], ease)}
        x={960}
        y={545}
      />

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 820,
          transform: `translateX(-50%) translateY(${interpolate(
            tipIn,
            [0, 1],
            [22, 0],
          )}px)`,
          opacity: tipIn,
          padding: "15px 34px",
          borderRadius: 999,
          fontSize: 30,
          fontWeight: 850,
          color: TEXT_DARK,
          backgroundColor: withAlpha(YELLOW, 0.11),
          border: `2px solid ${withAlpha(YELLOW, 0.66)}`,
        }}
      >
        先看案例，再一起寫
      </div>
    </AbsoluteFill>
  );
};
