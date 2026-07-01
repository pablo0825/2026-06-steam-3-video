import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  NEUTRAL_300,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 3 頁・S07-01：Rhythm Doctor User Story 透明 Overlay（600 幀）
//   原版：三列 tag-pill 版面。S07-02 為 S05 句型風格的替代版。
const VEIL_IN = [8, 36] as const;
const VEIL_OUT = [570, 600] as const;
const US_HEADING_IN = [60, 90] as const;
const ROW_START = [100, 160, 220] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const STORY_ROWS: { tag: string; node: React.ReactNode }[] = [
  { tag: "身為一位", node: <>玩家</> },
  {
    tag: "我想要",
    node: (
      <>
        在<span style={KEY}>第七拍</span>按下<span style={KEY}>空白鍵</span>
      </>
    ),
  },
  { tag: "為了", node: <>配合節奏救活病人，完成關卡</> },
];

export const Ch3Page3S07UserStoryOverlay01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, US_HEADING_IN, [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 330,
          transform: `translate(-50%, ${interpolate(
            headingIn,
            [0, 1],
            [16, 0],
          )}px)`,
          opacity: headingIn * infoOut,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 4,
          color: WHITE,
          textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
          whiteSpace: "nowrap",
        }}
      >
        寫成 <span style={{ color: YELLOW }}>User Story</span>
      </div>

      {STORY_ROWS.map((row, index) => {
        const progress = spring({
          frame: frame - ROW_START[index],
          fps,
          config: {
            damping: 18,
            stiffness: 120,
            overshootClamping: true,
          },
        });
        const y = 455 + index * 115;

        return (
          <div
            key={row.tag}
            style={{
              position: "absolute",
              left: 960,
              top: y,
              width: 1080,
              transform: `translate(-50%, -50%) translateY(${interpolate(
                progress,
                [0, 1],
                [28, 0],
              )}px)`,
              opacity: progress * infoOut,
              display: "flex",
              alignItems: "center",
              gap: 28,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            <div
              style={{
                width: 200,
                flexShrink: 0,
                textAlign: "center",
                padding: "14px 0",
                borderRadius: 14,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 2,
                color: TEXT_DARK,
                backgroundColor: NEUTRAL_300,
                boxShadow: `0 10px 24px ${withAlpha(BLACK, 0.2)}`,
                textShadow: "none",
              }}
            >
              {row.tag}
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: 46,
                fontWeight: 800,
                letterSpacing: 1,
                color: WHITE,
                whiteSpace: "nowrap",
              }}
            >
              {row.node}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
