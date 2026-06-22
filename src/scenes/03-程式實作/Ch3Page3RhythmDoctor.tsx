import React from "react";
import { AbsoluteFill } from "remotion";
import { Ch3Page3RhythmDoctorOverlay } from "./Ch3Page3RhythmDoctorOverlay";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";

// Studio 預覽版：全螢幕暫代素材模擬 DaVinci 中的節奏醫生 gameplay，疊上透明 Overlay
export const Ch3Page3RhythmDoctor: React.FC = () => {
  return (
    <AbsoluteFill>
      <GameplayPlaceholder
        icon="🎵"
        title="節奏醫生"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page3RhythmDoctorOverlay />
    </AbsoluteFill>
  );
};
