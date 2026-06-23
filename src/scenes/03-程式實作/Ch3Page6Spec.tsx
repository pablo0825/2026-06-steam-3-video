import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Ch3Page6SpecDefinition } from "./Ch3Page6SpecDefinition";
import { Ch3Page6SpecStructure } from "./Ch3Page6SpecStructure";

export const Ch3Page6Spec: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={810}>
        <Ch3Page6SpecDefinition />
      </Sequence>
      <Sequence from={810} durationInFrames={1020}>
        <Ch3Page6SpecStructure />
      </Sequence>
    </AbsoluteFill>
  );
};
