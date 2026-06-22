import React from "react";
import {AbsoluteFill} from "remotion";
import {Ch2Page4CorePlayOverlay} from "./Ch2Page4CorePlayOverlay";
import {GameplayPlaceholder} from "./GameplayPlaceholder";

// Studio 預覽版：以全螢幕暫代素材模擬 DaVinci Resolve 中的 Celeste
// gameplay 底層，並疊上正式輸出的透明 Overlay。
export const Ch2Page4CorePlay: React.FC = () => {
  return (
    <AbsoluteFill>
      <GameplayPlaceholder
        icon="🏔️"
        title="Celeste"
        subtitle="剪輯軟體中的全螢幕 Gameplay 素材"
      />
      <Ch2Page4CorePlayOverlay />
    </AbsoluteFill>
  );
};
