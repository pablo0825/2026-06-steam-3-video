import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  GREEN,
  NEUTRAL_50,
  NEUTRAL_200,
  NEUTRAL_400,
  SUBTLE,
  TEXT_DARK,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";
import { WindowFrame } from "../../components/WindowFrame";

// 第 1 集・第 3 頁・S09：不是完成遊戲，而是驗證問題（180 幀，S12 視窗＋判定排版）
//   視窗（標題列＋三色點＋「遊戲原型」）進場，內含靜態的簡易遊戲原型（地板／平台／
//   角色／終點旗杆）；下方判定 ✗「不是完成遊戲」先出，再 crossfade 成 ✓「而是驗證問題」。
const CONTENT_OUT = [160, 179] as const;

// 視窗畫面（canvas 700×440 局部座標）的靜態遊戲原型
const WIN_W = 700;
const TITLE_H = 60;
const CANVAS_H = 440;
const FLOOR_Y = 380;
const CHAR_W = 46;
const CHAR_H = 70;
const PLATFORMS = [
  { x: 170, y: 300, w: 120 },
  { x: 390, y: 222, w: 130 }, // 終點平台
] as const;

// 判定 crossfade
const FAIL_OUT = [100, 114] as const;
const PASS_IN = [120, 136] as const;

export const Ch1Page3S09ValidateQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const winEnter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const failEnter = spring({
    frame: frame - 44,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const failOut = interpolate(frame, FAIL_OUT, [1, 0], clamp);
  const passIn = interpolate(frame, PASS_IN, [0, 1], clamp);
  const passPop = spring({
    frame: frame - PASS_IN[0],
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const goal = PLATFORMS[1];

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 視窗（S12 風格） */}
        <WindowFrame
          title="遊戲原型"
          titleStyle={{ letterSpacing: 2 }}
          barHeight={TITLE_H}
          style={{
            position: "absolute",
            left: 960,
            top: 470,
            width: WIN_W,
            height: TITLE_H + CANVAS_H,
            transform: `translate(-50%, -50%) scale(${interpolate(winEnter, [0, 1], [0.88, 1])})`,
            opacity: winEnter,
          }}
        >
          {/* 遊戲畫面（靜態簡易原型） */}
          <div
            style={{
              position: "relative",
              width: WIN_W,
              height: CANVAS_H,
              background: NEUTRAL_50,
              overflow: "hidden",
            }}
          >
            {/* 地板 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: FLOOR_Y,
                width: WIN_W,
                height: CANVAS_H - FLOOR_Y,
                display: "flex",
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "100%",
                    background: NEUTRAL_200,
                    borderRight: `1px solid ${NEUTRAL_400}`,
                    borderTop: `3px solid ${NEUTRAL_400}`,
                  }}
                />
              ))}
            </div>

            {/* 平台 */}
            {PLATFORMS.map((p) => (
              <div
                key={p.x}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  width: p.w,
                  height: 20,
                  background: NEUTRAL_200,
                  borderTop: `4px solid ${NEUTRAL_400}`,
                  borderRadius: 8,
                }}
              />
            ))}

            {/* 終點旗杆（靜態展開） */}
            <div
              style={{
                position: "absolute",
                left: goal.x + goal.w - 20,
                top: goal.y - 78,
                width: 4,
                height: 78,
                background: SUBTLE,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: goal.x + goal.w - 16,
                top: goal.y - 76,
                width: 40,
                height: 26,
                background: GREEN,
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              }}
            />

            {/* 角色（站在地板上） */}
            <div
              style={{
                position: "absolute",
                left: 108 - CHAR_W / 2,
                top: FLOOR_Y - CHAR_H,
                width: CHAR_W,
                height: CHAR_H,
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    transform: "translateX(-50%)",
                    width: "54%",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: BLUE,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    transform: "translateX(-50%)",
                    width: "78%",
                    height: "62%",
                    borderRadius: "42% 42% 20% 20%",
                    background: BLUE,
                  }}
                />
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* 下方判定：✗ 不是完成遊戲 → ✓ 而是驗證問題（crossfade） */}
        <div style={{ position: "absolute", left: 960, top: 840 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateX(-50%) translateY(${interpolate(failEnter, [0, 1], [28, 0])}px)`,
              opacity: failEnter * failOut,
            }}
          >
            <VerdictBadge
              kind="fail"
              label="不是完成遊戲"
              size={60}
              labelSize={50}
              labelColor={TEXT_DARK}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateX(-50%) scale(${interpolate(passPop, [0, 1], [0.8, 1])})`,
              opacity: passIn,
            }}
          >
            <VerdictBadge
              kind="pass"
              label="提早驗證問題"
              size={60}
              labelSize={50}
              labelColor={TEXT_DARK}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
