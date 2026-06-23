import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Ch3Page5AgentsDefinition } from "./Ch3Page5AgentsDefinition";
import { Ch3Page5AgentsFlow } from "./Ch3Page5AgentsFlow";

export const Ch3Page5Agents: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150}>
        <Ch3Page5AgentsDefinition />
      </Sequence>
      <Sequence from={150} durationInFrames={360}>
        <Ch3Page5AgentsFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
