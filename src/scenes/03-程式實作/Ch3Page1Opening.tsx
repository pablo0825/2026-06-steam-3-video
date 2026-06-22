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
import {
  BLUE,
  CHIP_BG,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 1 頁開場（連續動畫，三段；30fps，總長 780 frames＝26 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 3 集・程式實作」
//   S02：本次重點兩張卡片（根據 Storyboard 寫 User Story／基於 Spec 與 AI 協作開發遊戲）
//   S03：知識導覽四標籤（User Story／Context／AGENTS.md／Spec），「User Story」高亮帶入下一頁

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

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
            <Img src={LOGO} style={{ width: logoW, height: "auto" }} from={-102} />
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

      {/* ── S02：本次重點 ── (added in Task 2) */}

      {/* ── S03：知識導覽 ── (added in Task 3) */}
    </AbsoluteFill>
  );
};
