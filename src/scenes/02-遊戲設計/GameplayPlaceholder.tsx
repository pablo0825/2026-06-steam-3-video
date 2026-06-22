import React from "react";
import {BLUE, WHITE, YELLOW, withAlpha} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

type GameplayPlaceholderProps = {
  title: string;
  subtitle: string;
  icon: string;
};

export const GameplayPlaceholder: React.FC<GameplayPlaceholderProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: FONT,
        color: WHITE,
        background: `linear-gradient(145deg, #162638 0%, ${BLUE} 58%, #203244 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(${withAlpha(WHITE, 0.24)} 1px, transparent 1px),
            linear-gradient(90deg, ${withAlpha(WHITE, 0.24)} 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: withAlpha(YELLOW, 0.14),
          boxShadow: `0 0 100px ${withAlpha(YELLOW, 0.16)}`,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            fontSize: 58,
            background: withAlpha(WHITE, 0.12),
            border: `2px solid ${withAlpha(WHITE, 0.34)}`,
            boxShadow: `0 16px 38px ${withAlpha("#000000", 0.24)}`,
          }}
        >
          {icon}
        </div>
        <div style={{fontSize: 48, fontWeight: 800, letterSpacing: 3}}>
          {title}
        </div>
        <div
          style={{
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 2,
            color: withAlpha(WHITE, 0.76),
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "9px 20px",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            color: YELLOW,
            background: withAlpha("#000000", 0.26),
            border: `1px solid ${withAlpha(YELLOW, 0.45)}`,
          }}
        >
          GAMEPLAY PLACEHOLDER
        </div>
      </div>
    </div>
  );
};
