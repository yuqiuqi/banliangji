import { Accelerometer } from "expo-sensors";
import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useReduceMotion } from "./useReduceMotion";

const TILT_SPRING = { damping: 22, stiffness: 140, mass: 0.85 };
const MAX_DEG = 6;

/**
 * 用加速度计近似「持机倾斜」透视（比陀螺积分更稳、更省）。
 * 关闭或「减少动态效果」时不订阅传感器。
 */
export function useDeviceTilt(enabled: boolean): {
  chartStyle: ReturnType<typeof useAnimatedStyle>;
} {
  const reduce = useReduceMotion();
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);

  useEffect(() => {
    if (!enabled || reduce) {
      rx.value = withSpring(0, TILT_SPRING);
      ry.value = withSpring(0, TILT_SPRING);
      return;
    }

    let subscription: { remove: () => void } | undefined;
    let cancelled = false;

    void (async () => {
      const ok = await Accelerometer.isAvailableAsync();
      if (cancelled || !ok) {
        return;
      }
      Accelerometer.setUpdateInterval(90);
      subscription = Accelerometer.addListener(({ x, y }) => {
        const nx = Math.max(-MAX_DEG, Math.min(MAX_DEG, y * 12));
        const ny = Math.max(-MAX_DEG, Math.min(MAX_DEG, -x * 12));
        rx.value = withSpring(nx, TILT_SPRING);
        ry.value = withSpring(ny, TILT_SPRING);
      });
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
      rx.value = withSpring(0, TILT_SPRING);
      ry.value = withSpring(0, TILT_SPRING);
    };
  }, [enabled, reduce]);

  const chartStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 520 },
      { rotateX: `${rx.value}deg` },
      { rotateY: `${ry.value}deg` },
    ],
  }));

  return { chartStyle };
}
