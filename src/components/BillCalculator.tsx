import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
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
    return "⌫";
  }
  if (b.kind === "date") {
    return dateLabel;
  }
  return "=";
}

function applyBinary(a: number, b: number, op: "add" | "less"): number {
  return op === "add" ? a + b : a - b;
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
      <View style={styles.displayRow}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.grid}>
        {GRID.map((b, i) => {
          const isPrimary = b.kind === "done" || (b.kind === "op" && b.op !== "del");
          return (
            <Pressable
              key={`${i}-${labelFor(b, billDateLabel)}`}
              style={({ pressed }) => [
                styles.cell,
                isPrimary ? styles.cellAccent : null,
                pressed ? styles.pressed : null,
              ]}
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
              <Text style={[styles.cellText, isPrimary ? styles.cellTextDark : null]}>
                {b.kind === "done" && operateType !== null ? "=" : labelFor(b, billDateLabel)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.calculatorBg,
  },
  displayRow: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  displayText: {
    fontSize: 27,
    textAlign: "right",
    color: colors.title,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  cell: {
    width: "25%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.body,
    backgroundColor: colors.light,
  },
  cellAccent: {
    backgroundColor: colors.main,
  },
  cellText: {
    fontSize: 20,
    color: colors.title,
  },
  cellTextDark: {
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
