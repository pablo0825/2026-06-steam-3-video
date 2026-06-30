import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { SUBTLE, TEXT_DARK, YELLOW, withAlpha } from "../theme/colors";
import { clamp } from "../theme/motion";

// 定義句的淡黃襯底高亮詞
//   show: 0→1 控制襯底淡入、文字由 fromColor 漸變到 TEXT_DARK，並用 webkit
//   text-stroke 連續加粗（避免固定字重字型在 800 門檻瞬間跳變）。
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
        borderRadius: 8,
        backgroundColor: withAlpha(YELLOW, 0.3 * show),
        color: textColor,
        fontWeight: 600,
        WebkitTextStrokeColor: textColor,
        WebkitTextStrokeWidth: interpolate(show, [0, 1], [0, 0.5], clamp),
      }}
    >
      {children}
    </span>
  );
};
