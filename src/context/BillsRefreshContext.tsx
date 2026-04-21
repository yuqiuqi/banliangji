import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type BillsRefreshValue = {
  generation: number;
  refresh: () => void;
};

const BillsRefreshContext = createContext<BillsRefreshValue | null>(null);

export function BillsRefreshProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [generation, setGeneration] = useState(0);
  const refresh = useCallback(() => {
    setGeneration((g) => g + 1);
  }, []);
  const value = useMemo((): BillsRefreshValue => ({ generation, refresh }), [generation, refresh]);
  return <BillsRefreshContext.Provider value={value}>{children}</BillsRefreshContext.Provider>;
}

export function useBillsRefresh(): BillsRefreshValue {
  const ctx = useContext(BillsRefreshContext);
  if (ctx === null) {
    throw new Error("useBillsRefresh must be used within BillsRefreshProvider");
  }
  return ctx;
}
