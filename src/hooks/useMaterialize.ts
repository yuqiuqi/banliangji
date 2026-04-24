/**
 * 进出场三联动（v1.2 §3.12 E3 Materialization）。
 *
 * 用于 Sheet / Modal / Popover / FAB 菜单的出现与消失 ——
 * opacity + scale + blurIntensity 并发驱动，替代普通 fade/slide。
 */
import { useCallback } from "react";
import {
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { FADE_MS, REDUCE_SPRING, SPRING } from "../theme/motion";
import { useReduceMotion } from "./useReduceMotion";

export type UseMaterializeResult = {
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  blurIntensity: SharedValue<number>;
  materialize: () => void;
  dematerialize: () => void;
};

const INITIAL_SCALE = 0.92;
const TARGET_BLUR = 60;

export function useMaterialize(): UseMaterializeResult {
  const reduce = useReduceMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(INITIAL_SCALE);
  const blurIntensity = useSharedValue(0);

  const materialize = useCallback(() => {
    const spring = reduce ? REDUCE_SPRING : SPRING.THUMB;
    opacity.value = withTiming(1, { duration: FADE_MS.normal });
    scale.value = withSpring(1, spring);
    blurIntensity.value = withTiming(TARGET_BLUR, { duration: FADE_MS.normal });
  }, [opacity, scale, blurIntensity, reduce]);

  const dematerialize = useCallback(() => {
    const spring = reduce ? REDUCE_SPRING : SPRING.THUMB;
    opacity.value = withTiming(0, { duration: FADE_MS.fast });
    scale.value = withSpring(INITIAL_SCALE, spring);
    blurIntensity.value = withTiming(0, { duration: FADE_MS.fast });
  }, [opacity, scale, blurIntensity, reduce]);

  return { opacity, scale, blurIntensity, materialize, dematerialize };
}
