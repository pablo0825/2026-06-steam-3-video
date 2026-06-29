import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  DASH_BORDER,
  NEUTRAL_50,
  PANEL_BG,
  SUBTLE,
  TEXT_DARK,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 5 頁・S13：AGENTS.md 實機示範佔位（180 幀）
const STEPS = [
  "建立 AGENTS.md",
  "寫入「請使用日文回覆」",
  "開啟新對話並提問",
  "確認規則生效",
] as const;

export const Ch3Page5S13AgentsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 115 },
  });
  const contentIn = interpolate(frame, [18, 42], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(
            titleIn,
            [0, 1],
            [0.92, 1],
          )})`,
          opacity: titleIn,
          fontSize: 68,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
          whiteSpace: "nowrap",
        }}
      >
        實際操作 AGENTS.md
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 250,
          transform: "translateX(-50%)",
          display: "flex",
          gap: 18,
          opacity: contentIn,
        }}
      >
        {STEPS.map((step, index) => (
          <div
            key={step}
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 800,
              color: BLUE,
              backgroundColor: withAlpha(BLUE, 0.07),
              whiteSpace: "nowrap",
            }}
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 650,
          width: 1240,
          height: 600,
          transform: "translate(-50%, -50%)",
          opacity: contentIn,
          borderRadius: 28,
          border: `4px dashed ${DASH_BORDER}`,
          backgroundColor: PANEL_BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div style={{ fontSize: 100 }}>🎬</div>
        <div style={{ fontSize: 46, fontWeight: 900, color: TEXT_DARK }}>
          連續螢幕錄影待補
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: SUBTLE }}>
          建立規則 → 開啟新對話 → 驗證回覆
        </div>
      </div>
    </AbsoluteFill>
  );
};
