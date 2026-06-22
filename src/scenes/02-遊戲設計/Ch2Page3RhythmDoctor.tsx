import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {GameplayPlaceholder} from "./GameplayPlaceholder";
import {Ch2Page3RhythmDoctorOverlay} from "./Ch2Page3RhythmDoctorOverlay";

// Studio 預覽版：以全螢幕暫代素材模擬剪輯軟體中的 gameplay 底層，
// 並疊上正式輸出的透明 Overlay。
export const Ch2Page3RhythmDoctor: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {frame < 489 && (
        <GameplayPlaceholder
          icon="🎵"
          title="Rhythm Doctor"
          subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
        />
      )}
      <Ch2Page3RhythmDoctorOverlay />
    </AbsoluteFill>
  );
};
