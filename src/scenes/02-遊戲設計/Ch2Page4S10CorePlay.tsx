import React from "react";
import {
  DefinitionCard,
  type DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 2 集・第 4 頁・S10：核心玩法定義（250 幀，前 30 幀白底停留）
const SEGMENTS: DefinitionSegment[] = [
  { text: "玩家在遊戲中" },
  { text: "最常重複的動作", highlight: true },
];

export const Ch2Page4S10CorePlay: React.FC = () => (
  <DefinitionCard title="核心玩法" segments={SEGMENTS} openingHoldFrames={30} />
);
