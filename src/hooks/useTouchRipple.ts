/**
 * 按压触点辐射 radial 光晕（v1.2 §3.9 ③ 单元素版）。
 *
 * 注意：RN 中这是**视觉合成**而非物理传染（v1.2 Red-02）。
 * 返回合成好的 Animated 样式与按压回调，业务组件自行挂载到 Pressable 内。
 */
import { useCallback } from "react";
import type { GestureResponderEvent } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RIPPLE_MAX_R = 120;
const RIPPLE_DURATION = 480;
const RIPPLE_OPACITY = 0.32;

export type UseTouchRippleResult = {
  onPressIn: (e: GestureResponderEvent) => void;
  rippleStyle: ReturnType<typeof useAnimatedStyle>;
};

export function useTouchRipple(): UseTouchRippleResult {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const opacity = useSharedValue(0);

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      const lx = e.nativeEvent.locationX;
      const ly = e.nativeEvent.locationY;
      x.value = lx;
      y.value = ly;
      r.value = 0;
      opacity.value = RIPPLE_OPACITY;
      r.value = withTiming(RIPPLE_MAX_R, { duration: RIPPLE_DURATION });
      opacity.value = withTiming(0, { duration: RIPPLE_DURATION });
    },
    [x, y, r, opacity],
  );

  const rippleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: x.value - r.value,
    top: y.value - r.value,
    width: r.value * 2,
    height: r.value * 2,
    borderRadius: r.value,
    backgroundColor: `rgba(255,255,255,${opacity.value})`,
  }));

  return { onPressIn, rippleStyle };
}
