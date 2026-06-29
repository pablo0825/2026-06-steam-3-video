import React from "react";
import { AbsoluteFill } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT } from "../../theme/motion";
import { GameplayPlaceholder } from "./GameplayPlaceholder";
import { Ch2Page3S07RhythmDoctorOverlay } from "./Ch2Page3S07RhythmDoctorOverlay";

// 第 2 集・第 3 頁・S07：節奏醫生案例影片預覽版（150 幀）
export const Ch2Page3S07RhythmDoctor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <GameplayPlaceholder
        icon="🎵"
        title="Rhythm Doctor"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch2Page3S07RhythmDoctorOverlay />
    </AbsoluteFill>
  );
};
