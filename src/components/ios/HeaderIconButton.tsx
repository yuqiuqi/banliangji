/**
 * 顶栏图标按钮 —— 统一 wash / accent 两种风格。
 *
 * 关键行为（修复老实现的按压连带感）：
 * - 每个按钮内部独立 SpringPressable（独立 shared value）
 * - 按下 scale 0.94 + opacity 0.92，松手弹回（SPRING.UI）
 * - 同帧触觉：accent → medium、wash → light
 * - Reduce Motion 自动降级（由 SpringPressable 承担）
 *
 * 对齐 v1.2 §11.3 + §13.2 + §19.6。
 */
import React, { useMemo } from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SpringPressable } from "../SpringPressable";
import { useAppTheme } from "../../theme/ThemeContext";
import {
  headerFabIconSize,
  headerFabSize,
  shadows,
} from "../../theme/layout";
import type { AppPalette } from "../../theme/palette";

export type HeaderIconVariant = "wash" | "accent";

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export type HeaderIconButtonProps = {
  icon: MaterialIconName;
  onPress: () => void;
  variant?: HeaderIconVariant;
  accessibilityLabel?: string;
  iconSize?: number;
  hitSlop?: number;
  style?: ViewStyle;
};

function buildStyles(colors: AppPalette) {
  return StyleSheet.create({
    base: {
      width: headerFabSize,
      height: headerFabSize,
      borderRadius: headerFabSize / 2,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
    },
    wash: {
      backgroundColor: colors.surface,
      borderColor: "rgba(255, 255, 255, 0.65)",
      ...shadows.headerIconWash,
    },
    accent: {
      backgroundColor: colors.accent,
      borderColor: "rgba(255, 255, 255, 0.38)",
      ...shadows.headerFab,
    },
  });
}

export function HeaderIconButton({
  icon,
  onPress,
  variant = "wash",
  accessibilityLabel,
  iconSize,
  hitSlop = 8,
  style,
}: HeaderIconButtonProps): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildStyles(colors), [colors]);
  const resolvedIconSize = iconSize ?? (variant === "accent" ? headerFabIconSize : 22);
  const color = variant === "accent" ? colors.onAccent : colors.onMain;

  return (
    <SpringPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={hitSlop}
      hapticOn="pressIn"
      hapticIntensity={variant === "accent" ? "medium" : "light"}
      scaleTo={0.94}
      opacityTo={0.92}
      style={[styles.base, variant === "accent" ? styles.accent : styles.wash, style]}
    >
      <MaterialCommunityIcons name={icon} size={resolvedIconSize} color={color} />
    </SpringPressable>
  );
}
