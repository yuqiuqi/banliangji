/**
 * Layout tokens — radii, shadows, borders（iOS 取向：轻阴影、圆角贴近 HIG）。
 */
import { Platform, type ViewStyle } from "react-native";
import { colors } from "./colors";

/** Press / motion tokens — see `.planning/phases/06-ui-v2/06-UI-SPEC.md` */
export const pressedOpacity = 0.92;
export const pressScale = 0.98;
export const pressTranslateY = 1;
export const pressDurationMs = 100;

/** 图表主图区淡入时长（ms）— Phase 7 `07-UI-SPEC` 约 150–250；供 `Animated` 与 07-02 使用 */
export const chartFadeMs = 200;

export const radii = {
  card: 10,
  sheet: 14,
  pill: 999,
  chip: 10,
} as const;

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  raised: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }),
  /** 主按钮 — 轻抬起 */
  fluentButton: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

export const hairlineBorder = {
  borderWidth: 1,
  borderColor: colors.body,
} as const;
