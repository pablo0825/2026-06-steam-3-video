import React from "react";
import {
  DefinitionCard,
  type DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 2 集・第 7 頁・S18：Storyboard 定義（270 幀，前 30 幀白底停留）
const SEGMENTS: DefinitionSegment[] = [
  { text: "用" },
  { text: "連續畫面", highlight: true },
  { text: "呈現玩家在遊戲中經歷的工具" },
];

export const Ch2Page7S18StoryboardIntro: React.FC = () => (
  <DefinitionCard
    title="Storyboard"
    segments={SEGMENTS}
    defMaxWidth={1500}
    openingHoldFrames={30}
  />
);
