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
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { formatAmountDisplay, parseAmount } from "../utils/money";
import { addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";

const PAGE_H_PAD = 16;
const CHART_W = Dimensions.get("window").width - PAGE_H_PAD * 2;

/** 与 `colors.accent` #4A8B6A 一致的半透明选态，禁止硬编码天蓝 */
const ACCENT_FILL_12 = "rgba(74, 139, 106, 0.12)";
const ACCENT_FILL_16 = "rgba(74, 139, 106, 0.16)";

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

  const periodTotal = useMemo(
    () => billsInRange.reduce((s, b) => s + parseAmount(b.amount), 0),
    [billsInRange],
  );

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
      <ScrollView
        contentContainerStyle={styles.pageScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.pagePad}>
          <View style={[styles.segBar, shadows.card, hairlineBorder]}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabs}
            contentContainerStyle={styles.tabsInner}
            nestedScrollEnabled
          >
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
          <View style={[styles.kpiCard, shadows.raised, hairlineBorder]}>
            <Text style={styles.kpiLabel}>本期支出</Text>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
              ¥{formatAmountDisplay(periodTotal)}
            </Text>
            <Text style={styles.kpiHint}>{labelP} · 仅统计支出</Text>
          </View>
          <Text style={styles.sectionTitle}>支出趋势</Text>
          <View style={[styles.trendCard, shadows.raised, hairlineBorder]}>
            <Text style={styles.cardRange}>{rangeHint}</Text>
            <Text style={styles.cardSubtitle}>
              与下方「分类构成」同一筛选；柱高为区间内相对值
            </Text>
            <Animated.View style={{ opacity: chartOpacity }}>
              {chartEmpty ? (
                <View style={styles.chartEmptyBlock}>
                  <MaterialCommunityIcons name="chart-timeline-variant" size={36} color={colors.lightTitle} />
                  <Text style={styles.chartEmpty}>该时间段暂无支出记录</Text>
                </View>
              ) : null}
              <View style={styles.chartPlot}>
                <View style={styles.chartBaseline} />
                <View style={styles.chartRow}>
                  {points.map((pt, idx) => {
                    const h = maxAmount > 0 ? (pt.amount / maxAmount) * 132 : 0;
                    return (
                      <View key={`${pt.label}-${idx}`} style={styles.barCol}>
                        <View
                          style={[
                            styles.bar,
                            { height: Math.max(4, h) },
                            pt.hasData ? styles.barOn : null,
                          ]}
                        />
                        <Text style={styles.barLabel} numberOfLines={1}>
                          {pt.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          </View>
          <Text style={styles.sectionTitleSpaced}>分类构成</Text>
          <View style={[styles.listCard, shadows.card, hairlineBorder]}>
            {categories.map((c, i) => (
              <View
                key={c.categoryId}
                style={[
                  styles.catRow,
                  i < categories.length - 1 ? styles.catRowBorder : null,
                ]}
              >
                <View style={styles.iconRim}>
                  <CategoryIcon categoryId={c.categoryId} />
                </View>
                <View style={styles.catMid}>
                  <Text style={styles.catName}>{c.name}</Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFg, { width: `${Math.round(c.ratio * 100)}%` }]} />
                  </View>
                </View>
                <Text style={styles.catAmt}>¥{formatAmountDisplay(c.amount)}</Text>
              </View>
            ))}
            {categories.length === 0 ? (
              <View style={styles.emptyWrap}>
                <MaterialCommunityIcons name="chart-donut" size={40} color={colors.lightTitle} />
                <Text style={styles.empty}>本区间暂无支出</Text>
                <Text style={styles.emptyHint}>切换周/月/年或选择其他周期试试</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  pageScroll: { paddingBottom: 40 },
  pagePad: { paddingHorizontal: PAGE_H_PAD, paddingTop: 8 },
  segBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    padding: 8,
    gap: 8,
    borderRadius: radii.chip,
  },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radii.chip, alignItems: "center" },
  segOn: { backgroundColor: ACCENT_FILL_16 },
  segText: { color: colors.onMain, fontSize: 15 },
  segTextOn: { fontWeight: "700", color: colors.accent },
  tabs: { maxHeight: 52, marginTop: 10 },
  tabsInner: { paddingVertical: 8, alignItems: "center" },
  tabChip: {
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.body,
  },
  tabChipOn: { borderColor: colors.accent, backgroundColor: ACCENT_FILL_12 },
  tabChipText: { color: colors.lightTitle, fontSize: 13 },
  tabChipTextOn: { color: colors.accent, fontWeight: "600" },
  kpiCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
  kpiLabel: { fontSize: 12, color: colors.lightTitle, marginBottom: 4, letterSpacing: 0.3 },
  kpiValue: { fontSize: 30, fontWeight: "700", color: colors.title },
  kpiHint: { fontSize: 12, color: colors.lightTitle, marginTop: 8 },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "600",
    color: colors.title,
  },
  sectionTitleSpaced: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "600",
    color: colors.title,
  },
  trendCard: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
  cardSubtitle: { fontSize: 12, color: colors.lightTitle, marginTop: 4, lineHeight: 17 },
  cardRange: { fontSize: 13, color: colors.title, fontWeight: "500" },
  chartEmptyBlock: { alignItems: "center", paddingVertical: 12 },
  chartEmpty: {
    fontSize: 13,
    color: colors.lightTitle,
    textAlign: "center",
    marginTop: 8,
  },
  chartPlot: {
    marginTop: 12,
    position: "relative",
  },
  chartBaseline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.body,
    opacity: 0.9,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 152,
    width: CHART_W,
    justifyContent: "space-between",
  },
  barCol: { flex: 1, alignItems: "center", marginHorizontal: 1 },
  bar: {
    width: 12,
    backgroundColor: colors.body,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barOn: { backgroundColor: colors.accent },
  barLabel: { marginTop: 6, fontSize: 10, color: colors.lightTitle, maxWidth: 40, textAlign: "center" },
  listCard: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginBottom: 8,
  },
  catRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8 },
  catRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.body,
  },
  iconRim: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  catMid: { flex: 1, marginLeft: 12 },
  catName: { fontSize: 15, fontWeight: "500", color: colors.title },
  progressBg: {
    height: 6,
    backgroundColor: colors.body,
    borderRadius: 3,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFg: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  catAmt: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: colors.title,
    minWidth: 80,
    textAlign: "right",
  },
  emptyWrap: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 12 },
  empty: { textAlign: "center", color: colors.title, fontSize: 15, fontWeight: "500", marginTop: 10 },
  emptyHint: { textAlign: "center", color: colors.lightTitle, fontSize: 12, marginTop: 8, lineHeight: 18 },
});
