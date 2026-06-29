import React from "react";
import {
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT } from "../../theme/motion";

export type SpecDocumentCardProps = {
  opacity: number;
  scale: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  showRows?: boolean;
};

const ROW_WIDTHS = [0.82, 0.68, 0.76, 0.58] as const;

export const SpecDocumentCard: React.FC<SpecDocumentCardProps> = ({
  opacity,
  scale,
  x = 960,
  y = 560,
  width = 520,
  height = 340,
  showRows = true,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: 26,
        overflow: "hidden",
        backgroundColor: WHITE,
        border: `3px solid ${CARD_BORDER}`,
        boxShadow: `0 22px 54px ${withAlpha(TEXT_DARK, 0.14)}`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          height: 78,
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          gap: 18,
          color: WHITE,
          backgroundColor: BLUE,
        }}
      >
        <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
          <path
            d="M5 2h16l8 8v28H5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M21 2v9h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>
          feature-spec.md
        </div>
      </div>

      <div style={{ padding: "34px 40px" }}>
        <div
          style={{
            fontSize: 25,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 1,
          }}
        >
          Jump Feature
        </div>
        {showRows && (
          <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
            {ROW_WIDTHS.map((rowWidth, index) => (
              <div
                key={rowWidth}
                style={{
                  width: `${rowWidth * 100}%`,
                  height: index === 0 ? 15 : 12,
                  borderRadius: 999,
                  backgroundColor:
                    index === 0 ? withAlpha(BLUE, 0.28) : withAlpha(SUBTLE, 0.2),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
