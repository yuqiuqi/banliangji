import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SpringPressable } from "./SpringPressable";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { radii, shadows } from "../theme/layout";
import { formatAmountDisplay } from "../utils/money";

type Operate = "add" | "less" | "del";

type CalcButton =
  | { kind: "num"; v: string }
  | { kind: "op"; op: Operate }
  | { kind: "done" }
  | { kind: "date" };

const GRID: CalcButton[] = [
  { kind: "num", v: "7" },
  { kind: "num", v: "8" },
  { kind: "num", v: "9" },
  { kind: "date" },
  { kind: "num", v: "4" },
  { kind: "num", v: "5" },
  { kind: "num", v: "6" },
  { kind: "op", op: "add" },
  { kind: "num", v: "1" },
  { kind: "num", v: "2" },
  { kind: "num", v: "3" },
  { kind: "op", op: "less" },
  { kind: "num", v: "." },
  { kind: "num", v: "0" },
  { kind: "op", op: "del" },
  { kind: "done" },
];

const GRID_ROWS: CalcButton[][] = [
  GRID.slice(0, 4),
  GRID.slice(4, 8),
  GRID.slice(8, 12),
  GRID.slice(12, 16),
];

const KEY_ROW_GAP = 8;
const KEY_COL_GAP = 8;
/** 与 CreateBillScreen CALCULATOR_OVERLAY_HEIGHT 同步 */
export const BILL_CALCULATOR_CONTENT_HEIGHT =
  52 + 10 + (54 + KEY_ROW_GAP) * 4 - KEY_ROW_GAP + 16;

function labelFor(b: CalcButton, dateLabel: string): string {
  if (b.kind === "num") {
    return b.v;
  }
  if (b.kind === "op") {
    if (b.op === "add") {
      return "+";
    }
    if (b.op === "less") {
      return "-";
    }
    return "";
  }
  if (b.kind === "date") {
    return dateLabel;
  }
  if (b.kind === "done") {
    return "完成";
  }
  return "";
}

function applyBinary(a: number, b: number, op: "add" | "less"): number {
  return op === "add" ? a + b : a - b;
}

function buildCalcStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: "transparent",
    },
    displayRow: {
      minHeight: 52,
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    displayText: {
      fontSize: 28,
      fontWeight: "400",
      textAlign: "right",
      color: colors.title,
    },
    grid: {
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 16,
      gap: KEY_ROW_GAP,
    },
    gridRow: {
      flexDirection: "row",
      gap: KEY_COL_GAP,
    },
    cell: {
      flex: 1,
      height: 54,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radii.card,
      backgroundColor: colors.calculatorKeyBg,
      ...shadows.keyCap,
    },
    cellAccent: {
      backgroundColor: colors.accent,
      ...shadows.keyCapAccent,
    },
    cellText: {
      fontSize: 17,
      fontWeight: "400",
      color: colors.title,
    },
    cellTextDate: {
      fontSize: 13,
      fontWeight: "500",
    },
    cellTextDone: {
      fontWeight: "600",
      color: colors.onAccent,
    },
  });
}

