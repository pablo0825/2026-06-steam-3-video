import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 5 頁・S15-01：打怪遊戲核心循環（問題引導，120 幀）
//   置中大字淡入（微上移）→ 停留 → 結尾淡出（最後一格前完成）。
const IN = [6, 34] as const;
const OUT = [92, 116] as const;

export const Ch2Page5S15MonsterLoop01: React.FC = () => {
  const frame = useCurrentFrame();
  const inProg = interpolate(frame, IN, [0, 1], easeStandard);
  const out = interpolate(frame, OUT, [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEUTRAL_50,
        fontFamily: FONT,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(inProg, [0, 1], [20, 0])}px)`,
          opacity: inProg * out,
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: 4,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        打怪遊戲的核心循環？
      </div>
    </AbsoluteFill>
  );
};
