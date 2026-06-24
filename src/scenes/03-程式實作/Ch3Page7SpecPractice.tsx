import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WHITE } from "../../theme/colors";
import { Ch3Page7SpecPerFeature } from "./Ch3Page7SpecPerFeature";
import { Ch3Page7SpecWorkflow } from "./Ch3Page7SpecWorkflow";

// 第 3 集・第 7 頁 S18：白底全螢幕
//   前半（0–330）一個功能，一份 Spec；後半（330–720）Spec 實作流程圖
export const Ch3Page7SpecPractice: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: WHITE }}>
      <Sequence durationInFrames={330} from={2}>
        <Ch3Page7SpecPerFeature />
      </Sequence>
      <Sequence from={330} durationInFrames={390}>
        <Ch3Page7SpecWorkflow />
      </Sequence>
    </AbsoluteFill>
  );
};
