import React from "react";
import { TEXT_DARK, WHITE, withAlpha } from "../theme/colors";

// 畫面角落的深色小膠囊標籤：用於尺寸標示與素材來源／用途註記。
type CornerLabelProps = {
  text: string;
  opacity: number;
  placement?: "top-left" | "bottom"; // 預設左上
};

export const CornerLabel: React.FC<CornerLabelProps> = ({
  text,
  opacity,
  placement = "top-left",
}) => {
  const placementStyle: React.CSSProperties =
    placement === "bottom"
      ? { left: "50%", bottom: 40, transform: "translateX(-50%)" }
      : { left: 32, top: 32 };
  return (
    <div
      style={{
        position: "absolute",
        ...placementStyle,
        opacity,
        padding: "10px 22px",
        borderRadius: 999,
        background: withAlpha(TEXT_DARK, 0.58),
        color: WHITE,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 1,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
