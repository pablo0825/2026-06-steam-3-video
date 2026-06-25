import React from "react";
import { DefinitionCard } from "../../components/DefinitionCard";

// 第 4 集・第 6 頁・S14：認識 Sprite Sheet ── 極簡定義卡（duration 240）
export const Ch4Page6S14Definition: React.FC = () => (
  <DefinitionCard
    title="Sprite Sheet"
    segments={[
      { text: "Sprite Sheet 是把" },
      { text: "多張 Sprite", highlight: true },
      { text: "放在" },
      { text: "同一張圖片", highlight: true },
      { text: "中的素材格式" },
    ]}
  />
);
