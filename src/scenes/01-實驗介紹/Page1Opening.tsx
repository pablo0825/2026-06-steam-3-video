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
import { CHIP_BG, SUBTLE, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 1 頁開場（連續動畫）
//   S1：知點 logo 進場 → 主講 chip 上滑（旁白：嗨，大家好～我是知點的育嘉）
//   S2：logo 縮到上方 → 主標「VIBE GAME 教案」浮現 → 副標逐字浮現

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png");

const TRANS = 120; // S1 → S2 轉場起點
const TITLE_START = 150;
const SUB_START = 176;

const SUBTITLE = "用 AI 開發遊戲原型";

export const Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // logo 進場 spring（只在開頭作用）
  const logoIn = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  // 轉場：logo 從「置中放大」移到「上方縮小」
  const t2 = interpolate(frame, [TRANS, TRANS + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [620, 260]);
  const logoY = interpolate(t2, [0, 1], [460, 175]);

  // 主講 chip
  const chipIn = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 120 } });
  const chipFade = interpolate(frame, [TRANS, TRANS + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 主標
  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(frame, [TITLE_START, TITLE_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 標題下方黃色底線（wipe 進場）
  const ruleW = interpolate(frame, [TITLE_START + 10, TITLE_START + 34], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 知點 logo */}
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

      {/* 主講 chip（僅 S1） */}
      {chipFade > 0 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 720,
            transform: `translate(-50%, ${interpolate(chipIn, [0, 1], [40, 0])}px)`,
            opacity: chipIn * chipFade,
            background: CHIP_BG,
            color: TEXT_DARK,
            fontSize: 40,
            fontWeight: 600,
            padding: "16px 40px",
            borderRadius: 999,
            letterSpacing: 2,
          }}
        >
          主講人：育嘉
        </div>
      )}

      {/* 主標（S2） */}
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

          {/* 黃色底線 */}
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

          {/* 副標：逐字浮現 */}
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 660,
              transform: "translateX(-50%)",
              display: "flex",
              fontSize: 52,
              fontWeight: 500,
              color: SUBTLE,
              letterSpacing: 4,
              whiteSpace: "nowrap",
            }}
          >
            {SUBTITLE.split("").map((ch, i) => {
              const start = SUB_START + i * 3;
              const op = interpolate(frame, [start, start + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const dy = interpolate(op, [0, 1], [10, 0]);
              return (
                <span
                  key={i}
                  style={{
                    opacity: op,
                    transform: `translateY(${dy}px)`,
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
