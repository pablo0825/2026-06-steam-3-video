import React from "react";
import { interpolateColors } from "remotion";
import { SUBTLE, TEXT_DARK, YELLOW, withAlpha } from "../theme/colors";

// 定義句的淡黃襯底高亮詞
//   show: 0→1 控制襯底淡入、文字由 fromColor 漸變到 TEXT_DARK。
//   fromColor 預設 SUBTLE；傳 TEXT_DARK 可讓未高亮時與內文同色（只刷襯底）。
export const HighlightWord: React.FC<{
  children: React.ReactNode;
  show: number;
  fromColor?: string;
}> = ({ children, show, fromColor = SUBTLE }) => {
  const textColor = interpolateColors(show, [0, 1], [fromColor, TEXT_DARK]);
  return (
    <span
      style={{
        padding: "2px 10px",
        margin: "0 4px",
        display: "inline-block",
        lineHeight: 1.12,
        verticalAlign: "baseline",
        borderRadius: 8,
        backgroundColor: withAlpha(YELLOW, 0.3 * show),
        color: textColor,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};
