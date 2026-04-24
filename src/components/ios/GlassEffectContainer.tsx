/**
 * iOS 26 Liquid Glass — 共享采样容器（v1.2 §3.10 G1）。
 *
 * 策略（SwiftUI `GlassEffectContainer` 的 RN 近似）：
 * - 容器层仅一层 `BlurView`，提供共享采样；子元素**不得**再嵌 BlurView（v1.2 §3.15 约束 4）
 * - 子元素只做 tint / borderRadius / content
 * - 顶部 1px hairline 高光（v1.2 §3.6 Specular 静态版）
 * - 必须绝对定位于动态内容之上（v1.2 §3.15 约束 1）
 */
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

import { radii } from "../../theme/layout";
import { useAppTheme } from "../../theme/ThemeContext";

type Tint = "default" | "dark" | "light";

export type GlassEffectContainerProps = {
  intensity?: number;
  tint?: Tint;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function GlassEffectContainer({
  intensity = 60,
  tint,
  borderRadius = radii.card,
  style,
  children,
}: GlassEffectContainerProps): React.ReactElement {
  const { colorScheme } = useAppTheme();
  const resolvedTint: Tint =
    tint ?? (colorScheme === "dark" ? "dark" : "default");

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]}>
      <BlurView
        intensity={intensity}
        tint={resolvedTint}
        style={StyleSheet.absoluteFill}
      />
      {/* 顶部高光 hairline —— 静态 Specular */}
      <View style={styles.topHighlight} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.35)",
    zIndex: 1,
  },
  content: {
    zIndex: 2,
  },
});
