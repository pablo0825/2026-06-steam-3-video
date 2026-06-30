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

// 第 4 集・第 1 頁・S02：AI 生圖的角色？＋左右對比（× 取代 ｜ ✓ 優化）
//   標題在畫面中央以大字進場、停約 1 秒 → 原地淡出消失。
//   標題消失後，× 在左、✓ 在右並置：× 先淡入、✓ 後淡入，兩者停留讀對比，
//   最後整體一起淡出，畫面淨空，銜接 S03。
const TITLE_IN = [5, 28] as const; // 中央大字淡入
const TITLE_OUT = [62, 86] as const; // 停約 1 秒後原地淡出
const ENDING_FADE = [205, 233] as const; // ×／✓ 並置後一起淡出
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const TITLE_Y = 540; // 標題垂直位置（畫面正中央）
const MARKS_CENTER_Y = 540; // 符號的垂直位置（與標題同一中心）

// 左右對比符號：× 先、✓ 後，各自淡入後停住，結尾由 ENDING_FADE 一起淡出
const MARKS = [
  {
    mark: "×",
    markColor: RED,
    title: "取代美術人員",
    x: 560,
    in: [96, 112],
  },
  {
    mark: "✓",
    markColor: GREEN,
    title: "優化美術工作",
    x: 1360,
    in: [140, 156],
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
  // ×／✓ 並置停留後一起淡出
  const sceneOut = interpolate(frame, ENDING_FADE, [1, 0], clamp);

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

      {/* 左右對比：× 左、✓ 右，× 先 ✓ 後淡入並置，結尾一起淡出 */}
      {MARKS.map((m) => {
        const inE = interpolate(frame, m.in, [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const scale = interpolate(inE, [0, 1], [0.85, 1]);
        return (
          <div
            key={m.title}
            style={{
              position: "absolute",
              left: m.x,
              top: MARKS_CENTER_Y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: inE * sceneOut,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
            }}
          >
            {/* 符號圓底：紅／綠實色底 + 白色符號 */}
            <div
              style={{
                width: 210,
                height: 210,
                borderRadius: 999,
                background: m.markColor,
                boxShadow: `0 6px 18px ${withAlpha(m.markColor, 0.28)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 120,
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
                fontSize: 62,
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
