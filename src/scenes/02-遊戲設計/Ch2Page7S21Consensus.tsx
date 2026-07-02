import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  BORDER_LIGHT,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeSoft } from "../../theme/motion";
import {
  MemberAvatar,
  StoryboardBoardPreview,
} from "./Ch2Page7StoryboardShared";

// 第 2 集・第 7 頁・S21：用分鏡圖凝聚團隊共識（490 幀）
const CONTENT_OUT = [460, 489] as const;
const AVATAR_START = [60, 90, 120] as const;
const LINE_START = [98, 128, 158] as const;

export const Ch2Page7S21Consensus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const boardEntrance = interpolate(frame, [0, 38], [0, 1], easeSoft);
  const avatarProgress = AVATAR_START.map((start) =>
    spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 125 },
    }),
  );
  const lineProgress = LINE_START.map((start) =>
    interpolate(frame, [start, start + 28], [0, 1], easeSoft),
  );
  const leftBubble = spring({
    frame: frame - 210,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const rightBubble = spring({
    frame: frame - 250,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const checkProgress = interpolate(frame, [340, 372], [0, 1], easeSoft);
  const alignedOpacity = interpolate(frame, [370, 398], [0, 1], clamp);
  const consensusProgress = spring({
    frame: frame - 400,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity }}>
        <StoryboardBoardPreview progress={boardEntrance} />

        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
          aria-hidden="true"
        >
          {[
            "M406 540C500 540 560 520 650 500",
            "M1514 540C1420 540 1360 520 1270 500",
            "M960 854V650",
          ].map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={index === 2 ? BLUE : SUBTLE}
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress[index]}
            />
          ))}
        </svg>

        <MemberAvatar
          x={340}
          y={540}
          color={TEXT_DARK}
          progress={avatarProgress[0]}
          fromX={-90}
          fromY={0}
        />
        <MemberAvatar
          x={1580}
          y={540}
          color={SUBTLE}
          progress={avatarProgress[1]}
          fromX={90}
          fromY={0}
        />
        <MemberAvatar
          x={960}
          y={920}
          color={BLUE}
          progress={avatarProgress[2]}
          fromX={0}
          fromY={90}
        />

        {[
          { left: 185, top: 250, progress: leftBubble },
          { left: 1375, top: 250, progress: rightBubble },
        ].map((bubble, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: bubble.left,
              top: bubble.top,
              width: 360,
              padding: "24px 28px",
              borderRadius: 24,
              border: `3px solid ${BORDER_LIGHT}`,
              backgroundColor: WHITE,
              color: TEXT_DARK,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 2,
              textAlign: "center",
              opacity: bubble.progress,
              transform: `scale(${interpolate(bubble.progress, [0, 1], [0.86, 1])}) translateY(${interpolate(bubble.progress, [0, 1], [18, 0])}px)`,
              boxShadow: `0 12px 30px ${withAlpha(TEXT_DARK, 0.08)}`,
              zIndex: 4,
            }}
          >
            我們想的一樣嗎？
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 730,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: alignedOpacity,
            zIndex: 5,
          }}
        >
          <svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
            <circle
              cx="37"
              cy="37"
              r="32"
              fill={withAlpha(YELLOW, 0.12)}
              stroke={YELLOW}
              strokeWidth="4"
            />
            <path
              d="m21 38 11 11 22-25"
              fill="none"
              stroke={YELLOW}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - checkProgress}
            />
          </svg>
          <span
            style={{
              color: YELLOW,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            想像一致
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 145,
            transform: `translateX(-50%) translateY(${interpolate(consensusProgress, [0, 1], [20, 0])}px)`,
            opacity: consensusProgress,
            color: TEXT_DARK,
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: 6,
            whiteSpace: "nowrap",
          }}
        >
          凝聚團隊<span style={{ color: YELLOW }}>共識</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
