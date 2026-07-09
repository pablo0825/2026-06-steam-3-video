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
  BORDER_SOFT,
  DASH_BORDER,
  NEUTRAL_50,
  NEUTRAL_200,
  NEUTRAL_400,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { WindowFrame } from "../../components/WindowFrame";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";

// 第 4 集・第 2 頁・S08：為什麼要知道畫面大小（270 幀）
//   米白底；中央 1920×1080 視窗畫入 → 角色／地板磚／UI 三個示意物件依序彈入，
//   各自外加虛線量測框與尺寸標籤（128×192／128×128／256×80），
//   視覺化「用畫面大小推估物件大小」。結尾淡出回米白，銜接 sX 實機示範。
//   旁白負責問句與「實際操作給大家看」的引導，畫面只專注示意，不放文字標題。
const ENDING_FADE = [240, 270] as const;

// 視窗顯示尺寸 = 1920×1080 等比縮小 2/3；物件依同比例縮放，維持相對大小誠實。
const SCALE = 2 / 3;
const WIN_W = 1920 * SCALE; // 1280
const WIN_H = 1080 * SCALE; // 720

// x/y/w/h：物件在 1920×1080 遊戲座標中的位置與大小（顯示時 × SCALE）。
// mx/my/mw/mh：虛線量測框框住的範圍（地板只框一格磚，其餘等於物件本身）。
type Obj = {
  key: string;
  kind: "char" | "floor" | "platform" | "ui";
  dim: string;
  x: number;
  y: number;
  w: number;
  h: number;
  mx: number;
  my: number;
  mw: number;
  mh: number;
  appear: number; // 物件彈入幀
  labelSide: "top" | "right" | "bottom";
};

const OBJECTS: readonly Obj[] = [
  {
    key: "char",
    kind: "char",
    dim: "128×192",
    x: 300,
    y: 760,
    w: 128,
    h: 192,
    mx: 300,
    my: 760,
    mw: 128,
    mh: 192,
    appear: 46,
    labelSide: "top",
  },
  {
    key: "floor",
    kind: "floor",
    dim: "128×128",
    x: 0,
    y: 952,
    w: 1920,
    h: 128,
    mx: 896,
    my: 952,
    mw: 128,
    mh: 128,
    appear: 76,
    labelSide: "top",
  },
  {
    key: "platform",
    kind: "platform",
    dim: "320×64",
    x: 720,
    y: 600,
    w: 320,
    h: 64,
    mx: 720,
    my: 600,
    mw: 320,
    mh: 64,
    appear: 106,
    labelSide: "top",
  },
  {
    key: "ui",
    kind: "ui",
    dim: "256×80",
    x: 1600,
    y: 48,
    w: 256,
    h: 80,
    mx: 1600,
    my: 48,
    mw: 256,
    mh: 80,
    appear: 136,
    labelSide: "bottom",
  },
];

// 物件示意圖形（純色塊／簡圖，圖解感，非真實素材）
const ObjectGlyph: React.FC<{ kind: Obj["kind"] }> = ({ kind }) => {
  if (kind === "char") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            width: "46%",
            aspectRatio: "1",
            borderRadius: "50%",
            background: SUBTLE,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            width: "72%",
            height: "64%",
            borderRadius: "40% 40% 18% 18%",
            background: SUBTLE,
          }}
        />
      </div>
    );
  }
  if (kind === "floor") {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {Array.from({ length: 15 }).map((_, i) => (
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
    );
  }
  if (kind === "platform") {
    // 漂浮平台：圓角橫塊，頂面高光邊
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: NEUTRAL_200,
          borderTop: `4px solid ${NEUTRAL_400}`,
          borderRadius: 8,
        }}
      />
    );
  }
  // ui：膠囊（圓鈕 + 進度條）示意 HUD
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        background: withAlpha(BLUE, 0.14),
        border: `2px solid ${withAlpha(BLUE, 0.5)}`,
        display: "flex",
        alignItems: "center",
        padding: "0 12%",
        gap: "8%",
      }}
    >
      <div
        style={{
          width: "20%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: BLUE,
        }}
      />
      <div
        style={{
          flex: 1,
          height: "26%",
          borderRadius: 999,
          background: withAlpha(BLUE, 0.45),
        }}
      />
    </div>
  );
};

