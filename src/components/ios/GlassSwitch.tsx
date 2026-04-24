/**
 * 液态玻璃风格开关：轨道毛玻璃 + 弹簧滑动的圆形拇指（iOS 26 近似）。
 */
import React, { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useAppTheme } from "../../theme/ThemeContext";
import { SPRING } from "../../theme/motion";
import { haptic } from "../../utils/haptics";
import { GlassEffectContainer } from "./GlassEffectContainer";

const TRACK_W = 52;
const TRACK_H = 32;
const THUMB = 26;
const PAD = 3;

export type GlassSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function GlassSwitch({
  value,
  onValueChange,
  disabled = false,
  style,
  accessibilityLabel,
}: GlassSwitchProps): React.ReactElement {
  const { colors } = useAppTheme();
  const travel = TRACK_W - THUMB - PAD * 2;
  const x = useSharedValue(value ? travel : 0);

  useEffect(() => {
    x.value = withSpring(value ? travel : 0, SPRING.UI);
  }, [value, travel, x]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: TRACK_H / 2,
          overflow: "hidden",
        },
        trackInner: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
        },
        thumb: {
          position: "absolute",
          left: PAD,
          width: THUMB,
          height: THUMB,
          borderRadius: THUMB / 2,
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(255,255,255,0.55)",
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
      }),
    [colors.surface],
  );

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        if (disabled) {
          return;
        }
        void haptic.select();
        onValueChange(!value);
      }}
      style={style}
    >
      <View style={styles.wrap}>
        <GlassEffectContainer
          intensity={48}
          borderRadius={TRACK_H / 2}
          style={{ width: TRACK_W, height: TRACK_H }}
        >
          <View style={[styles.trackInner, { width: TRACK_W, height: TRACK_H }]} pointerEvents="none">
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </View>
        </GlassEffectContainer>
      </View>
    </Pressable>
  );
}
