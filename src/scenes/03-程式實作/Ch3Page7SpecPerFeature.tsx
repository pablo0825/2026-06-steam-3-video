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
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const FEATURES = ["跳躍", "衝刺", "攀牆"] as const;
const DOC_NAMES = ["jump-spec.md", "dash-spec.md", "climb-spec.md"] as const;
const ROW_Y = [330, 470, 610] as const;

// 小文件卡：藍色標題列 + 檔名 + 兩條內容列
const MiniDoc: React.FC<{ name: string; tone: string }> = ({ name, tone }) => (
  <div
    style={{
      width: 300,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: WHITE,
      border: `3px solid ${CARD_BORDER}`,
      boxShadow: `0 14px 30px ${withAlpha(TEXT_DARK, 0.1)}`,
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        color: WHITE,
        backgroundColor: tone,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 0.5,
      }}
    >
      {name}
    </div>
    <div style={{ padding: "16px 18px", display: "grid", gap: 10 }}>
      <div
        style={{
          height: 10,
          width: "78%",
          borderRadius: 999,
          backgroundColor: withAlpha(tone, 0.3),
        }}
      />
      <div
        style={{
          height: 9,
          width: "60%",
          borderRadius: 999,
          backgroundColor: withAlpha(SUBTLE, 0.24),
        }}
      />
    </div>
  </div>
);

const Pill: React.FC<{ label: string; tone: string }> = ({ label, tone }) => (
  <div
    style={{
      width: 180,
      height: 96,
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 34,
      fontWeight: 900,
      letterSpacing: 2,
      color: WHITE,
      backgroundColor: tone,
      boxShadow: `0 14px 30px ${withAlpha(tone, 0.28)}`,
    }}
  >
    {label}
  </div>
);

export const Ch3Page7SpecPerFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const goodLines = interpolate(frame, [70, 120], [0, 1], ease);
  const badIn = interpolate(frame, [140, 175], [0, 1], ease);
  const badFade = interpolate(frame, [250, 280], [1, 0], clamp);
  const shakeWindow = interpolate(frame, [220, 250], [1, 0], clamp);
  const shake = Math.sin((frame - 220) * 1.6) * 10 * shakeWindow * badIn;
  const conclusionIn = interpolate(frame, [285, 320], [0, 1], ease);
  const out = interpolate(frame, [310, 330], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 96,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 64,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
        }}
      >
        一個功能，一份 Spec
      </div>

      {/* 連線（正例：左功能 → 右文件，逐對；反例：三功能 → 單文件，糾結） */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {ROW_Y.map((y) => (
          <path
            key={`good-${y}`}
            d={`M360 ${y + 48} L520 ${y + 48}`}
            fill="none"
            stroke={GREEN}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - goodLines}
          />
        ))}
        {/* 反例：三條交叉線匯入單一文件 */}
        <g opacity={badIn * badFade} transform={`translate(${shake} 0)`}>
          {ROW_Y.map((y) => (
            <path
              key={`bad-${y}`}
              d={`M1400 ${y + 48} C1500 ${y + 48} 1500 470 1560 470`}
              fill="none"
              stroke={withAlpha(YELLOW, 0.85)}
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>

      {/* 正例：左功能膠囊 */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (20 + i * 14),
          fps,
          config: { damping: 17, stiffness: 120 },
        });
        return (
          <div
            key={`f-${label}`}
            style={{
              position: "absolute",
              left: 180,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
            }}
          >
            <Pill label={label} tone={BLUE} />
          </div>
        );
      })}

      {/* 正例：右獨立文件 */}
      {DOC_NAMES.map((name, i) => {
        const p = spring({
          frame: frame - (60 + i * 14),
          fps,
          config: { damping: 18, stiffness: 120 },
        });
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 520,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [26, 0])}px)`,
            }}
          >
            <MiniDoc name={name} tone={BLUE} />
          </div>
        );
      })}

      {/* 反例：三功能膠囊（小）+ 單一文件 */}
      <div
        style={{
          position: "absolute",
          left: 1240,
          top: 280,
          opacity: badIn * badFade,
          transform: `translateX(${shake}px)`,
          fontSize: 26,
          fontWeight: 800,
          color: SUBTLE,
        }}
      >
        ✗ 混在一份
      </div>
      {FEATURES.map((label, i) => (
        <div
          key={`bf-${label}`}
          style={{
            position: "absolute",
            left: 1240,
            top: ROW_Y[i],
            width: 150,
            height: 96,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: SUBTLE,
            backgroundColor: withAlpha(SUBTLE, 0.14),
            border: `2px solid ${withAlpha(SUBTLE, 0.4)}`,
            opacity: badIn * badFade,
            transform: `translateX(${shake}px)`,
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 1560,
          top: 422,
          opacity: badIn * badFade,
          transform: `translateX(${shake}px)`,
        }}
      >
        <MiniDoc name="all-spec.md" tone={withAlpha(SUBTLE, 0.85)} />
      </div>

      {/* 結論 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 860,
          transform: `translateX(-50%) translateY(${interpolate(conclusionIn, [0, 1], [16, 0])}px)`,
          opacity: conclusionIn,
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: 2,
          color: GREEN,
        }}
      >
        一個功能 → 一份 Spec
      </div>
    </AbsoluteFill>
  );
};
