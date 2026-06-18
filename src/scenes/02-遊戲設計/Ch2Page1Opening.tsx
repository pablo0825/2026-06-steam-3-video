import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CHIP_BG, CARD_BORDER, SUBTLE, TEXT_DARK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 2 集・第 1 頁開場（連續動畫，三段）
//   S1：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「遊戲設計」
//   S2：本次重點兩張卡片（遊戲設計文件／Storyboard，皆「請 AI 協助產出」）
//   S3：知識導覽三標籤（限制設計／核心玩法／核心循環），「限制設計」高亮帶入下一頁

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

// ── 三段節奏（30fps；總長 720 frames＝24 秒）──
// S1：0–230｜S2：230–450｜S3：450–720
const A_OUT = [210, 235] as const; // S1 淡出
const B_IN = [232, 252] as const; // S2 淡入
const B_OUT = [430, 450] as const; // S2 淡出
const C_IN = [452, 472] as const; // S3 淡入

// S1 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

// S3 三標籤逐一彈入、限制設計高亮
const TAGS = ["限制設計", "核心玩法", "核心循環"] as const;
const TAG_STEP = 24; // 每個標籤間隔
const TAG_FIRST = 488;
const HILITE = [636, 668] as const; // 「限制設計」高亮

export const Ch2Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S1：開場標題 ──────────────────────────────
  const logoIn = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [560, 220]);
  const logoY = interpolate(t2, [0, 1], [460, 150]);

  const titleScale = spring({ frame: frame - TITLE_START, fps, config: { damping: 14, stiffness: 110 } });
  const titleOpacity = interpolate(frame, [TITLE_START, TITLE_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruleW = interpolate(frame, [TITLE_START + 10, TITLE_START + 34], [0, 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subOpacity = interpolate(frame, [SUB_START, SUB_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aOpacity = interpolate(frame, A_OUT, [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── S2：本次重點 ──────────────────────────────
  const bOpacity =
    interpolate(frame, B_IN, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, B_OUT, [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const card1 = spring({ frame: frame - 258, fps, config: { damping: 15, stiffness: 120 } });
  const card2 = spring({ frame: frame - 284, fps, config: { damping: 15, stiffness: 120 } });

  // ── S3：知識導覽 ──────────────────────────────
  const cOpacity = interpolate(frame, C_IN, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hilite = interpolate(frame, HILITE, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S1：開場標題 ── */}
      {frame < 240 && (
        <AbsoluteFill style={{ opacity: aOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: logoY,
              transform: `translate(-50%, -50%) scale(${logoIn})`,
              opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <Img src={LOGO} style={{ width: logoW, height: "auto" }} />
          </div>

          {frame >= TITLE_START && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 500,
                  transform: `translate(-50%, -50%) scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`,
                  opacity: titleOpacity,
                  fontSize: 132,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                VIBE GAME 教案
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 588,
                  transform: "translateX(-50%)",
                  width: ruleW,
                  height: 8,
                  borderRadius: 999,
                  background: YELLOW,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 660,
                  transform: "translateX(-50%)",
                  opacity: subOpacity,
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: 10,
                  color: SUBTLE,
                  whiteSpace: "nowrap",
                }}
              >
                第 2 集・遊戲設計
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S2：本次重點 ── */}
      {frame >= 228 && frame < 456 && (
        <AbsoluteFill style={{ opacity: bOpacity, justifyContent: "center", alignItems: "center" }}>
          <div
            style={{ fontSize: 64, fontWeight: 800, letterSpacing: 6, color: TEXT_DARK, marginBottom: 64 }}
          >
            本次重點
          </div>
          <div style={{ display: "flex", gap: 56 }}>
            {[
              { icon: "📄", title: "遊戲設計文件", tag: "跟 AI 討論並產出" },
              { icon: "🎬", title: "Storyboard", tag: "請 AI 協助產出" },
            ].map((c, i) => {
              const s = i === 0 ? card1 : card2;
              return (
                <div
                  key={c.title}
                  style={{
                    width: 520,
                    padding: "56px 40px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateY(${interpolate(s, [0, 1], [48, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                  }}
                >
                  <div style={{ fontSize: 92 }}>{c.icon}</div>
                  <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK, letterSpacing: 2 }}>
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: BLUE,
                      background: withAlpha(BLUE, 0.1),
                      padding: "10px 26px",
                      borderRadius: 999,
                      letterSpacing: 1,
                    }}
                  >
                    {c.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ── S3：知識導覽 ── */}
      {frame >= 448 && (
        <AbsoluteFill style={{ opacity: cOpacity, justifyContent: "center", alignItems: "center" }}>
          <div
            style={{ fontSize: 46, fontWeight: 600, letterSpacing: 4, color: SUBTLE, marginBottom: 56 }}
          >
            先認識幾個重要觀念
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            {TAGS.map((tag, i) => {
              const inSpring = spring({
                frame: frame - (TAG_FIRST + i * TAG_STEP),
                fps,
                config: { damping: 15, stiffness: 130 },
              });
              const isFirst = i === 0;
              const hi = isFirst ? hilite : 0; // 僅「限制設計」高亮
              return (
                <div
                  key={tag}
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    letterSpacing: 3,
                    color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
                    background: interpolateColors(hi, [0, 1], [CHIP_BG, BLUE]),
                    padding: "26px 48px",
                    borderRadius: 999,
                    opacity: inSpring,
                    transform: `translateY(${interpolate(inSpring, [0, 1], [40, 0])}px) scale(${1 + hi * 0.06})`,
                    boxShadow: hi > 0 ? `0 14px 32px ${withAlpha(BLUE, 0.22 * hi)}` : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 48,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 2,
              color: BLUE,
              opacity: hilite,
            }}
          >
            先從「限制設計」開始 →
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
