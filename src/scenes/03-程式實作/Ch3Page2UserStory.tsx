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
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

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

const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ── S05 節奏與卡片 ──
const B_IN = [356, 380] as const; // S05 淡入
const STORY_CARDS = [
  { label: "身為一位", value: "角色", icon: "👤" },
  { label: "我想要", value: "需求", icon: "🎯" },
  { label: "為了", value: "價值", icon: "⭐" },
] as const;
const CARD_FIRST = 380; // 第一張卡進場
const CARD_STEP = 42; // 卡片間隔
const SHRINK = [612, 648] as const; // 三卡縮小上移
const TIP2_IN = [646, 678] as const; // 末尾提示淡入

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

  // ── S05 ──
  const ease = { ...clamp, easing: EASE };
  const bOpacity = interpolate(frame, B_IN, [0, 1], clamp);
  const groupScale = interpolate(frame, SHRINK, [1, 0.86], ease);
  const groupRise = interpolate(frame, SHRINK, [0, -130], ease);
  const tip2 = interpolate(frame, TIP2_IN, [0, 1], clamp);

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

      {/* ── S05：格式卡 ── */}
      {frame >= 354 && (
        <AbsoluteFill
          style={{
            opacity: bOpacity,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 48,
              transform: `translateY(${groupRise}px) scale(${groupScale})`,
            }}
          >
            {STORY_CARDS.map((c, i) => {
              const s = spring({
                frame: frame - (CARD_FIRST + i * CARD_STEP),
                fps,
                config: { damping: 16, stiffness: 120 },
              });
              return (
                <div
                  key={c.value}
                  style={{
                    width: 460,
                    padding: "48px 36px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateY(${interpolate(s, [0, 1], [56, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div style={{ fontSize: 84 }}>{c.icon}</div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      letterSpacing: 2,
                      color: SUBTLE,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: YELLOW,
                    }}
                  >
                    「{c.value}」
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 64,
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: 2,
              color: BLUE,
              opacity: tip2,
            }}
          >
            先看案例，再一起寫 →
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
