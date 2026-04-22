import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryIcon } from "../components/CategoryIcon";
import { GroupedInset, SegmentedTwo } from "../components/ios";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { queryBillsForCalendarDay, queryBillsInRange } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { Bill } from "../types/models";
import { colors } from "../theme/colors";
import { hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import { getRangeFromInclusiveStartEndDay } from "../utils/billTimeRange";
import { formatTimeShort } from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";

type Mode = "day" | "range";

export function BillQueryScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { generation, refresh } = useBillsRefresh();
  const [mode, setMode] = useState<Mode>("day");
  const [dayAnchor, setDayAnchor] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  });
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [iosOpen, setIosOpen] = useState(false);
  const [iosField, setIosField] = useState<"day" | "start" | "end">("day");

  const bills: Bill[] = useMemo(() => {
    if (mode === "day") {
      return queryBillsForCalendarDay(dayAnchor);
    }
    if (rangeStart !== null && rangeEnd !== null) {
      try {
        const { startSec, endSecExclusive } = getRangeFromInclusiveStartEndDay(rangeStart, rangeEnd);
        return queryBillsInRange(startSec, endSecExclusive);
      } catch {
        return [];
      }
    }
    return [];
  }, [mode, dayAnchor, rangeStart, rangeEnd, generation]);

  useEffect(() => {
    if (mode !== "range" || rangeStart === null || rangeEnd === null) {
      setRangeError(null);
      return;
    }
    try {
      getRangeFromInclusiveStartEndDay(rangeStart, rangeEnd);
      setRangeError(null);
    } catch (e) {
      setRangeError(e instanceof Error ? e.message : String(e));
    }
  }, [mode, rangeStart, rangeEnd]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const showPickerAndroid = useCallback(
    (field: "day" | "start" | "end", value: Date) => {
      DateTimePickerAndroid.open({
        value,
        mode: "date",
        onChange: (_e, date) => {
          if (date === undefined) {
            return;
          }
          if (field === "day") {
            setDayAnchor(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
          } else if (field === "start") {
            setRangeStart(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
          } else {
            setRangeEnd(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
          }
        },
      });
    },
    [],
  );

  const openDateField = useCallback(
    (field: "day" | "start" | "end") => {
      if (Platform.OS === "android") {
        if (field === "day") {
          showPickerAndroid("day", dayAnchor);
        } else if (field === "start") {
          showPickerAndroid("start", rangeStart ?? new Date());
        } else {
          showPickerAndroid("end", rangeEnd ?? new Date());
        }
        return;
      }
      setIosField(field);
      setIosOpen(true);
    },
    [dayAnchor, rangeEnd, rangeStart, showPickerAndroid],
  );

  const onIosChange = useCallback(
    (date: Date | undefined) => {
      if (date === undefined) {
        return;
      }
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (iosField === "day") {
        setDayAnchor(d);
      } else if (iosField === "start") {
        setRangeStart(d);
      } else {
        setRangeEnd(d);
      }
    },
    [iosField],
  );

  const renderItem = useCallback(
    ({ item }: { item: Bill }) => {
      const t = item.billTime;
      const timeLabel = t === null || t === undefined ? "" : formatTimeShort(new Date(t * 1000));
      const isExpense = item.type === 1;
      const prefix = isExpense ? "-" : "+";
      return (
        <Pressable
          style={({ pressed }) => [styles.row, pressed ? { opacity: pressedOpacity } : null]}
          onPress={() => {
            navigation.navigate("BillDetail", { billId: item.id });
          }}
        >
          <CategoryIcon categoryId={item.categoryId} size={36} />
          <View style={styles.rowMid}>
            <Text style={styles.rowTitle}>{item.name ?? "未分类"}</Text>
            <Text style={styles.rowSub}>{timeLabel}</Text>
          </View>
          <Text style={[styles.rowAmt, isExpense ? styles.expense : styles.income]}>
            {prefix}
            {formatAmountDisplay(parseAmount(item.amount))}
          </Text>
        </Pressable>
      );
    },
    [navigation],
  );

  const rangeHint =
    mode === "range" && (rangeStart === null || rangeEnd === null) ? (
      <Text style={styles.hint}>请在下方的日期里选择区段的开始与结束（区间模式）</Text>
    ) : null;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <SegmentedTwo
        leftLabel="单日"
        rightLabel="区间"
        value={mode === "day" ? 0 : 1}
        style={styles.segmentWrap}
        onChange={(v) => {
          setMode(v === 0 ? "day" : "range");
          setRangeError(null);
        }}
      />

      {mode === "day" ? (
        <Pressable
          style={({ pressed }) => [styles.dateBar, pressed ? { opacity: pressedOpacity } : null]}
          onPress={() => {
            openDateField("day");
          }}
        >
          <Text style={styles.dateBarLabel}>查看日期</Text>
          <Text style={styles.dateBarValue}>
            {dayAnchor.getFullYear()}年{dayAnchor.getMonth() + 1}月{dayAnchor.getDate()}日
          </Text>
        </Pressable>
      ) : (
        <View style={styles.rangeRow}>
          <Pressable
            style={({ pressed }) => [styles.dateHalf, pressed ? { opacity: pressedOpacity } : null]}
            onPress={() => {
              setRangeError(null);
              openDateField("start");
            }}
          >
            <Text style={styles.rangeSmall}>开始日</Text>
            <Text style={styles.rangeVal}>
              {rangeStart
                ? `${rangeStart.getFullYear()}-${String(rangeStart.getMonth() + 1).padStart(2, "0")}-${String(rangeStart.getDate()).padStart(2, "0")}`
                : "点选日期"}
            </Text>
          </Pressable>
          <Text style={styles.rangeDash}>—</Text>
          <Pressable
            style={({ pressed }) => [styles.dateHalf, pressed ? { opacity: pressedOpacity } : null]}
            onPress={() => {
              setRangeError(null);
              openDateField("end");
            }}
          >
            <Text style={styles.rangeSmall}>结束日</Text>
            <Text style={styles.rangeVal}>
              {rangeEnd
                ? `${rangeEnd.getFullYear()}-${String(rangeEnd.getMonth() + 1).padStart(2, "0")}-${String(rangeEnd.getDate()).padStart(2, "0")}`
                : "点选日期"}
            </Text>
          </Pressable>
        </View>
      )}

      {rangeHint}
      {rangeError !== null ? <Text style={styles.errText}>{rangeError}</Text> : null}

      <GroupedInset style={styles.listInset}>
        <FlatList
          data={bills}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {mode === "range" && (rangeStart === null || rangeEnd === null)
                  ? "请选择日期区间以查看账单"
                  : "该条件下暂无账单"}
              </Text>
            </View>
          }
        />
      </GroupedInset>
      {Platform.OS === "ios" && iosOpen ? (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerToolbar}>
              <Pressable
                onPress={() => {
                  setIosOpen(false);
                }}
                style={({ pressed }) => [pressed ? { opacity: pressedOpacity } : null]}
              >
                <Text style={styles.pickerDone}>完成</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={
                iosField === "day"
                  ? dayAnchor
                  : iosField === "start"
                    ? (rangeStart ?? new Date())
                    : (rangeEnd ?? new Date())
              }
              mode="date"
              display="spinner"
              onChange={(_e, d) => {
                onIosChange(d);
              }}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  segmentWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  dateBar: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...hairlineBorder,
    ...shadows.card,
  },
  dateBarLabel: { color: colors.lightTitle, fontSize: 14 },
  dateBarValue: { color: colors.title, fontSize: 16, fontWeight: "500" },
  rangeRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  rangeDash: { marginHorizontal: 4, color: colors.lightTitle },
  dateHalf: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    ...hairlineBorder,
  },
  rangeSmall: { fontSize: 11, color: colors.lightTitle },
  rangeVal: { fontSize: 15, color: colors.title, marginTop: 4, fontWeight: "500" },
  hint: { marginHorizontal: 16, marginBottom: 4, color: colors.lightTitle, fontSize: 13 },
  errText: { marginHorizontal: 16, color: colors.title, fontSize: 14 },
  listInset: {
    flex: 1,
    marginBottom: 16,
    marginTop: 4,
    ...shadows.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.body,
  },
  rowMid: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 16, color: colors.title },
  rowSub: { fontSize: 12, color: colors.lightTitle, marginTop: 4 },
  rowAmt: { fontSize: 16, fontWeight: "500" },
  expense: { color: colors.expense },
  income: { color: colors.income },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { color: colors.lightTitle, textAlign: "center" },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  pickerCard: { backgroundColor: colors.surface, paddingBottom: 24 },
  pickerToolbar: { alignItems: "flex-end", padding: 12 },
  pickerDone: { color: colors.accent, fontSize: 17, fontWeight: "600" },
});
