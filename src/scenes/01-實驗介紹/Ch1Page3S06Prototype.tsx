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

// 第 1 集・第 3 頁・S06：遊戲原型是什麼？＋原型定義很廣（180 幀）
//   原本被拆成 S06(問句)/S07(問句＋定義詞) 兩顆，此處合併回單一連續鏡頭：
//   問句只彈一次、先單獨呈現（對「是什麼?」），第二拍才由中心散出定義詞（對「定義滿廣泛」）。
const CONTENT_OUT = [166, 179] as const;
const WORDS = ["草圖", "紙上原型", "可玩 demo", "概念驗證", "測試版", "電子原型"] as const;

// 定義詞由中心向外散開（第二拍，約 f=90 起）。
const WORD_START = 90;
const WORD_STAGGER = 7;
const WORD_RAMP = 22;

export const Ch1Page3S06Prototype: React.FC = () => {
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
          const start = WORD_START + index * WORD_STAGGER;
          const progress = interpolate(frame, [start, start + WORD_RAMP], [0, 1], easeOutExpo);
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
