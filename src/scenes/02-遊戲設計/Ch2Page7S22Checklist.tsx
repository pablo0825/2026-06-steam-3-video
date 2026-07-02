import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { CHECKLIST, ChecklistCard } from "./Ch2Page7StoryboardShared";

// 第 2 集・第 7 頁・S22：繪製分鏡圖的重點（270 幀）
const CONTENT_IN = [0, 24] as const;
const CONTENT_OUT = [248, 269] as const;

export const Ch2Page7S22Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity =
    interpolate(frame, CONTENT_IN, [0, 1], clamp) *
    interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 82,
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <svg width="78" height="62" viewBox="0 0 78 62" aria-hidden="true">
            <rect
              x="3"
              y="3"
              width="72"
              height="56"
              rx="8"
              fill={WHITE}
              stroke={YELLOW}
              strokeWidth="5"
            />
            <path d="M27 4V58M51 4V58M4 30H74" stroke={YELLOW} strokeWidth="4" />
          </svg>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
            }}
          >
            繪製分鏡圖的<span style={{ color: YELLOW }}>重點</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 250,
            display: "grid",
            gridTemplateColumns: "660px 660px",
            gap: "40px 52px",
          }}
        >
          {CHECKLIST.map((item, index) => {
            const progress = spring({
              frame: frame - item.start,
              fps,
              config: { damping: 14, stiffness: 125 },
            });
            const accentProgress =
              index === 3
                ? progress
                : frame < item.start + 42
                  ? progress
                  : interpolate(frame, [item.start + 42, item.start + 70], [1, 0], clamp);

            return (
              <ChecklistCard
                key={item.label}
                label={item.label}
                icon={item.icon}
                progress={progress}
                accentProgress={accentProgress}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
