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
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  CARD_BORDER,
  withAlpha,
} from "../../theme/colors";

// 第 4 集・第 1 頁開場（連續動畫，四段；30fps，總長 1260 frames＝42 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 4 集・美術整合」
//   S02：AI 生圖的角色 — 先左右對比（不是取代／優化），對比淡出後建四節點流程
//   S03：延續同一張流程圖（縮小上移）＋回饋箭頭「修正規格」＋主句「提早讓問題出現」
//   S04：本次重點三卡（美術規格表／AI 生假素材／Unity 驗證規格）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ── 四段節奏 ──
// S01：0–210｜S02：210–720（對比 210–410、流程 410–720）｜S03：720–1020｜S04：1020–1260
const A_OUT = [188, 210] as const; // S01 淡出

// S01 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

// S02 Beat A：AI 生圖的角色＋左右對比
const S2_IN = [210, 232] as const; // S02 標題淡入
const TITLE_OUT = [700, 740] as const; // S02 標題在進入 S03 時淡出
const CONTRAST_IN = [232, 256] as const; // 對比卡淡入
const CONTRAST_OUT = [360, 410] as const; // 對比卡淡出後才建流程
const LEFT_CARD = 244; // 左卡 spring 起點
const RIGHT_CARD = 276; // 右卡 spring 起點

export const Ch4Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S01：開場標題 ──────────────────────────────
  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    ...clamp,
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
    clamp,
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );
  const subOpacity = interpolate(
    frame,
    [SUB_START, SUB_START + 18],
    [0, 1],
    clamp,
  );
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

  // ── S02 Beat A：AI 生圖的角色＋對比 ─────────────
  const s2TitleOpacity =
    interpolate(frame, S2_IN, [0, 1], clamp) *
    interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const contrastOpacity =
    interpolate(frame, CONTRAST_IN, [0, 1], clamp) *
    interpolate(frame, CONTRAST_OUT, [1, 0], clamp);
  const leftCard = spring({
    frame: frame - LEFT_CARD,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const rightCard = spring({
    frame: frame - RIGHT_CARD,
    fps,
    config: { damping: 15, stiffness: 120 },
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
                第 4 集・美術整合
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── */}
      {frame >= 205 && frame < 742 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 175,
              transform: "translateX(-50%)",
              opacity: s2TitleOpacity,
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            AI 生圖的角色
          </div>

          {frame < 412 && (
            <div
              style={{
                position: "absolute",
                left: 960,
                top: 560,
                transform: "translate(-50%, -50%)",
                opacity: contrastOpacity,
                display: "flex",
                gap: 56,
              }}
            >
              {[
                {
                  s: leftCard,
                  label: "AI 不是",
                  main: "取代美術人員",
                  accent: SUBTLE,
                  border: CARD_BORDER,
                  dir: -1,
                },
                {
                  s: rightCard,
                  label: "而是",
                  main: "優化美術工作",
                  accent: YELLOW,
                  border: withAlpha(YELLOW, 0.7),
                  dir: 1,
                },
              ].map((c) => (
                <div
                  key={c.main}
                  style={{
                    width: 560,
                    padding: "48px 40px",
                    background: WHITE,
                    border: `3px solid ${c.border}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: c.s,
                    transform: `translateX(${interpolate(c.s, [0, 1], [c.dir * 48, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: c.accent,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: c.accent === YELLOW ? YELLOW : TEXT_DARK,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.main}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat B / S03：四節點流程（連續，不重建）── (added in Task 3, extended in Task 4) */}

      {/* ── S03：主句「提早讓問題出現」── (added in Task 4) */}

      {/* ── S04：本次重點三卡 ── (added in Task 5) */}
    </AbsoluteFill>
  );
};
