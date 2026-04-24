/**
 * Layout tokens — radii, shadows, borders（iOS 26 取向：极轻层级阴影、半透明分隔、hairline）。
 */
import { Platform, StyleSheet, type ViewStyle } from "react-native";
import { lightPalette } from "./palette";

/** iOS 分组列表行水平 inset — 与 `GroupedInset` 内列表左/右对齐 */
export const listContentInset = 16;

/**
 * React Navigation `PlatformPressable` 兼容值（Tab bar 按钮使用）。
 * 新写按压动效请用 `SpringPressable`（对齐 v1.2 §11.3 / §13）。
 */
export const pressedOpacity = 0.92;

/** 图表主图区淡入时长（ms）— Phase 7 `07-UI-SPEC` 约 150–250；供 `Animated` 与 07-02 使用 */
export const chartFadeMs = 200;

export const radii = {
  card: 12,
  sheet: 14,
  pill: 999,
  chip: 10,
} as const;

/** 浮动主按钮（日历记一笔等）— 与 Fab 组件同步 */
export const fabSize = 56;
export const fabIconSize = 28;
/** 导航栏右侧强调按钮（与列表 FAB 同系，略小） */
export const headerFabSize = 36;
export const headerFabIconSize = 22;

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
  /** 分组白卡片：无描边时的「浮起」感 — 极轻、大模糊半径 */
  grouped: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 14,
    },
    android: { elevation: 1 },
    default: {},
  }),
  /** 记一笔分类格选中：极轻抬起，避免白底贴白底 */
  categoryCellOn: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.09,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  /** 计算器数字键：白块与毛玻璃底分离，轻微浮起 */
  keyCap: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    android: { elevation: 3 },
    default: {},
  }),
  keyCapAccent: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: { elevation: 4 },
    default: {},
  }),
  /** 圆形 FAB — 明显抬起，贴近 iOS 26 浮动控件 */
  fab: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.24,
      shadowRadius: 12,
    },
    android: { elevation: 10 },
    default: {},
  }),
  /** 导航栏内小圆强调按钮 */
  headerFab: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 6,
    },
    android: { elevation: 5 },
    default: {},
  }),
  /** 次级图标底（筛选等）— 轻抬白雾 */
  headerIconWash: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
} as const;

/** Light-default hairline — prefer `useAppTheme().colors.divider` in themed UI. */
export const hairlineBorder = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: lightPalette.divider,
} as const;
