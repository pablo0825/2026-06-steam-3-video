import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WHITE } from "../../theme/colors";
import { Ch3Page6SpecDefinition } from "./Ch3Page6SpecDefinition";
import { Ch3Page6SpecStructure } from "./Ch3Page6SpecStructure";
import { Ch3Page6SpecWorkflow } from "./Ch3Page6SpecWorkflow";

export const Ch3Page6Spec: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: WHITE }}>
      <Sequence durationInFrames={150}>
        <Ch3Page6SpecDefinition />
      </Sequence>
      <Sequence from={150} durationInFrames={660}>
        <Ch3Page6SpecWorkflow />
      </Sequence>
      <Sequence from={810} durationInFrames={1020}>
        <Ch3Page6SpecStructure />
      </Sequence>
    </AbsoluteFill>
  );
};
