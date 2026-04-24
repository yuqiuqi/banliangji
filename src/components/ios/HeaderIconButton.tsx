/**
 * 顶栏图标按钮 —— 统一 wash / accent 两种风格。
 *
 * 关键行为（修复「按压连带感」）：
 * - **每个按钮有固定 size 外层 View**（headerFabSize × headerFabSize），
 *   彻底隔离按压 transform 对兄弟按钮的视觉影响
 * - 内层 SpringPressable 仅作用于圆形「按钮本体」，transform 不会溢出 outer
 * - scale 0.97（克制幅度）+ opacity 0.92 + SPRING.UI，松手弹回
 * - 同帧触觉：accent → medium、wash → light
 *
 * 对齐 v1.2 §11.3 + §13.2 + §19.6。
 */
import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
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
  style?: StyleProp<ViewStyle>;
};

function buildStyles(colors: AppPalette) {
  return StyleSheet.create({
    // 外层 wrapper：永远固定 size，不受按压动画影响 —— 彻底隔离兄弟视觉
    outer: {
      width: headerFabSize,
      height: headerFabSize,
      alignItems: "center",
      justifyContent: "center",
    },
    // 内层 SpringPressable 里的圆形本体
    inner: {
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
    <View style={[styles.outer, style]}>
      <SpringPressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        hitSlop={hitSlop}
        hapticOn="pressIn"
        hapticIntensity={variant === "accent" ? "medium" : "light"}
        scaleTo={0.97}
        opacityTo={0.92}
        style={[styles.inner, variant === "accent" ? styles.accent : styles.wash]}
      >
        <MaterialCommunityIcons name={icon} size={resolvedIconSize} color={color} />
      </SpringPressable>
    </View>
  );
}
