import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryIcon } from "../components/CategoryIcon";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import {
  aggregateExpenseByCategory,
  chartPointsWeekOrMonth,
  chartPointsYear,
  filterExpense,
} from "../chart/chartAggregate";
import { queryAllBills } from "../db/billRepo";
import type { ChartGranularity } from "../types/models";
import { colors } from "../theme/colors";
import { chartFadeMs, hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import {
  chartMonthPeriods,
  chartWeekPeriods,
  chartYearPeriods,
  rangeForChartPeriod,
} from "../utils/dates";
import { formatAmountDisplay } from "../utils/money";
import { addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";

const CHART_W = Dimensions.get("window").width - 32;

export function ChartScreen(): React.ReactElement {
  const { generation } = useBillsRefresh();
  const [granularity, setGranularity] = useState<ChartGranularity>("week");
  const [periodIndex, setPeriodIndex] = useState(0);

  const allBills = useMemo(() => queryAllBills(), [generation]);
  const expenseAll = useMemo(() => filterExpense(allBills), [allBills]);

  const bounds = useMemo(() => {
    if (expenseAll.length === 0) {
      const n = new Date();
      return { first: n, last: n };
    }
    const times = expenseAll
      .map((b) => b.billTime)
      .filter((t): t is number => t !== null && t !== undefined);
    const min = Math.min(...times);
    const max = Math.max(...times);
    return { first: new Date(min * 1000), last: new Date(max * 1000) };
  }, [expenseAll]);

  const periods = useMemo(() => {
    if (granularity === "week") {
      return chartWeekPeriods(bounds.first, bounds.last);
    }
    if (granularity === "month") {
      return chartMonthPeriods(bounds.first, bounds.last);
    }
    return chartYearPeriods(bounds.first, bounds.last);
  }, [bounds.first, bounds.last, granularity]);

  const safeIndex = Math.min(periodIndex, Math.max(0, periods.length - 1));
  const period = periods[safeIndex];
  const startP = period?.start ?? new Date();
  const labelP = period?.label ?? "";

  const range = useMemo(
    () => rangeForChartPeriod(startP, granularity),
    [granularity, startP],
  );

  const billsInRange = useMemo(() => {
    const s = range.start.getTime() / 1000;
    const e = range.endExclusive.getTime() / 1000;
    return expenseAll.filter((b) => {
      const t = b.billTime;
      if (t === null || t === undefined) {
        return false;
      }
      return t >= s && t < e;
    });
  }, [expenseAll, range.endExclusive, range.start]);

  const categories = useMemo(() => aggregateExpenseByCategory(billsInRange), [billsInRange]);

  const points = useMemo(() => {
    if (granularity === "year") {
      return chartPointsYear(startP, billsInRange);
    }
    return chartPointsWeekOrMonth(
      range.start,
      range.endExclusive,
      billsInRange,
      granularity === "week",
    );
  }, [billsInRange, granularity, range.endExclusive, range.start, startP]);

  const maxAmount = useMemo(
    () => points.reduce((m, p) => (p.amount > m ? p.amount : m), 0),
    [points],
  );

  const rangeHint = useMemo(() => {
    const a = range.start;
    const b = addDays(range.endExclusive, -1);
    if (granularity === "year") {
      return `${a.getFullYear()}年`;
    }
    return `${format(a, "M月d日", { locale: zhCN })} — ${format(b, "M月d日", { locale: zhCN })}`;
  }, [granularity, range.endExclusive, range.start]);

  const chartEmpty = maxAmount <= 0;

  const chartOpacity = useRef(new Animated.Value(1)).current;
  const skipChartFade = useRef(true);

  useEffect(() => {
    if (skipChartFade.current) {
      skipChartFade.current = false;
      return;
    }
    chartOpacity.setValue(0);
    const id = requestAnimationFrame(() => {
      Animated.timing(chartOpacity, {
        toValue: 1,
        duration: chartFadeMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      cancelAnimationFrame(id);
    };
  }, [granularity, safeIndex]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.segBar}>
        {(["week", "month", "year"] as const).map((g) => {
          const on = granularity === g;
          const title = g === "week" ? "周" : g === "month" ? "月" : "年";
          return (
            <Pressable
              key={g}
              style={({ pressed }) => [
                styles.segBtn,
                on ? styles.segOn : null,
                pressed ? { opacity: pressedOpacity } : null,
              ]}
              onPress={() => {
                setGranularity(g);
                setPeriodIndex(0);
              }}
            >
              <Text style={[styles.segText, on ? styles.segTextOn : null]}>{title}</Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {periods.map((p, i) => {
          const on = i === safeIndex;
          return (
            <Pressable
              key={`${p.label}-${i}`}
              style={({ pressed }) => [
                styles.tabChip,
                on ? styles.tabChipOn : null,
                pressed ? { opacity: pressedOpacity } : null,
              ]}
              onPress={() => {
                setPeriodIndex(i);
              }}
            >
              <Text style={[styles.tabChipText, on ? styles.tabChipTextOn : null]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.card, shadows.raised]}>
        <Text style={styles.cardTitle}>
          {labelP} · 支出分布
        </Text>
        <Text style={styles.cardSubtitle}>仅统计支出 · 与下方分类列表同一筛选范围</Text>
        <Text style={styles.cardRange}>{rangeHint}</Text>
        <Animated.View style={{ opacity: chartOpacity }}>
          {chartEmpty ? (
            <Text style={styles.chartEmpty}>该时间段暂无支出记录</Text>
          ) : null}
          <View style={styles.chartRow}>
            {points.map((pt, idx) => {
              const h = maxAmount > 0 ? (pt.amount / maxAmount) * 120 : 0;
              return (
                <View key={`${pt.label}-${idx}`} style={styles.barCol}>
                  <View
                    style={[styles.bar, { height: Math.max(4, h) }, pt.hasData ? styles.barOn : null]}
                  />
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {pt.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </View>
      <View style={styles.list}>
        {categories.map((c) => (
          <View key={c.categoryId} style={styles.catRow}>
            <CategoryIcon categoryId={c.categoryId} />
            <View style={styles.catMid}>
              <Text style={styles.catName}>{c.name}</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFg, { width: `${Math.round(c.ratio * 100)}%` }]} />
              </View>
            </View>
            <Text style={styles.catAmt}>{formatAmountDisplay(c.amount)}</Text>
          </View>
        ))}
        {categories.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>本区间暂无支出</Text>
            <Text style={styles.emptyHint}>切换周/月/年或左右滑动选择其他区间</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  segBar: {
    flexDirection: "row",
    backgroundColor: colors.main,
    padding: 10,
    gap: 8,
    borderRadius: radii.chip,
  },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radii.chip, alignItems: "center" },
  segOn: { backgroundColor: "rgba(255,255,255,0.35)" },
  segText: { color: colors.title, fontSize: 15 },
  segTextOn: { fontWeight: "700" },
  tabs: { maxHeight: 48, backgroundColor: colors.light, paddingVertical: 8 },
  tabChip: {
    marginHorizontal: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.body,
  },
  tabChipOn: { borderColor: colors.title, backgroundColor: colors.main },
  tabChipText: { color: colors.lightTitle, fontSize: 13 },
  tabChipTextOn: { color: colors.title, fontWeight: "600" },
  card: {
    margin: 16,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    ...hairlineBorder,
  },
  cardTitle: { marginBottom: 4, fontSize: 15, fontWeight: "600", color: colors.title },
  cardSubtitle: { fontSize: 12, color: colors.lightTitle, marginBottom: 4 },
  cardRange: { fontSize: 11, color: colors.onMainSecondary, marginBottom: 8 },
  chartEmpty: {
    fontSize: 13,
    color: colors.lightTitle,
    textAlign: "center",
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 140,
    width: CHART_W,
    justifyContent: "space-between",
  },
  barCol: { flex: 1, alignItems: "center", marginHorizontal: 2 },
  bar: { width: 11, backgroundColor: colors.body, borderRadius: 6 },
  barOn: { backgroundColor: colors.title },
  barLabel: { marginTop: 6, fontSize: 10, color: colors.lightTitle, maxWidth: 36, textAlign: "center" },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  catRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  catMid: { flex: 1, marginLeft: 10 },
  catName: { fontSize: 15, fontWeight: "500", color: colors.title },
  progressBg: {
    height: 8,
    backgroundColor: colors.body,
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFg: { height: 8, backgroundColor: colors.main },
  catAmt: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: colors.title,
    minWidth: 72,
    textAlign: "right",
  },
  emptyWrap: { marginTop: 24, paddingHorizontal: 8 },
  empty: { textAlign: "center", color: colors.title, fontSize: 15, fontWeight: "500" },
  emptyHint: { textAlign: "center", color: colors.lightTitle, fontSize: 12, marginTop: 8 },
});
