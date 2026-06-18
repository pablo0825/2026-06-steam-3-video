import "./index.css";
import { Composition } from "remotion";
import { Page1Opening } from "./scenes/Page1Opening";
import { Page2AIToPrototype } from "./scenes/Page2AIToPrototype";
import { Page3Prototype } from "./scenes/Page3Prototype";
import { Page4PrototypeVideo } from "./scenes/Page4PrototypeVideo";
import { Page5PrototypeGoal } from "./scenes/Page5PrototypeGoal";
import { Page6Flow } from "./scenes/Page6Flow";
import { Page7Codex } from "./scenes/Page7Codex";
import { Page8Compare } from "./scenes/Page8Compare";
import { Page9Placeholder } from "./scenes/Page9Placeholder";
import { Page10Ending } from "./scenes/Page10Ending";
import { FullVideo } from "./FullVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={4720}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page1-Opening"
        component={Page1Opening}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page2-AI"
        component={Page2AIToPrototype}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page3-Prototype"
        component={Page3Prototype}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page4-PrototypeVideo"
        component={Page4PrototypeVideo}
        durationInFrames={580}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page5-Goal"
        component={Page5PrototypeGoal}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page6-Flow"
        component={Page6Flow}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page7-Codex"
        component={Page7Codex}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page8-Compare"
        component={Page8Compare}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page9-Placeholder"
        component={Page9Placeholder}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page10-Ending"
        component={Page10Ending}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
