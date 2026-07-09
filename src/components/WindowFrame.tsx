import React from "react";
import {
  CARD_BORDER,
  DOT_RED,
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../theme/colors";

// 視窗外框：標題列（紅／黃／綠三色點＋視窗名稱）＋ 下方內容區。
//   進場動畫刻意不放進元件：各場景的 spring 時序不同，
//   opacity／transform 一律由外面經 style 傳入。
const DOT_SIZE = 13;
const BAR_H = 60;

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: "50%",
      background: color,
    }}
  />
);

export const WindowFrame: React.FC<{
  /** 視窗名稱；傳 ReactNode 可做標題交叉淡入（會繼承標題的字型設定）。 */
  title?: React.ReactNode;
  /** 覆寫標題文字樣式：字級、字距、opacity 等。 */
  titleStyle?: React.CSSProperties;
  /** 標題列高度，預設 60。 */
  barHeight?: number;
  /** 外框樣式：定位、尺寸，以及進場的 opacity／transform。 */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ title, titleStyle, barHeight = BAR_H, style, children }) => (
  <div
    style={{
      background: WHITE,
      border: `3px solid ${CARD_BORDER}`,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
      ...style,
    }}
  >
    <div
      style={{
        height: barHeight,
        background: WINDOW_BAR,
        borderBottom: `1px solid ${CARD_BORDER}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 22px",
      }}
    >
      <Dot color={DOT_RED} />
      <Dot color={YELLOW} />
      <Dot color={GREEN} />
      {title !== undefined && (
        <div
          style={{
            marginLeft: 12,
            color: SUBTLE,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
            ...titleStyle,
          }}
        >
          {title}
        </div>
      )}
    </div>
    {children}
  </div>
);
