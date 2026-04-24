/**
 * 监听系统「减少动画」开关（iOS 设置 → 辅助功能 → 动画）。
 * 对齐 `.planning/IOS26-DESIGN-GUIDE.md` §11.9。
 */
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduce(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduce;
}
