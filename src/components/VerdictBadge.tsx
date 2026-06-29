import React from "react";
import { GREEN, RED, WHITE, withAlpha } from "../theme/colors";

// 統一的 ✓/✗ 判定徽章：綠/紅圓形徽章 + 白色記號，可選文字標籤。
//   只負責呈現；定位與進場動畫交給呼叫端的外層容器。
export const VerdictBadge: React.FC<{
  kind: "pass" | "fail"; // pass→綠✓、fail→紅✗
  label?: string; // 省略則只有圓徽章
  size?: number; // 圓徑，預設 58
  labelSize?: number; // 文字字級，預設 50
  labelColor?: string; // 文字色，預設 = 徽章色
  shadow?: boolean; // 是否加陰影
}> = ({
  kind,
  label,
  size = 58,
  labelSize = 50,
  labelColor,
  shadow = false,
}) => {
  const color = kind === "pass" ? GREEN : RED;
  const mark = kind === "pass" ? "✓" : "×";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 20,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          color: WHITE,
          fontSize: size * 0.6,
          fontWeight: 900,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: shadow
            ? `0 14px 30px ${withAlpha(color, 0.32)}`
            : undefined,
        }}
      >
        {mark}
      </div>
      {label !== undefined && (
        <div
          style={{
            fontSize: labelSize,
            fontWeight: 800,
            color: labelColor ?? color,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
