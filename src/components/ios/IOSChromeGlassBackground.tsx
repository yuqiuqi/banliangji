import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useReduceTransparency } from "../../hooks/useReduceTransparency";
import { useAppTheme } from "../../theme/ThemeContext";
import { radii } from "../../theme/layout";

type Variant = "tabBar" | "dock";

type Props = {
  variant: Variant;
};

/**
 * Tier-1 分层材质：Blur + tint + hairline + shadow；降级/ Android 为不透明底（Phase 11）。
 */
export function IOSChromeGlassBackground({ variant }: Props): React.ReactElement {
  const { colors, colorScheme } = useAppTheme();
  const reduceTransparency = useReduceTransparency();

  const blurTint = colorScheme === "dark" ? "dark" : "light";
  const intensity = variant === "dock" ? 85 : 72;

  const shadowStyle =
    variant === "dock"
      ? Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          },
          default: {},
        })
      : Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          },
          default: {},
        });

  const solidBg =
    variant === "dock" ? colors.calculatorDockFallback : colors.main;

  if (Platform.OS !== "ios" || reduceTransparency) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: solidBg,
            borderTopWidth: variant === "dock" ? StyleSheet.hairlineWidth : 0,
            borderTopColor: colors.divider,
          },
          shadowStyle,
        ]}
      />
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, shadowStyle]}>
      <BlurView intensity={intensity} tint={blurTint} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              colorScheme === "dark" ? "rgba(44, 44, 46, 0.42)" : "rgba(246, 246, 246, 0.45)",
          },
        ]}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: StyleSheet.hairlineWidth * 2,
          backgroundColor:
            colorScheme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.55)",
          opacity: variant === "dock" ? 1 : 0.85,
        }}
      />
    </View>
  );
}

/** @internal 记一笔 Dock 外槽圆角与 CreateBill 一致 */
export const chromeDockRadius = radii.sheet;
