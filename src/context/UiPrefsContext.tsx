import React, { createContext, useContext, useMemo, useState } from "react";

type UiPrefs = {
  /** 图表页：根据重力/加速度计微调柱图透视（可关） */
  chartMotionEnabled: boolean;
  setChartMotionEnabled: (v: boolean) => void;
};

const Ctx = createContext<UiPrefs | null>(null);

export function UiPrefsProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [chartMotionEnabled, setChartMotionEnabled] = useState(true);
  const value = useMemo(
    () => ({ chartMotionEnabled, setChartMotionEnabled }),
    [chartMotionEnabled],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUiPrefs(): UiPrefs {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useUiPrefs must be used within UiPrefsProvider");
  }
  return v;
}
