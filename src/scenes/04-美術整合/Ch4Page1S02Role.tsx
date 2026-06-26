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
  GREEN,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 1 頁・S02：AI 生圖的角色＋左右對比
//   原 S02+S03 合併檔的 0–210 區間。標題淡入後保持顯示（不淡出），
//   由後續 S03 接手讓標題在流程上移時淡出。
const S2_IN = [5, 27] as const; // 標題淡入
const CONTRAST_IN = [27, 51] as const; // 對比卡淡入
const CONTRAST_OUT = [173, 209] as const; // 對比卡淡出
const CONTRAST_EMPH = [110, 145] as const; // 兩卡到位後：左淡、右放大強調
const LEFT_CARD = 39; // 左卡 spring 起點
const RIGHT_CARD = 71; // 右卡 spring 起點

export const Ch4Page1S02Role: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, S2_IN, [0, 1], clamp);
  const contrastOpacity =
    interpolate(frame, CONTRAST_IN, [0, 1], clamp) *
    interpolate(frame, CONTRAST_OUT, [1, 0], clamp);
  const leftCard = spring({
    frame: frame - LEFT_CARD,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const rightCard = spring({
    frame: frame - RIGHT_CARD,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const leftDim = interpolate(frame, CONTRAST_EMPH, [1, 0.35], clamp);
  const rightGrow = interpolate(frame, CONTRAST_EMPH, [1, 1.12], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 175,
          transform: "translateX(-50%)",
          opacity: titleOpacity,
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: 4,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        AI 生圖的角色
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 560,
          transform: "translate(-50%, -50%)",
          opacity: contrastOpacity,
          display: "flex",
          gap: 160,
        }}
      >
        {[
          {
            s: leftCard,
            cap: "AI 不是",
            capColor: SUBTLE,
            mark: "✗",
            markColor: RED,
            title: "取代美術人員",
            border: CARD_BORDER,
          },
          {
            s: rightCard,
            cap: "而是",
            capColor: GREEN,
            mark: "✓",
            markColor: GREEN,
            title: "優化美術工作",
            border: GREEN,
          },
        ].map((c, i) => (
          <div
            key={c.title}
            style={{
              opacity: c.s * (i === 0 ? leftDim : 1),
              transform: `scale(${c.s * (i === 1 ? rightGrow : 1)})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 2,
                color: c.capColor,
                marginBottom: 18,
              }}
            >
              {c.cap}
            </div>
            <div
              style={{
                width: 480,
                height: 280,
                background: WHITE,
                border: `3px solid ${c.border}`,
                borderRadius: 28,
                boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  fontSize: 110,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: c.markColor,
                }}
              >
                {c.mark}
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                {c.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
