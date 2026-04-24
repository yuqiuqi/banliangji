/**
 * 玻璃内文字的 vibrancy 近似（v1.2 §3.8 E7 Tier 1+2）。
 *
 * 策略：
 * - 颜色使用主题 title（保证深浅模式下对比度）
 * - iOS 下追加轻微 textShadow（补偿玻璃模糊的可读性损失）
 * - 推荐 fontWeight ≥ '600'（默认 '600'）
 */
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";

import { useAppTheme } from "../../theme/ThemeContext";

export type VibrantTextProps = TextProps & {
  vibrantWeight?: TextStyle["fontWeight"];
};

export function VibrantText({
  vibrantWeight = "600",
  style,
  children,
  ...rest
}: VibrantTextProps): React.ReactElement {
  const { colors } = useAppTheme();

  return (
    <Text
      {...rest}
      style={[
        { color: colors.title, fontWeight: vibrantWeight },
        Platform.OS === "ios" ? styles.iosShadow : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  iosShadow: {
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