const SceneObject: React.FC<{ o: Obj; frame: number; fps: number }> = ({
  o,
  frame,
  fps,
}) => {
  const pop = spring({
    frame: frame - o.appear,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  // 虛線框＋尺寸標籤跟在物件彈入之後亮起
  const boxShow = interpolate(
    frame,
    [o.appear + 14, o.appear + 32],
    [0, 1],
    ease,
  );

  const left = o.x * SCALE;
  const top = o.y * SCALE;
  const w = o.w * SCALE;
  const h = o.h * SCALE;
  const mLeft = o.mx * SCALE;
  const mTop = o.my * SCALE;
  const mW = o.mw * SCALE;
  const mH = o.mh * SCALE;

  // 地板／平台用上浮、其餘用縮放彈入（橫長塊做縮放會壓寬，改用 translateY）
  const popTransform =
    o.kind === "floor" || o.kind === "platform"
      ? `translateY(${interpolate(pop, [0, 1], [24, 0])}px)`
      : `scale(${interpolate(pop, [0, 1], [0.6, 1])})`;

  return (
    <>
      {/* 物件本體 */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          opacity: pop,
          transform: popTransform,
          transformOrigin: o.kind === "char" ? "center bottom" : "center",
        }}
      >
        <ObjectGlyph kind={o.kind} />
      </div>

      {/* 虛線量測框 */}
      <div
        style={{
          position: "absolute",
          left: mLeft - 7,
          top: mTop - 7,
          width: mW + 14,
          height: mH + 14,
          border: `2px dashed ${DASH_BORDER}`,
          borderRadius: 6,
          opacity: boxShow,
        }}
      />

      {/* 尺寸標籤 */}
      <div
        style={{
          position: "absolute",
          ...(o.labelSide === "top"
            ? {
                left: mLeft + mW / 2,
                top: mTop - 7 - 36,
                transform: "translateX(-50%)",
              }
            : o.labelSide === "bottom"
              ? {
                  left: mLeft + mW / 2,
                  top: mTop + mH + 7 + 8,
                  transform: "translateX(-50%)",
                }
              : {
                  left: mLeft + mW + 16,
                  top: mTop + mH / 2,
                  transform: "translateY(-50%)",
                }),
          padding: "4px 12px",
          borderRadius: 8,
          background: WHITE,
          border: `1.5px solid ${BORDER_SOFT}`,
          color: TEXT_DARK,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 0.5,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
          opacity: boxShow,
        }}
      >
        {o.dim}
      </div>
    </>
  );
};

export const Ch4Page2S08WhySize: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const winSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const winLabel = interpolate(frame, [24, 42], [0, 1], ease);
  // 結尾過場 chip：下方彈出「實際操作給大家看 →」，引導接 sX 實機示範
  const chipPop = spring({
    frame: frame - 200,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 1920×1080 視窗（S12 風格：標題列＋三色點＋視窗名稱） */}
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <WindowFrame
            title="1920×1080"
            titleStyle={{ fontSize: 30, opacity: winLabel }}
            style={{
              position: "relative",
              width: WIN_W,
              marginBottom: 150,
              opacity: winSpring,
              transform: `scale(${interpolate(winSpring, [0, 1], [0.94, 1])})`,
            }}
          >
            {/* 畫布（遊戲畫面）：物件 + 虛線量測框 + 尺寸標籤 */}
            <div
              style={{
                position: "relative",
                width: WIN_W,
                height: WIN_H,
                background: WHITE,
              }}
            >
              {OBJECTS.map((o) => (
                <SceneObject key={o.key} o={o} frame={frame} fps={fps} />
              ))}
            </div>
          </WindowFrame>
        </AbsoluteFill>

        {/* 結尾過場提示（下方置中：純文字 + 同色箭頭） */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 72,
            transform: `translateX(-50%) translateY(${interpolate(chipPop, [0, 1], [26, 0])}px)`,
            opacity: chipPop,
            color: TEXT_DARK,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            whiteSpace: "nowrap",
          }}
        >
          實際操作給大家看 →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
