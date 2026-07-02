import React from "react";
import {
  DefinitionCard,
  type DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 2 集・第 5 頁・S13：核心循環定義（316 幀，前 30 幀白底停留）
const SEGMENTS: DefinitionSegment[] = [
  { text: "玩家" },
  { text: "不斷重複的行為", highlight: true },
  { text: "，構成遊戲的主要體驗" },
];

export const Ch2Page5S13CoreLoop: React.FC = () => (
  <DefinitionCard title="核心循環" segments={SEGMENTS} openingHoldFrames={30} />
);
