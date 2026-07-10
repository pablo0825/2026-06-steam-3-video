import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, NEUTRAL_300, SUBTLE, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 4 頁・S11：核心玩法三拍 → 「一次定生死的體驗」（430 幀）
//   影片與缺點標註已移除（原型影片由 S10 獨立場景負責）。
const CONTENT_OUT = [408, 429] as const;
const LEAD_START = 185; // 「一次定生死的」
const HERO_START = 215; // 「體驗」

// 彈性進場：damping/stiffness 取 ζ≈0.55，會衝到約 1.13 倍再彈回 1.0。
const POP = { damping: 16, stiffness: 200 } as const;

const CAPSULES = [
  { label: "觀察機關", start: 40 },
  { label: "抓準時機", start: 85 },
  { label: "一次出手", start: 130 },
] as const;

export const Ch1Page4S11GameplayQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leadIn = spring({ frame: frame - LEAD_START, fps, config: POP });
  const heroIn = spring({ frame: frame - HERO_START, fps, config: POP });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* 直向置中排版：scale 進場不影響版面，三塊的位置從頭到尾固定 */}
      <AbsoluteFill
        style={{ opacity, alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ display: "flex", gap: 36 }}>
          {CAPSULES.map((capsule) => {
            const popIn = spring({ frame: frame - capsule.start, fps, config: POP });

            return (
              <div
                key={capsule.label}
                style={{
                  transform: `scale(${popIn})`,
                  border: `3px solid ${NEUTRAL_300}`,
                  color: SUBTLE,
                  fontSize: 38,
                  fontWeight: 700,
                  padding: "14px 34px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                {capsule.label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 100,
            transform: `scale(${leadIn})`,
            fontSize: 56,
            fontWeight: 800,
            color: SUBTLE,
            letterSpacing: 2,
          }}
        >
          一次定生死的
        </div>

        <div
          style={{
            marginTop: 12,
            transform: `scale(${heroIn})`,
            fontSize: 280,
            fontWeight: 900,
            color: TEXT_DARK,
            lineHeight: 1,
          }}
        >
          體驗
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
