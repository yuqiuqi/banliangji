/**
 * iOS 26 Liquid Glass — 静态合并（v1.2 §3.10bis G4）。
 *
 * 用法：必须位于 `GlassEffectContainer` 之内。子元素之间 gap: 0，
 *       共享 borderRadius，形成视觉单一胶体。
 *
 * 禁区：
 * - 不可跨 Container 使用同一 union（Apple 明确要求同容器内）
 * - 不可合并动态变化的元素（用 Morphing，不用 Union）
 */
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { radii } from "../../theme/layout";

export type GlassEffectUnionProps = {
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function GlassEffectUnion({
  borderRadius = radii.card,
  style,
  children,
}: GlassEffectUnionProps): React.ReactElement {
  return (
    <View style={[styles.union, { borderRadius }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  union: {
    overflow: "hidden",
    flexDirection: "column",
  },
});
