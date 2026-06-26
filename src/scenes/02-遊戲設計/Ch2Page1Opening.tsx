import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CARD_BORDER, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
import { KnowledgeNav } from "../../components/KnowledgeNav";
import { OpeningTitle } from "../../components/OpeningTitle";

// 第 2 集・第 1 頁開場（連續動畫，三段）
//   S1：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「遊戲設計」
//   S2：本次重點兩張卡片（遊戲設計文件／Storyboard，皆「請 AI 協助產出」）
//   S3：知識導覽三標籤（限制設計／核心玩法／核心循環），「限制設計」高亮帶入下一頁

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

// ── 三段節奏（30fps；總長 720 frames＝24 秒）──
// S1：0–230｜S2：230–450｜S3：450–720
const A_OUT = [210, 235] as const; // S1 淡出
const B_IN = [232, 252] as const; // S2 淡入
const B_OUT = [430, 450] as const; // S2 淡出
const C_IN = [452, 472] as const; // S3 淡入

// S3 三標籤逐一彈入、限制設計高亮
const TAGS = ["限制設計", "核心玩法", "核心循環"] as const;
const TAG_STEP = 24; // 每個標籤間隔
const TAG_FIRST = 488;
const HILITE = [636, 668] as const; // 「限制設計」高亮

export const Ch2Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S1：開場標題（共用 OpeningTitle，僅保留段落淡出）──
  const aOpacity = interpolate(frame, A_OUT, [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── S2：本次重點 ──────────────────────────────
  const bOpacity =
    interpolate(frame, B_IN, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, B_OUT, [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const card1 = spring({ frame: frame - 258, fps, config: { damping: 15, stiffness: 120 } });
  const card2 = spring({ frame: frame - 284, fps, config: { damping: 15, stiffness: 120 } });

  // ── S3：知識導覽 ──────────────────────────────
  const cOpacity = interpolate(frame, C_IN, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S1：開場標題 ── */}
      {frame < 240 && (
        <AbsoluteFill style={{ opacity: aOpacity }}>
          <OpeningTitle subtitle="第 2 集・遊戲設計" />
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
          <KnowledgeNav
            prompt="先認識幾個重要觀念"
            tags={TAGS}
            hintText="先從「限制設計」開始 →"
            frame={frame}
            fps={fps}
            tagFirst={TAG_FIRST}
            tagStep={TAG_STEP}
            highlight={HILITE}
            hint={HILITE}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
