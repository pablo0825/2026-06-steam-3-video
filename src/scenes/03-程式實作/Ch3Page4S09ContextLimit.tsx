import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  BLUE,
  CARD_BORDER,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S09：Context 容量限制（450 幀）
const CONTENT_IN = [2, 30] as const;
const CONTAINER_IN = [20, 52] as const;
const ITEM_FIRST = 46;
const ITEM_STEP = 24;
const NEW_ITEM_IN = [190, 260] as const;
const OLD_ITEM_OUT = [190, 260] as const;
const WARNING_IN = [290, 326] as const;

const CARD_WIDTH = 218;
const CARD_GAP = 18;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const CARD_LEFT = 28;

const CONTEXT_ITEMS = [
  { id: "A", label: "前面的需求" },
  { id: "B", label: "功能規則" },
  { id: "C", label: "修改紀錄" },
  { id: "D", label: "目前問題" },
] as const;

export const Ch3Page4S09ContextLimit: React.FC = () => {
  const frame = useCurrentFrame();

  const contentIn = interpolate(frame, CONTENT_IN, [0, 1], easeStandard);
  const containerIn = interpolate(frame, CONTAINER_IN, [0, 1], easeStandard);
  const newItemIn = interpolate(frame, NEW_ITEM_IN, [0, 1], easeStandard);
  const oldItemOut = interpolate(frame, OLD_ITEM_OUT, [0, 1], easeStandard);
  const warningIn = interpolate(frame, WARNING_IN, [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(-20px)",
          opacity: contentIn,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 2,
          }}
        >
          Context 的限制
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 62,
            width: 1220,
            height: 300,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 0,
              width: 1000,
              height: 190,
              borderRadius: 28,
              border: `3px solid ${CARD_BORDER}`,
              backgroundColor: withAlpha(BLUE, 0.05),
              boxShadow: `0 18px 48px ${withAlpha(TEXT_DARK, 0.08)}`,
              opacity: containerIn,
              transform: `scaleX(${interpolate(
                containerIn,
                [0, 1],
                [0.94, 1],
              )})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 22,
                fontSize: 24,
                fontWeight: 800,
                color: BLUE,
                letterSpacing: 3,
              }}
            >
              CONTEXT
            </div>
          </div>

          {CONTEXT_ITEMS.map((item, index) => {
            const itemIn = interpolate(
              frame,
              [
                ITEM_FIRST + index * ITEM_STEP,
                ITEM_FIRST + index * ITEM_STEP + 20,
              ],
              [0, 1],
              easeStandard,
            );
            const isOldest = index === 0;
            const baseX = 110 + CARD_LEFT + index * CARD_STEP;
            const replacementX = isOldest
              ? interpolate(
                  oldItemOut,
                  [0, 1],
                  [baseX, -CARD_WIDTH - 30],
                  easeStandard,
                )
              : interpolate(
                  oldItemOut,
                  [0, 1],
                  [baseX, baseX - CARD_STEP],
                  easeStandard,
                );
            const oldOpacity = isOldest
              ? interpolate(oldItemOut, [0, 0.82, 1], [1, 1, 0], clamp)
              : 1;

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: replacementX,
                  top: 80,
                  width: CARD_WIDTH,
                  height: 82,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  color: isOldest ? SUBTLE : TEXT_DARK,
                  backgroundColor: WHITE,
                  border: `2px solid ${CARD_BORDER}`,
                  opacity: itemIn * oldOpacity,
                  transform: `translateY(${interpolate(
                    itemIn,
                    [0, 1],
                    [24, 0],
                  )}px)`,
                }}
              >
                {item.label}
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: interpolate(
                newItemIn,
                [0, 1],
                [1220 + 30, 110 + CARD_LEFT + 3 * CARD_STEP],
                easeStandard,
              ),
              top: 80,
              width: CARD_WIDTH,
              height: 82,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: WHITE,
              backgroundColor: BLUE,
              opacity: interpolate(newItemIn, [0, 0.18, 1], [0, 1, 1], clamp),
              boxShadow: `0 12px 28px ${withAlpha(BLUE, 0.22)}`,
            }}
          >
            新的資訊
          </div>
        </div>

        <div
          aria-label="Context 有容量的限制，新資訊會逐漸取代舊資訊"
          style={{
            marginTop: 20,
            fontSize: 42,
            fontWeight: 800,
            color: TEXT_DARK,
            opacity: warningIn,
            transform: `translateY(${interpolate(
              warningIn,
              [0, 1],
              [18, 0],
            )}px)`,
          }}
        >
          Context 有<span style={{ color: YELLOW }}>容量的限制</span>
          ，新資訊會逐漸
          <span style={{ color: YELLOW }}>取代舊資訊</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
