/**
 * iOS 26 风格双段切换器（v1.2 §11.2 Spring Thumb）。
 *
 * 视觉 / 交互：
 * - 独立浮起「拇指」(thumb) 层：白/玻璃底 + 立体阴影（shadows.keyCap）
 * - 切换时 thumb 用 SPRING.THUMB 滑动到目标半侧（非瞬切）
 * - 点击触觉 haptic.select（每次切换）
 * - Reduce Motion 降级为短 timing
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { SpringPressable } from "../SpringPressable";
import { useReduceMotion } from "../../hooks/useReduceMotion";
import { useAppTheme } from "../../theme/ThemeContext";
import type { AppPalette } from "../../theme/palette";
import {
  FADE_MS,
  REDUCE_SPRING,
  SPRING,
} from "../../theme/motion";
import { radii } from "../../theme/layout";
import { haptic } from "../../utils/haptics";

type Props = {
  leftLabel: string;
  rightLabel: string;
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  style?: StyleProp<ViewStyle>;
};

function buildSegStyles(colors: AppPalette) {
  const thumbShadow =
    Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }) ?? {};

  return StyleSheet.create({
    track: {
      flexDirection: "row",
      backgroundColor: colors.segmentedTrack,
      borderRadius: radii.pill,
      padding: 3,
      overflow: "hidden",
    },
    thumbBg: {
      position: "absolute",
      top: 3,
      bottom: 3,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.6)",
      ...thumbShadow,
    },
    seg: {
      flex: 1,
      paddingVertical: 9,
      alignItems: "center",
      borderRadius: radii.pill,
    },
    text: {
      fontSize: 15,
      fontWeight: "500",
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
  const reduce = useReduceMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  // thumb 占一半减去 padding
  const halfWidth = (trackWidth - 6) / 2;
  const thumbX = useSharedValue(0);

  useEffect(() => {
    if (halfWidth <= 0) return;
    const target = value === 0 ? 0 : halfWidth;
    if (reduce) {
      thumbX.value = withTiming(target, { duration: FADE_MS.fast });
    } else {
      thumbX.value = withSpring(target, reduce ? REDUCE_SPRING : SPRING.THUMB);
    }
  }, [value, halfWidth, reduce, thumbX]);

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const handleSelect = (v: 0 | 1) => {
    if (v === value) return;
    void haptic.select();
    onChange(v);
  };

  return (
    <View style={[styles.track, style]} onLayout={onTrackLayout}>
      {halfWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumbBg,
            { left: 3, width: halfWidth },
            thumbAnimStyle,
          ]}
        />
      ) : null}
      <SpringPressable
        style={styles.seg}
        hapticOn={false}
        scaleTo={0.98}
        opacityTo={0.96}
        onPress={() => handleSelect(0)}
      >
        <Text style={[styles.text, value === 0 ? styles.textOn : null]}>
          {leftLabel}
        </Text>
      </SpringPressable>
      <SpringPressable
        style={styles.seg}
        hapticOn={false}
        scaleTo={0.98}
        opacityTo={0.96}
        onPress={() => handleSelect(1)}
      >
        <Text style={[styles.text, value === 1 ? styles.textOn : null]}>
          {rightLabel}
        </Text>
      </SpringPressable>
    </View>
  );
}
