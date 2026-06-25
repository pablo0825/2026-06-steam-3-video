import { Easing } from "remotion";

// 場景共用的字型與動畫設定。
//   各場景檔原本各自重複定義 FONT / clamp / ease，集中於此避免重複。
export const FONT =
  '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

// interpolate 的「夾住」選項：超出輸入區間時，輸出夾在端點、不外推。
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 具名緩動曲線（皆已併入 clamp，可直接當 interpolate 的第 4 參數）。
export const easeOutExpo = { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }; // 先快後慢、收尾平緩
export const easeStandard = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) }; // 標準進出
export const easeSoft = { ...clamp, easing: Easing.bezier(0.2, 0.9, 0.25, 1) }; // 柔和
