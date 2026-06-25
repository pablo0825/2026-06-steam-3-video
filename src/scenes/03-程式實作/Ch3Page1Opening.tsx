import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { KnowledgeNav } from "../../components/KnowledgeNav";

// 第 3 集・第 1 頁開場（連續動畫，三段；30fps，總長 780 frames＝26 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 3 集・程式實作」
//   S02：本次重點兩張卡片（根據 Storyboard 寫 User Story／基於 Spec 與 AI 協作開發遊戲）
//   S03：知識導覽四標籤（User Story／Context／AGENTS.md／Spec），「User Story」高亮帶入下一頁

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

// S03 四個知識標籤逐一彈入、僅「User Story」高亮帶入下一頁
const TAGS = ["User Story", "Context", "AGENTS.md", "Spec"] as const;
const TAG_STEP = 24; // 每個標籤間隔
const TAG_FIRST = 488;
const HILITE = [660, 692] as const; // 「User Story」高亮

// S02 兩張重點卡：parts 內 hl=true 的片段以黃色強調（僅 User Story／Spec／AI）
type LinePart = { text: string; hl: boolean };

const FOCUS_CARDS: { icon: string; parts: LinePart[] }[] = [
  {
    icon: "📝",
    parts: [
      { text: "根據 Storyboard 撰寫 ", hl: false },
      { text: "User Story", hl: true },
    ],
  },
  {
    icon: "🤖",
    parts: [
      { text: "基於 ", hl: false },
      { text: "Spec", hl: true },
      { text: " 與 ", hl: false },
      { text: "AI", hl: true },
      { text: " 協作開發遊戲", hl: false },
    ],
  },
];

const HiliteLine: React.FC<{ parts: LinePart[] }> = ({ parts }) => (
  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: 1,
      lineHeight: 1.4,
      color: TEXT_DARK,
    }}
  >
    {parts.map((p, i) => (
      <span key={i} style={{ color: p.hl ? YELLOW : TEXT_DARK }}>
        {p.text}
      </span>
    ))}
  </div>
);

// ── 三段節奏（S01：0–210｜S02：210–450｜S03：450–780）──
const A_OUT = [188, 210] as const; // S01 淡出
const B_IN = [210, 230] as const; // S02 淡入
const B_OUT = [428, 450] as const; // S02 淡出
const C_IN = [450, 470] as const; // S03 淡入

// S01 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

export const Ch3Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S01：開場標題 ──────────────────────────────
  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [560, 220]);
  const logoY = interpolate(t2, [0, 1], [460, 150]);

  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const subOpacity = interpolate(frame, [SUB_START, SUB_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aOpacity = interpolate(frame, A_OUT, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── S02：本次重點 ──────────────────────────────
  const bOpacity =
    interpolate(frame, B_IN, [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, B_OUT, [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const card1 = spring({
    frame: frame - 238,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const card2 = spring({
    frame: frame - 270,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // ── S03：知識導覽 ──────────────────────────────
  const cOpacity = interpolate(frame, C_IN, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S01：開場標題 ── */}
      {frame < 215 && (
        <AbsoluteFill style={{ opacity: aOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: logoY,
              transform: `translate(-50%, -50%) scale(${logoIn})`,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
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
                第 3 集・程式實作
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02：本次重點 ── */}
      {frame >= 208 && frame < 455 && (
        <AbsoluteFill
          style={{
            opacity: bOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 6,
              color: TEXT_DARK,
              marginBottom: 64,
            }}
          >
            本次重點
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {FOCUS_CARDS.map((c, i) => {
              const s = i === 0 ? card1 : card2;
              return (
                <div
                  key={c.icon}
                  style={{
                    width: 1080,
                    padding: "40px 56px",
                    background: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: s,
                    transform: `translateX(${interpolate(s, [0, 1], [-56, 0])}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 36,
                  }}
                >
                  <div style={{ fontSize: 72 }}>{c.icon}</div>
                  <HiliteLine parts={c.parts} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ── S03：知識導覽 ── */}
      {frame >= 448 && (
        <AbsoluteFill
          style={{
            opacity: cOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <KnowledgeNav
            prompt="先認識幾個重要觀念"
            tags={TAGS}
            hintText="先從「User Story」開始 →"
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
