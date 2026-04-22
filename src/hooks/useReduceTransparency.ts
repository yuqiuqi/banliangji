import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * iOS「降低透明度」— 单一权威来源（Phase 11 A11Y-01）。
 */
export function useReduceTransparency(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = (): void => {
      void AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
        if (!cancelled) {
          setValue(enabled);
        }
      });
    };
    sync();
    const sub = AccessibilityInfo.addEventListener("reduceTransparencyChanged", sync);
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return value;
}
