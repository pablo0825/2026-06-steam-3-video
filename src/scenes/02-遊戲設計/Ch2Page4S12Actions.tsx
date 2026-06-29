import React from "react";
import { AbsoluteFill } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT } from "../../theme/motion";
import { GameplayPlaceholder } from "./GameplayPlaceholder";
import { Ch2Page4S12ActionsOverlay } from "./Ch2Page4S12ActionsOverlay";

// 第 2 集・第 4 頁・S12：Celeste 核心動作預覽版（208 幀）
export const Ch2Page4S12Actions: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch2Page4S12ActionsOverlay />
    </AbsoluteFill>
  );
};
