import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, DASH_BORDER, NEUTRAL_50, PANEL_BG, SUBTLE, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 9 頁・S22：實機操作 Codex 佔位卡（90 幀）
const CONTENT_OUT = [70, 90] as const;
const STEPS = ["① 下載 / 安裝 Codex", "② 輸入提示詞", "③ 建立 .md 檔"];

export const Ch1Page9S22CodexDemoPlaceholder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const boxOpacity = interpolate(frame, [15, 35], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 150,
            transform: `translate(-50%, -50%) scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
            opacity: titleIn,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: 4,
            color: TEXT_DARK,
          }}
        >
          實機操作 Codex
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 270,
            transform: "translateX(-50%)",
            opacity: boxOpacity,
            display: "flex",
            gap: 28,
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step}
              style={{
                background: `${BLUE}12`,
                color: BLUE,
                fontSize: 30,
                fontWeight: 700,
                padding: "12px 26px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 620,
            width: 1000,
            height: 460,
            marginLeft: -500,
            marginTop: -230,
            opacity: boxOpacity,
            borderRadius: 24,
            border: `4px dashed ${DASH_BORDER}`,
            background: PANEL_BG,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div style={{ fontSize: 110, lineHeight: 1 }}>🎬</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK }}>螢幕錄影待補</div>
          <div style={{ fontSize: 30, color: SUBTLE }}>（此處將放入操作 Codex 的實機畫面）</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
