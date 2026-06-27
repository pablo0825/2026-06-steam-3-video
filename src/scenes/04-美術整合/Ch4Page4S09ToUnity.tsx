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
  CARD_BORDER,
  DASH_BORDER,
  DOT_RED,
  GREEN,
  NEUTRAL_50,
  NEUTRAL_100,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 4 集・第 4 頁・S09：把美術圖匯進 Unity（240 幀，結尾淡出到 NEUTRAL_50）
//   Unity 視窗進場 → 美術圖落入框內 → 拉高、拉寬後彈回正常 → 跳出「確認大小、比例是否正常」。
//   承接動機，銜接 S10 的 unit↔px。
const ENDING_FADE = [212, 240] as const;

const WIN_CX = 960; // 視窗中心 x
const WIN_CY = 470; // 視窗中心 y（無標題，整組垂直置中）
const REF = 210; // 正常比例參考框邊長
const ART = 182; // 美術圖基準邊長

// 圖片占位 glyph：外框 + 太陽 + 山形，與專案其他占位框同一套淡色語彙
const ArtGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect
      x={6}
      y={6}
      width={88}
      height={88}
      rx={12}
      fill={NEUTRAL_100}
      stroke={CARD_BORDER}
      strokeWidth={3}
    />
    <circle cx={34} cy={34} r={11} fill={YELLOW} />
    <path d="M14 84 L42 50 L60 72 L74 58 L86 84 Z" fill={withAlpha(BLUE, 0.55)} />
  </svg>
);

export const Ch4Page4S09ToUnity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  // 美術圖由上方落入視窗
  const artDrop = spring({
    frame: frame - 50,
    fps,
    config: { damping: 17, stiffness: 120 },
  });
  const dropY = interpolate(artDrop, [0, 1], [-190, 0]);
  const artOpacity = interpolate(frame, [50, 66], [0, 1], clamp);

  // 變形序列：拉高 → 拉寬 → 復原（超出虛線參考框 = 比例不對，貼合 = 正常）
  const scaleY = interpolate(frame, [92, 116, 142], [1, 1.6, 1], easeStandard);
  const scaleX = interpolate(frame, [116, 142, 168], [1, 1.55, 1], easeStandard);

  const verify = spring({
    frame: frame - 172,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* Unity 視窗 */}
        <div
          style={{
            position: "absolute",
            left: WIN_CX,
            top: WIN_CY,
            width: 700,
            height: 500,
            transform: `translate(-50%, -50%) scale(${interpolate(winEnter, [0, 1], [0.88, 1])})`,
            opacity: winEnter,
            borderRadius: 22,
            overflow: "hidden",
            background: WHITE,
            border: `3px solid ${CARD_BORDER}`,
            boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
          }}
        >
          <div
            style={{
              height: 60,
              background: WINDOW_BAR,
              borderBottom: `1px solid ${CARD_BORDER}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 22px",
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: DOT_RED,
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: YELLOW,
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: GREEN,
              }}
            />
            <span
              style={{
                marginLeft: 12,
                color: SUBTLE,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              Unity
            </span>
          </div>

          {/* 場景區：虛線參考框 + 落入並變形的美術圖 */}
          <div
            style={{
              position: "relative",
              height: 440,
              background: NEUTRAL_50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: REF,
                height: REF,
                borderRadius: 14,
                border: `2px dashed ${DASH_BORDER}`,
              }}
            />
            <div
              style={{
                opacity: artOpacity,
                transform: `translateY(${dropY}px) scaleX(${scaleX}) scaleY(${scaleY})`,
              }}
            >
              <ArtGlyph size={ART} />
            </div>
          </div>
        </div>

        {/* 重點句：確認大小、比例是否正常（VerdictBadge） */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 840,
            transform: `translateX(-50%) translateY(${interpolate(verify, [0, 1], [28, 0])}px) scale(${interpolate(verify, [0, 1], [0.9, 1])})`,
            opacity: verify,
          }}
        >
          <VerdictBadge
            kind="pass"
            label="確認大小、比例是否正常"
            size={64}
            labelSize={58}
            labelColor={TEXT_DARK}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
