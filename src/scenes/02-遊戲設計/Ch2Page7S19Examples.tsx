import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BLACK, BLUE, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { STORYBOARD_SAMPLES } from "./Ch2Page7StoryboardShared";

const ENDING_FADE = [252, 275] as const;

const START = 8;
const SEG = 78;
const FADE = 18;

const VIEW_TOP = 56;
const VIEW_BOTTOM = 100;

export const Ch2Page7S19Examples: React.FC = () => {
  const frame = useCurrentFrame();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const panelIn = interpolate(frame, [0, 18], [0, 1], clamp);

  const slideOp = (i: number) => {
    const a = START + i * SEG;
    const fadeIn = interpolate(frame, [a, a + FADE], [0, 1], clamp);
    if (i === STORYBOARD_SAMPLES.length - 1) return fadeIn;

    const fadeOut = interpolate(
      frame,
      [a + SEG, a + SEG + FADE],
      [1, 0],
      clamp,
    );
    return fadeIn * fadeOut;
  };

  const activeIdx =
    frame < START + SEG ? 0 : frame < START + 2 * SEG ? 1 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: panelIn }} />

        {STORYBOARD_SAMPLES.map((sample, i) => (
          <div
            key={sample.src}
            style={{
              position: "absolute",
              top: VIEW_TOP,
              left: 0,
              right: 0,
              bottom: VIEW_BOTTOM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: slideOp(i),
            }}
          >
            <Img
              src={staticFile(sample.src)}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: sample.objectPosition,
              }}
            />
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 52,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            opacity: panelIn,
          }}
        >
          {STORYBOARD_SAMPLES.map((sample, i) => (
            <div
              key={sample.src}
              style={{
                width: i === activeIdx ? 34 : 14,
                height: 14,
                borderRadius: 999,
                background: i === activeIdx ? BLUE : withAlpha(WHITE, 0.32),
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 46,
            color: withAlpha(WHITE, 0.55),
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
            opacity: panelIn,
          }}
        >
          此影片僅用於教學實驗
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