export function BillCalculator({
  visible,
  initialAmount,
  billDateLabel,
  onPickDate,
  onComplete,
}: {
  visible: boolean;
  initialAmount: string;
  billDateLabel: string;
  onPickDate: () => void;
  onComplete: (value: number) => void;
}): React.ReactElement | null {
  const { colors, colorScheme } = useAppTheme();
  const styles = useMemo(() => buildCalcStyles(colors), [colors]);

  const displayRowBg = useMemo(
    () =>
      Platform.select({
        ios: {
          backgroundColor:
            colorScheme === "dark" ? "rgba(60, 60, 67, 0.35)" : "rgba(255, 255, 255, 0.22)",
        },
        default: {
          backgroundColor:
            colorScheme === "dark" ? "rgba(60, 60, 67, 0.45)" : "rgba(255, 255, 255, 0.35)",
        },
      }),
    [colorScheme],
  );

  const [total, setTotal] = useState("0");
  const [preTotal, setPreTotal] = useState("");
  const [operateType, setOperateType] = useState<"add" | "less" | null>(null);

  const resetSoft = useCallback(() => {
    setTotal("0");
    setPreTotal("");
    setOperateType(null);
  }, []);

  React.useEffect(() => {
    if (visible) {
      if (initialAmount !== "" && initialAmount !== "0") {
        setTotal(initialAmount);
        setPreTotal("");
        setOperateType(null);
      } else {
        resetSoft();
      }
    }
  }, [visible, initialAmount, resetSoft]);

  const display = useMemo(() => {
    if (operateType !== null) {
      const opChar = operateType === "add" ? "+" : "-";
      return `${preTotal}${opChar}${total}`;
    }
    return total;
  }, [operateType, preTotal, total]);

  const input = useCallback(
    (num: string) => {
      if (num === "." && total.length === 0) {
        return;
      }
      if (total === "0" && num !== ".") {
        if (num !== "0") {
          setTotal(num);
        }
        return;
      }
      if (total.includes(".")) {
        if (num === ".") {
          return;
        }
        const parts = total.split(".");
        const dec = parts[1];
        if (dec !== undefined && dec.length >= 2) {
          return;
        }
      } else if (total.length >= 8 && num !== ".") {
        return;
      }
      setTotal((t) => t + num);
    },
    [total],
  );

  const onOperate = useCallback(
    (op: Operate) => {
      if (op === "del") {
        if (operateType !== null) {
          if (total === "") {
            setOperateType(null);
            setTotal(preTotal);
          } else {
            setTotal((t) => (t.length <= 1 ? "" : t.slice(0, -1)));
          }
        } else {
          if (total.length <= 1) {
            setTotal("0");
          } else {
            setTotal((t) => t.slice(0, -1));
          }
        }
        return;
      }
      if (op === "add" || op === "less") {
        if (operateType !== null && preTotal !== "" && total !== "") {
          const a = parseFloat(preTotal);
          const b = parseFloat(total);
          if (Number.isFinite(a) && Number.isFinite(b)) {
            const r = formatAmountDisplay(applyBinary(a, b, operateType));
            setPreTotal(r);
            setOperateType(op);
            setTotal("");
            return;
          }
        }
        setPreTotal(total);
        setOperateType(op);
        setTotal("");
      }
    },
    [operateType, preTotal, total],
  );

  const onDone = useCallback(() => {
    if (operateType === null) {
      const n = parseFloat(total);
      if (!Number.isFinite(n) || n === 0) {
        return;
      }
      onComplete(n);
      return;
    }
    const a = parseFloat(preTotal);
    const b = parseFloat(total === "" ? "0" : total);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return;
    }
    const r = formatAmountDisplay(applyBinary(a, b, operateType));
    setOperateType(null);
    setTotal(r);
    setPreTotal("");
  }, [onComplete, operateType, preTotal, total]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.displayRow, displayRowBg]}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.grid}>
        {GRID_ROWS.map((row, ri) => (
          <View key={`row-${ri}`} style={styles.gridRow}>
            {row.map((b, ci) => {
              const isComplete = b.kind === "done";
              const isDate = b.kind === "date";
              return (
                <SpringPressable
                  key={`${ri}-${ci}`}
                  style={[styles.cell, isComplete ? styles.cellAccent : null]}
                  onPress={() => {
                    if (b.kind === "num") {
                      input(b.v);
                    } else if (b.kind === "op") {
                      onOperate(b.op);
                    } else if (b.kind === "date") {
                      onPickDate();
                    } else {
                      onDone();
                    }
                  }}
                >
                  {b.kind === "op" && b.op === "del" ? (
                    <MaterialCommunityIcons name="backspace-outline" size={24} color={colors.title} />
                  ) : isComplete ? (
                    <Text style={[styles.cellText, styles.cellTextDone]}>
                      {operateType !== null ? "=" : "完成"}
                    </Text>
                  ) : (
                    <Text
                      style={[styles.cellText, isDate ? styles.cellTextDate : null]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {labelFor(b, billDateLabel)}
                    </Text>
                  )}
                </SpringPressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
