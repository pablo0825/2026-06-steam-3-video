import React from "react";
import { AbsoluteFill } from "remotion";
import { Ch3Page7CelesteSpecOverlay } from "./Ch3Page7CelesteSpecOverlay";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";

// Studio 預覽版：全螢幕暫代素材模擬 DaVinci 中的 Celeste gameplay，疊上透明 Overlay
export const Ch3Page7CelesteSpec: React.FC = () => {
  return (
    <AbsoluteFill>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page7CelesteSpecOverlay />
    </AbsoluteFill>
  );
};
