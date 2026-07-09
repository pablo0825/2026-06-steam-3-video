import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import {
  BORDER_LIGHT,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";

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
    fadeOut: [252, 275],
    objectPosition: "center 18%",
  },
] as const;

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
