import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, NEUTRAL_50, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 4 頁・S11-01：PPU 鋪陳（168 幀，米白底）
//   進場留白一拍 → 「1 unit」彈入停留後淡出 → 「px」彈入停留後淡出 → 收於米白。
//   沿用 S10 色語彙（unit 藍／px 黃），一次只出現一個，為 S11-02 的 PPU 定義鋪路。
const UNIT_IN = 12;
const UNIT_OUT = 60;
const PX_IN = 92;
const PX_OUT = 140;
const LEAVE = 16; // 淡出花幾幀

// 置中大字：spring 淡入＋上移進場，到 outFrame 後淡出＋輕微上移離場。
const BigWord: React.FC<{
  text: string;
  color: string;
  inFrame: number;
  outFrame: number;
  frame: number;
  fps: number;
}> = ({ text, color, inFrame, outFrame, frame, fps }) => {
  const enter = spring({
    frame: frame - inFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const leave = interpolate(frame, [outFrame, outFrame + LEAVE], [0, 1], clamp);
  const y =
    interpolate(enter, [0, 1], [34, 0]) + interpolate(leave, [0, 1], [0, -28]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter * (1 - leave),
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          color,
          fontSize: 180,
          fontWeight: 950,
          letterSpacing: 1,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Ch4Page4S11PPU01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <BigWord
        text="1 unit"
        color={BLUE}
        inFrame={UNIT_IN}
        outFrame={UNIT_OUT}
        frame={frame}
        fps={fps}
      />
      <BigWord
        text="px"
        color={YELLOW}
        inFrame={PX_IN}
        outFrame={PX_OUT}
        frame={frame}
        fps={fps}
      />
    </AbsoluteFill>
  );
};
