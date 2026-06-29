import React from "react";
import { AbsoluteFill } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT } from "../../theme/motion";
import { GameplayPlaceholder } from "./GameplayPlaceholder";
import { Ch2Page4S11CelesteOverlay } from "./Ch2Page4S11CelesteOverlay";

// 第 2 集・第 4 頁・S11：Celeste 影片預覽版（272 幀）
export const Ch2Page4S11Celeste: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch2Page4S11CelesteOverlay />
    </AbsoluteFill>
  );
};
