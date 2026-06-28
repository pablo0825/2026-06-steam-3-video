import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD_BORDER,
  DIVIDER,
  DOT_RED,
  GREEN,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";

// 第 4 集・第 2 頁・S06：橫式 / 直式畫面大小（210 幀）
//   兩個視窗並排：橫式 1920×1080（短寬）與直式 1080×1920（高窄），對比橫／直方向。
//   橫式按真實比例；直式為示意畫面、略縮一點讓構圖更平衡（仍維持 9:16）。
//   視窗採 S08/S12 chrome（標題列三色點＋視窗名稱）；下方淡字輔助說明；中央虛線分隔。
const ENDING_FADE = [186, 210] as const;

// 橫式按比例縮放；直式略縮（示意，畫面更平衡）。
const SCALE = 0.4; // 橫式 1920×1080
const PORT_SCALE = 0.35; // 直式 1080×1920（略縮）
const LAND_W = 1920 * SCALE; // 768
const LAND_H = 1080 * SCALE; // 432
const PORT_W = 1080 * PORT_SCALE; // 378
const PORT_H = 1920 * PORT_SCALE; // 672
const BAR_H = 52;

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{ width: 12, height: 12, borderRadius: "50%", background: color }}
  />
);

// 一側：按比例的視窗（標題列＋空白畫布）＋ 下方輔助說明字
const Side: React.FC<{
  title: string;
  helper: string;
  contentW: number;
  contentH: number;
  enter: number; // spring 0→1（左右滑入）
  fromX: number;
  helperOp: number;
}> = ({ title, helper, contentW, contentH, enter, fromX, helperOp }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 26,
      opacity: enter,
      transform: `translateX(${interpolate(enter, [0, 1], [fromX, 0])}px)`,
    }}
  >
    <div
      style={{
        width: contentW,
        background: WHITE,
        border: `3px solid ${CARD_BORDER}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
      }}
    >
      {/* 標題列：三色點 + 視窗名稱 */}
      <div
        style={{
          height: BAR_H,
          background: WINDOW_BAR,
          borderBottom: `1px solid ${CARD_BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 18px",
        }}
      >
        <Dot color={DOT_RED} />
        <Dot color={YELLOW} />
        <Dot color={GREEN} />
        <span
          style={{
            marginLeft: 10,
            color: TEXT_DARK,
            fontSize: 27,
            fontWeight: 850,
            letterSpacing: 1,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
      </div>

      {/* 畫布（空白） */}
      <div style={{ width: contentW, height: contentH, background: WHITE }} />
    </div>

    {/* 輔助說明字 */}
    <div
      style={{
        color: SUBTLE,
        fontSize: 38,
        fontWeight: 800,
        letterSpacing: 2,
        opacity: helperOp,
      }}
    >
      {helper}
    </div>
  </div>
);

export const Ch4Page2S06SizeCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  // 虛線先出現（從中央往上下展開），視窗隨後滑入，輔助字最後淡入
  const dividerOp = interpolate(frame, [4, 22], [0, 1], ease);
  const dividerGrow = interpolate(frame, [4, 30], [0, 1], ease);
  const landEnter = spring({
    frame: frame - 22,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const portEnter = spring({
    frame: frame - 34,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const helperOpL = interpolate(frame, [70, 96], [0, 1], ease);
  const helperOpR = interpolate(frame, [84, 110], [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: out,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 96 }}>
          <Side
            title="1920×1080"
            helper="16:9 橫式"
            contentW={LAND_W}
            contentH={LAND_H}
            enter={landEnter}
            fromX={-90}
            helperOp={helperOpL}
          />

          {/* 中央虛線分隔 */}
          <div
            style={{
              width: 0,
              height: PORT_H,
              borderLeft: `2px dashed ${DIVIDER}`,
              opacity: dividerOp,
              transform: `scaleY(${dividerGrow})`,
            }}
          />

          <Side
            title="1080×1920"
            helper="9:16 直式"
            contentW={PORT_W}
            contentH={PORT_H}
            enter={portEnter}
            fromX={90}
            helperOp={helperOpR}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
