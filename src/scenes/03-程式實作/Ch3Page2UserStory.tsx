import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SUBTLE, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 3 集・第 2 頁：User Story（定義 ＋ 格式）
//   S04：標題「User Story」彈入 → 定義句淡入（使用者的需求 黃字）；本頁刻意只保留標題與定義句
//   S05：三張格式卡（身為一位「角色」／我想要「需求」／為了「價值」）依序滑入 → 末尾縮小上移、提示淡入

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

// 重點字（黃色粗體＝強調）
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

// ── 兩段節奏（S04：0–360｜S05：360–720）──
const A_OUT = [332, 356] as const; // S04 淡出

// S04 內部節奏
const DEF_START = 44; // 定義句淡入

export const Ch3Page2UserStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // ── S04 ──
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const defOpacity = interpolate(frame, [DEF_START, DEF_START + 18], [0, 1], clamp);
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S04：定義（只保留標題與定義句） ── */}
      {frame < 360 && (
        <AbsoluteFill
          style={{
            opacity: aOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 6,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            User Story
          </div>

          <div
            style={{
              marginTop: 44,
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: defOpacity,
              whiteSpace: "nowrap",
            }}
          >
            用一段話，描述<span style={KEY}>使用者的需求</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ── S05：格式卡 ── (added in Task 2) */}
    </AbsoluteFill>
  );
};
