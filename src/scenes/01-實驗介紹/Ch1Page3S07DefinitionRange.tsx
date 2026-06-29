import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHIP_BG, NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 3 頁・S07：原型定義很廣（90 幀）
const CONTENT_OUT = [76, 90] as const;
const WORDS = ["草圖", "紙上原型", "可玩 demo", "概念驗證", "測試版", "電子原型"] as const;

export const Ch1Page3S07DefinitionRange: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const questionIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const markPulse = 1 + 0.08 * Math.sin(frame / 10);
  const cx = 960;
  const cy = 540;
  const radius = 430;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        {WORDS.map((word, index) => {
          const angle = ((-90 + (index * 360) / WORDS.length) * Math.PI) / 180;
          const targetX = cx + Math.cos(angle) * radius;
          const targetY = cy + Math.sin(angle) * radius;
          const progress = interpolate(frame, [8 + index * 7, 30 + index * 7], [0, 1], easeOutExpo);
          const x = interpolate(progress, [0, 1], [cx, targetX]);
          const y = interpolate(progress, [0, 1], [cy, targetY]);

          return (
            <div
              key={word}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
                opacity: progress,
                background: CHIP_BG,
                color: SUBTLE,
                fontSize: 36,
                fontWeight: 600,
                padding: "12px 26px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {word}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${questionIn})`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 100,
            fontWeight: 800,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          遊戲原型
          <span style={{ color: SUBTLE, fontWeight: 500 }}>＝</span>
          <span style={{ color: YELLOW, transform: `scale(${markPulse})`, display: "inline-block" }}>
            ？
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
