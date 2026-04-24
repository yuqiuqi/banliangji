/**
 * 对齐 `.planning/IOS26-DESIGN-GUIDE.md` §11.3：
 * - 按下：scale → 0.97 + opacity → 0.92（SPRING.UI 驱动）
 * - 松手：scale → 1 + opacity → 1（弹回）
 * - `onPressIn` 同帧触发 haptic（默认 light；可配 medium / select / 关闭）
 * - `useReduceMotion` = true 时降级：短 timing 替代 spring，触觉保留
 *
 * 仅作为基础 wrapper。Phase 18+ 业务组件引用此处替换裸 Pressable。
 */
import React, { useMemo } from "react";
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useReduceMotion } from "../hooks/useReduceMotion";
import {
  FADE_MS,
  REDUCE_SPRING,
  SPRING,
  type SpringPreset,
} from "../theme/motion";
import { haptic, type HapticKind } from "../utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticTiming = "pressIn" | "press" | false;

export type SpringPressableProps = PressableProps & {
  /** 弹簧预设，默认 UI */
  spring?: SpringPreset;
  /** 触发触觉的时机；false = 不触觉 */
  hapticOn?: HapticTiming;
  /** 触觉类型（默认 light） */
  hapticIntensity?: Extract<HapticKind, "light" | "medium" | "select">;
  /** 按下时目标 scale（默认 0.97） */
  scaleTo?: number;
  /** 按下时目标 opacity（默认 0.92） */
  opacityTo?: number;
};

export const SpringPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  SpringPressableProps
>(function SpringPressable(
  {
    spring = "UI",
    hapticOn = "pressIn",
    hapticIntensity = "light",
    scaleTo = 0.97,
    opacityTo = 0.92,
    onPressIn,
    onPressOut,
    onPress,
    style,
    children,
    ...rest
  },
  ref,
) {
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const springConfig = useMemo(
    () => (reduce ? REDUCE_SPRING : SPRING[spring]),
    [reduce, spring],
  );

  const down = () => {
    if (reduce) {
      scale.value = withTiming(scaleTo, { duration: FADE_MS.fast });
      opacity.value = withTiming(opacityTo, { duration: FADE_MS.fast });
      return;
    }
    scale.value = withSpring(scaleTo, springConfig);
    opacity.value = withSpring(opacityTo, springConfig);
  };

  const up = () => {
    if (reduce) {
      scale.value = withTiming(1, { duration: FADE_MS.fast });
      opacity.value = withTiming(1, { duration: FADE_MS.fast });
      return;
    }
    scale.value = withSpring(1, springConfig);
    opacity.value = withSpring(1, springConfig);
  };

  const fire = () => {
    if (!hapticOn) return;
    void haptic[hapticIntensity]();
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    down();
    if (hapticOn === "pressIn") fire();
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    up();
    onPressOut?.(e);
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (hapticOn === "press") fire();
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      ref={ref}
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style as never]}
    >
      {children as React.ReactNode}
    </AnimatedPressable>
  );
});
