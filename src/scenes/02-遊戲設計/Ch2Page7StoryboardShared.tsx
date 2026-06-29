import React from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, staticFile } from "remotion";
import {
  BORDER_LIGHT,
  CARD_BORDER,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { clamp } from "../../theme/motion";

export const STORYBOARD_SAMPLES = [
  {
    src: "02-遊戲設計/storyboard-sample-1.png",
    fadeIn: [0, 18],
    fadeOut: [82, 90],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-2.png",
    fadeIn: [86, 94],
    fadeOut: [166, 174],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-3.png",
    fadeIn: [170, 178],
    fadeOut: [252, 276],
    objectPosition: "center 18%",
  },
] as const;

export const CHECKLIST = [
  { label: "完整開始與結尾", icon: "endpoints", start: 50 },
  { label: "情境連貫", icon: "continuity", start: 100 },
  { label: "去複雜化", icon: "simplify", start: 150 },
  { label: "夥伴看得懂", icon: "readable", start: 200 },
] as const;

export type ChecklistIcon = "endpoints" | "continuity" | "simplify" | "readable";

type FullscreenStoryboardImageProps = {
  src: string;
  opacity: number;
  scale: number;
  objectPosition?: string;
};

export const FullscreenStoryboardImage: React.FC<FullscreenStoryboardImageProps> = ({
  src,
  opacity,
  scale,
  objectPosition = "center",
}) => (
  <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: NEUTRAL_50 }}>
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: -30,
        width: "calc(100% + 60px)",
        height: "calc(100% + 60px)",
        objectFit: "cover",
        objectPosition,
        filter: "blur(22px)",
        opacity: 0.18,
        transform: `scale(${scale * 1.04})`,
      }}
    />
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition,
        transform: `scale(${scale})`,
      }}
    />
  </AbsoluteFill>
);

type MemberAvatarProps = {
  x: number;
  y: number;
  color: string;
  progress: number;
  fromX: number;
  fromY: number;
};

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  x,
  y,
  color,
  progress,
  fromX,
  fromY,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 132,
      height: 132,
      transform: `translate(-50%, -50%) translate(${interpolate(progress, [0, 1], [fromX, 0])}px, ${interpolate(progress, [0, 1], [fromY, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      opacity: progress,
      borderRadius: "50%",
      backgroundColor: WHITE,
      boxShadow: `0 14px 32px ${withAlpha(TEXT_DARK, 0.1)}`,
    }}
  >
    <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
      <circle cx="66" cy="66" r="62" fill={WHITE} stroke={color} strokeWidth="5" />
      <circle
        cx="66"
        cy="47"
        r="20"
        fill={withAlpha(color, 0.16)}
        stroke={color}
        strokeWidth="5"
      />
      <path
        d="M33 103C39 79 52 72 66 72C80 72 93 79 99 103"
        fill={withAlpha(color, 0.16)}
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const ChecklistGlyph: React.FC<{
  icon: ChecklistIcon;
  color: string;
  progress: number;
}> = ({ icon, color, progress }) => {
  const draw = 1 - progress;

  return (
    <svg width="124" height="96" viewBox="0 0 124 96" aria-hidden="true">
      <g
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress}
      >
        {icon === "endpoints" && (
          <>
            <circle cx="19" cy="69" r="9" fill={color} />
            <path d="M29 69H91" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
            <path d="M94 18V77M96 20H116L107 31 116 42H96" />
          </>
        )}
        {icon === "continuity" && (
          <>
            <rect x="7" y="29" width="27" height="36" rx="4" />
            <rect x="49" y="29" width="27" height="36" rx="4" />
            <rect x="91" y="29" width="27" height="36" rx="4" />
            <path d="M36 47H46M78 47H88" />
          </>
        )}
        {icon === "simplify" && (
          <>
            <rect x="13" y="24" width="37" height="37" rx="4" />
            <circle cx="87" cy="42" r="20" />
            <path d="M21 76H102" />
          </>
        )}
        {icon === "readable" && (
          <>
            <circle cx="31" cy="34" r="13" />
            <circle cx="70" cy="34" r="13" />
            <path d="M10 73C14 56 21 51 31 51S48 56 52 73M49 73C53 56 60 51 70 51" />
            <path
              d="m82 62 11 11 23-29"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={draw}
            />
          </>
        )}
      </g>
    </svg>
  );
};

type ChecklistCardProps = {
  label: string;
  icon: ChecklistIcon;
  progress: number;
  accentProgress: number;
};

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  label,
  icon,
  progress,
  accentProgress,
}) => {
  const color = interpolateColors(accentProgress, [0, 1], [CARD_BORDER, YELLOW]);
  const iconProgress = interpolate(progress, [0, 0.72], [0, 1], clamp);
  const textProgress = interpolate(progress, [0.16, 1], [0, 1], clamp);

  return (
    <div
      style={{
        width: 660,
        height: 250,
        borderRadius: 24,
        border: `4px solid ${color}`,
        backgroundColor: WHITE,
        boxShadow: `0 16px 38px ${withAlpha(
          accentProgress > 0.45 ? YELLOW : TEXT_DARK,
          accentProgress > 0.45 ? 0.12 : 0.07,
        )}`,
        display: "flex",
        alignItems: "center",
        padding: "30px 54px",
        gap: 44,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${interpolate(progress, [0, 1], [0.96, 1])})`,
      }}
    >
      <ChecklistGlyph icon={icon} color={color} progress={iconProgress} />
      <div
        style={{
          fontSize: 43,
          fontWeight: 800,
          letterSpacing: 3,
          color: accentProgress > 0.55 ? YELLOW : TEXT_DARK,
          opacity: textProgress,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StoryboardBoardPreview: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 650,
      top: 286,
      width: 620,
      height: 350,
      overflow: "hidden",
      borderRadius: 24,
      border: `3px solid ${BORDER_LIGHT}`,
      backgroundColor: WHITE,
      boxShadow: `0 20px 50px ${withAlpha(TEXT_DARK, 0.12)}`,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px) scale(${interpolate(progress, [0, 1], [0.94, 1])})`,
      zIndex: 2,
    }}
  >
    <Img
      src={staticFile("02-遊戲設計/storyboard-sample-3.png")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 18%",
      }}
    />
  </div>
);
