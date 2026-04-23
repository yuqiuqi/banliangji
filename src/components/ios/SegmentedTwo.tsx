import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { SpringPressable } from "../SpringPressable";
import { useReduceMotion } from "../../hooks/useReduceMotion";
import { useAppTheme } from "../../theme/ThemeContext";
import type { AppPalette } from "../../theme/palette";
import { radii, shadows } from "../../theme/layout";
import { iosType } from "../../theme/typography";
import { FADE_MS, SPRING } from "../../theme/motion";
import { hapticSelect } from "../../utils/haptics";

type Props = {
  leftLabel: string;
  rightLabel: string;
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  style?: StyleProp<ViewStyle>;
};

function buildSegStyles(colors: AppPalette) {
  return StyleSheet.create({
    track: {
      flexDirection: "row",
      backgroundColor: colors.segmentedTrack,
      borderRadius: radii.pill,
      padding: 3,
      position: "relative",
    },
    thumb: {
      position: "absolute",
      left: 0,
      top: 3,
      bottom: 3,
      backgroundColor: colors.surface,
      borderRadius: radii.pill,
      ...shadows.keyCap,
      zIndex: 0,
    },
    seg: {
      flex: 1,
      paddingVertical: 9,
      alignItems: "center",
      borderRadius: radii.pill,
      zIndex: 1,
      backgroundColor: "transparent",
    },
    text: {
      ...iosType.footnote,
      fontWeight: "400",
      color: colors.lightTitle,
    },
    textOn: {
      color: colors.title,
      fontWeight: "600",
    },
  });
}

export function SegmentedTwo({
  leftLabel,
  rightLabel,
  value,
  onChange,
  style,
}: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildSegStyles(colors), [colors]);
  const reduceMotion = useReduceMotion();
  const layouts = useRef([
    { x: 0, w: 0 },
    { x: 0, w: 0 },
  ]);
  const thumbX = useSharedValue(0);
  const thumbW = useSharedValue(0);

  const moveThumb = useCallback(
    (i: 0 | 1) => {
      const L = layouts.current[i];
      if (L.w <= 0) {
        return;
      }
      if (reduceMotion) {
        thumbX.value = withTiming(L.x, { duration: FADE_MS.fast });
        thumbW.value = withTiming(L.w, { duration: FADE_MS.fast });
      } else {
        thumbX.value = withSpring(L.x, SPRING.THUMB);
        thumbW.value = withSpring(L.w, SPRING.THUMB);
      }
    },
    [reduceMotion],
  );

  useEffect(() => {
    moveThumb(value === 0 ? 0 : 1);
  }, [value, moveThumb]);

  const onSegLayout = (i: 0 | 1) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layouts.current[i] = { x, w: width };
    if (value === i) {
      moveThumb(i);
    }
  };

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
    width: thumbW.value,
  }));

  return (
    <View style={[styles.track, style]}>
      <Animated.View style={[styles.thumb, thumbAnim]} pointerEvents="none" />
      <SpringPressable style={styles.seg} onLayout={onSegLayout(0)} accessibilityRole="button" accessibilityState={{ selected: value === 0 }}
        onPress={() => {
          if (value !== 0) {
            hapticSelect();
            onChange(0);
          }
        }}
      >
        <Text style={[styles.text, value === 0 ? styles.textOn : null]}>{leftLabel}</Text>
      </SpringPressable>
      <SpringPressable style={styles.seg} onLayout={onSegLayout(1)} accessibilityRole="button" accessibilityState={{ selected: value === 1 }}
        onPress={() => {
          if (value !== 1) {
            hapticSelect();
            onChange(1);
          }
        }}
      >
        <Text style={[styles.text, value === 1 ? styles.textOn : null]}>{rightLabel}</Text>
      </SpringPressable>
    </View>
  );
}
