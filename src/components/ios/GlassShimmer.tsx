/**
 * 按压高光扫过（v1.2 §3.9 ② Shimmer）。
 *
 * 用法：外部按 active prop 触发；组件内部自动往复一次后停下。
 * - 对角线方向扫过，0.4s 默认
 * - Reduce Motion 开启时直接 opacity fade，不位移
 */
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useReduceMotion } from "../../hooks/useReduceMotion";
import { FADE_MS } from "../../theme/motion";

export type GlassShimmerProps = {
  active: boolean;
  width: number;
  height: number;
  durationMs?: number;
  angleDeg?: number;
};

export function GlassShimmer({
  active,
  width,
  height,
  durationMs = 400,
  angleDeg = 20,
}: GlassShimmerProps): React.ReactElement {
  const reduce = useReduceMotion();
  const x = useSharedValue(-width);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      opacity.value = 0.28;
      opacity.value = withTiming(0, { duration: FADE_MS.normal });
      return;
    }
    x.value = -width;
    opacity.value = 0.28;
    x.value = withTiming(width, { duration: durationMs });
    opacity.value = withTiming(0, { duration: durationMs });
  }, [active, durationMs, opacity, reduce, width, x]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: reduce
      ? []
      : [{ translateX: x.value }, { rotateZ: `${angleDeg}deg` }],
  }));

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.clip]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, style]}>
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.28)", "transparent"]}
          locations={[0.4, 0.5, 0.6]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: width * 0.4, height }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
});
