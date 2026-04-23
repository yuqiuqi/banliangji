import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * System "Reduce motion" — use for stagger/sheet/press degradations (MOT-01).
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (!cancelled) {
        setReduceMotion(v);
      }
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => {
      setReduceMotion(v);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
