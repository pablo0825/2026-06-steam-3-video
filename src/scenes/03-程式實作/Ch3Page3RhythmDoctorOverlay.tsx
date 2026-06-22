import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BLACK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 3 集・第 3 頁 透明 Overlay（節奏醫生）— 真實 gameplay 由剪輯軟體放下層
//   S06（0–240）：放射柔光 ＋ 置中標題群組（User Story 案例／節奏醫生／Rhythm Doctor／黃線）
//   S07（240–840）：半透明黑遮罩 ＋ 上方節拍點綴 ＋ 下方填好的 User Story 三列

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: EASE };

// ── S06 標題 ──
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;

export const Ch3Page3RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // ── S06 ──
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* ── S06：標題 ── */}
      {frame < 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 1120,
              height: 620,
              borderRadius: "50%",
              opacity: glowOpacity,
              background: `radial-gradient(ellipse, ${withAlpha(BLACK, 0.7)} 0%, ${withAlpha(BLACK, 0.44)} 38%, ${withAlpha(BLACK, 0)} 72%)`,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${titleY}px)`,
              textShadow: `0 4px 24px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 8,
                color: YELLOW,
              }}
            >
              User Story 案例
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 104,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 12,
                color: WHITE,
              }}
            >
              節奏醫生
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: 6,
                color: withAlpha(WHITE, 0.78),
              }}
            >
              Rhythm Doctor
            </div>
            <div
              style={{
                marginTop: 30,
                width: 112,
                height: 6,
                borderRadius: 999,
                backgroundColor: YELLOW,
                boxShadow: `0 0 22px ${withAlpha(YELLOW, 0.42)}`,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── S07：半透明黑 ＋ 節拍點綴 ── (added in Task 2) */}

      {/* ── S07：User Story 三列 ── (added in Task 3) */}
    </AbsoluteFill>
  );
};
