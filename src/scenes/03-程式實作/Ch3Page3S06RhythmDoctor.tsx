import React from "react";
import { AbsoluteFill } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT } from "../../theme/motion";
import { GameplayPlaceholder } from "../02-遊戲設計/GameplayPlaceholder";
import { Ch3Page3S06RhythmDoctorOverlay } from "./Ch3Page3S06RhythmDoctorOverlay";

// 第 3 集・第 3 頁・S06：Rhythm Doctor 影片預覽版（240 幀）
export const Ch3Page3S06RhythmDoctor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <GameplayPlaceholder
        icon="🎵"
        title="節奏醫生"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch3Page3S06RhythmDoctorOverlay />
    </AbsoluteFill>
  );
};
