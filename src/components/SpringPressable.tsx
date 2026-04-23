import React, { forwardRef, useCallback } from "react";
import type { PressableProps, PressableStateCallbackType } from "react-native";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useReduceMotion } from "../hooks/useReduceMotion";
import { FADE_MS, SPRING } from "../theme/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function resolveStyle(
  style: PressableProps["style"],
  state: PressableStateCallbackType,
): StyleProp<ViewStyle> {
  if (typeof style === "function") {
    return style(state);
  }
  return style;
}

/**
 * Pressable with spring scale/opacity (INT-01). Forwards all Pressable props + ref.
 */
export const SpringPressable = forwardRef<React.ElementRef<typeof Pressable>, PressableProps>(
  function SpringPressable({ onPressIn, onPressOut, style, ...rest }, ref) {
    const reduceMotion = useReduceMotion();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePressIn = useCallback(
      (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
        onPressIn?.(e);
        if (reduceMotion) {
          scale.value = 1;
          opacity.value = withTiming(0.92, { duration: FADE_MS.fast });
        } else {
          scale.value = withSpring(0.97, SPRING.UI);
          opacity.value = withSpring(0.92, SPRING.UI);
        }
      },
      [onPressIn, reduceMotion],
    );

    const handlePressOut = useCallback(
      (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
        onPressOut?.(e);
        if (reduceMotion) {
          opacity.value = withTiming(1, { duration: FADE_MS.fast });
        } else {
          scale.value = withSpring(1, SPRING.UI);
          opacity.value = withSpring(1, SPRING.UI);
        }
      },
      [onPressOut, reduceMotion],
    );

    return (
      <AnimatedPressable
        ref={ref}
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={(state) => [resolveStyle(style, state), animatedStyle]}
      />
    );
  },
);

SpringPressable.displayName = "SpringPressable";
