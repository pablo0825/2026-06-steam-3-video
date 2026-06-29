import React from "react";
import { AbsoluteFill } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT } from "../../theme/motion";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";
import { Ch3Page7S16CelesteSpecOverlay } from "./Ch3Page7S16CelesteSpecOverlay";

// 第 3 集・第 7 頁・S16：Celeste 影片預覽版（240 幀）
export const Ch3Page7S16CelesteSpec: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page7S16CelesteSpecOverlay />
    </AbsoluteFill>
  );
};
