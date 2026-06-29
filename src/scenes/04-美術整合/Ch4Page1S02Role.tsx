import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  GREEN,
  NEUTRAL_50,
  RED,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 1 頁・S02：AI 生圖的角色？＋中央對比（× 取代 → ✓ 優化）
//   標題在畫面中央以大字進場、停約 1 秒 → 原地淡出消失（不上移、不交棒給 S03）。
//   標題消失後，× 與 ✓ 在「畫面正中央同一位置」一次一個地「淡入 → 停 → 淡出」，
//   把視線收在中間；結尾畫面淨空，銜接 S03。
const TITLE_IN = [5, 28] as const; // 中央大字淡入
const TITLE_OUT = [62, 86] as const; // 停約 1 秒後原地淡出
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const TITLE_Y = 540; // 標題垂直位置（畫面正中央）
const MARKS_CENTER_Y = 540; // 中央符號的垂直位置（與標題同一中心）

// 中央符號：一次一個，淡入 → 停 → 淡出（in / out 區間）
const MARKS = [
  {
    mark: "×",
    markColor: RED,
    title: "取代美術人員",
    in: [96, 112],
    out: [138, 154],
  },
  {
    mark: "✓",
    markColor: GREEN,
    title: "優化美術工作",
    in: [160, 176],
    out: [196, 210],
  },
] as const;

export const Ch4Page1S02Role: React.FC = () => {
  const frame = useCurrentFrame();

  // ── 標題：中央大字進場 → 停留 → 原地淡出 ──────────────
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleScale = interpolate(titleIn, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: TITLE_Y,
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          opacity: titleIn * titleOut,
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: 4,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        AI 生圖的角色？
      </div>

      {/* 中央對比：× → ✓ 一次一個，疊在同一個中心位置淡入淡出 */}
      {MARKS.map((m) => {
        const inE = interpolate(frame, m.in, [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const outE = interpolate(frame, m.out, [1, 0], clamp);
        const scale = interpolate(inE, [0, 1], [0.85, 1]);
        return (
          <div
            key={m.title}
            style={{
              position: "absolute",
              left: 960,
              top: MARKS_CENTER_Y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: inE * outE,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 64,
            }}
          >
            {/* 符號圓底：紅／綠實色底 + 白色符號 */}
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: 999,
                background: m.markColor,
                boxShadow: `0 8px 24px ${withAlpha(m.markColor, 0.28)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 150,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: WHITE,
                }}
              >
                {m.mark}
              </div>
            </div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: 2,
                color: TEXT_DARK,
                whiteSpace: "nowrap",
              }}
            >
              {m.title}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
