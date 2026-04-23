import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryIcon } from "../components/CategoryIcon";
import { GroupedInset } from "../components/ios";
import { SpringPressable } from "../components/SpringPressable";
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
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { radii, shadows } from "../theme/layout";
import { FADE_MS, SPRING } from "../theme/motion";
import {
  chartMonthPeriods,
  chartWeekPeriods,
  chartYearPeriods,
  rangeForChartPeriod,
} from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";
import { addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useReduceMotion } from "../hooks/useReduceMotion";
import { hapticSelect } from "../utils/haptics";

const PAGE_H_PAD = 16;
const CHART_W = Dimensions.get("window").width - 64;

const GRAN_ORDER = ["week", "month", "year"] as const;

function buildChartStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    pageScroll: { paddingBottom: 40 },
    pageTop: { paddingTop: 8 },
    paddedRow: { paddingHorizontal: PAGE_H_PAD },
    segBar: {
      flexDirection: "row",
      backgroundColor: colors.tertiaryFill,
      padding: 6,
      gap: 6,
      borderRadius: radii.chip,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      position: "relative",
    },
    segBtn: { flex: 1, paddingVertical: 8, borderRadius: radii.chip, alignItems: "center" },
    segText: { color: colors.onMain, fontSize: 15 },
    segTextOn: { fontWeight: "600", color: colors.accent },
    tabs: { maxHeight: 52, marginTop: 10 },
    tabsInner: { paddingVertical: 8, alignItems: "center", paddingHorizontal: PAGE_H_PAD },
    tabChip: {
      marginRight: 8,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
    },
    tabChipOn: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSelection,
    },
    tabChipText: { color: colors.lightTitle, fontSize: 13 },
    tabChipTextOn: { color: colors.accent, fontWeight: "600" },
    kpiInner: { padding: 16 },
    kpiLabel: { fontSize: 12, color: colors.lightTitle, marginBottom: 4, letterSpacing: 0.3 },
    kpiValue: { fontSize: 30, fontWeight: "600", color: colors.title },
    kpiHint: { fontSize: 12, color: colors.lightTitle, marginTop: 8 },
    sectionTitle: {
      marginTop: 20,
      marginBottom: 8,
      marginHorizontal: 16,
      fontSize: 15,
      fontWeight: "600",
      color: colors.title,
    },
    sectionTitleSpaced: {
      marginTop: 20,
      marginBottom: 8,
      marginHorizontal: 16,
      fontSize: 15,
      fontWeight: "600",
      color: colors.title,
    },
    trendInner: { padding: 16 },
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
      backgroundColor: colors.divider,
      opacity: 0.85,
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
      backgroundColor: colors.light,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    barOn: { backgroundColor: colors.accent },
    barLabel: { marginTop: 6, fontSize: 10, color: colors.lightTitle, maxWidth: 40, textAlign: "center" },
    listInner: { paddingVertical: 4, paddingHorizontal: 4 },
    catRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8 },
    catRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
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
      backgroundColor: colors.light,
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
}

function ChartGranularitySpringBar({
  granularity,
  onSelect,
  styles,
  colors,
}: {
  granularity: ChartGranularity;
  onSelect: (g: ChartGranularity) => void;
  styles: ReturnType<typeof buildChartStyles>;
  colors: AppPalette;
}): React.ReactElement {
  const reduceMotion = useReduceMotion();
  const layouts = useRef([
    { x: 0, w: 0 },
    { x: 0, w: 0 },
    { x: 0, w: 0 },
  ]);
  const thumbX = useSharedValue(0);
  const thumbW = useSharedValue(0);

  const moveThumb = useCallback(
    (i: number) => {
      const L = layouts.current[i];
      if (L === undefined || L.w <= 0) {
        return;
      }
      if (reduceMotion) {
        thumbX.value = withTiming(L.x, { duration: FADE_MS.fast });
        thumbW.value = withTiming(L.w, { duration: FADE_MS.fast });
      } else {
        thumbX.value = withSpring(L.x, SPRING.THUMB);
        thumbW.value = withSpring(L.w, SPRING.THUMB);
      }
    },
    [reduceMotion],
  );

  const idx = GRAN_ORDER.indexOf(granularity);

  useEffect(() => {
    if (idx >= 0) {
      moveThumb(idx);
    }
  }, [idx, moveThumb]);

  const onSegLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layouts.current[i] = { x, w: width };
    if (GRAN_ORDER[i] === granularity) {
      moveThumb(i);
    }
  };

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
    width: thumbW.value,
  }));

  const thumbShell = useMemo(
    () => ({
      position: "absolute" as const,
      left: 0,
      top: 6,
      bottom: 6,
      backgroundColor: colors.surface,
      borderRadius: radii.chip,
      ...shadows.keyCap,
      zIndex: 0,
    }),
    [colors.surface],
  );

  return (
    <View style={styles.segBar}>
      <Animated.View style={[thumbShell, thumbAnim]} pointerEvents="none" />
      {GRAN_ORDER.map((g, i) => {
        const on = granularity === g;
        const title = g === "week" ? "周" : g === "month" ? "月" : "年";
        return (
          <SpringPressable
            key={g}
            style={[styles.segBtn, { zIndex: 1, backgroundColor: "transparent" }]}
            onLayout={onSegLayout(i)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => {
              if (granularity !== g) {
                hapticSelect();
                onSelect(g);
              }
            }}
          >
            <Text style={[styles.segText, on ? styles.segTextOn : null]}>{title}</Text>
          </SpringPressable>
        );
      })}
    </View>
  );
}

function TrendBar({
  targetHeight,
  index,
  animRevision,
  reduceMotion,
  barStyle,
  barOnStyle,
  hasData,
}: {
  targetHeight: number;
  index: number;
  animRevision: number;
  reduceMotion: boolean;
  barStyle: object;
  barOnStyle: object;
  hasData: boolean;
}): React.ReactElement {
  const h = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(h);
    h.value = 0;
    const full = Math.max(4, targetHeight);
    if (reduceMotion) {
      h.value = full;
      return undefined;
    }
    const capped = Math.min(index, 11);
    const tid = setTimeout(() => {
      h.value = withSpring(full, SPRING.UI);
    }, capped * 30);
    return () => clearTimeout(tid);
  }, [targetHeight, animRevision, reduceMotion, index]);

  const barAnim = useAnimatedStyle(() => ({
    height: h.value,
  }));

  return <Animated.View style={[barStyle, hasData ? barOnStyle : null, barAnim]} />;
}

export function ChartScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildChartStyles(colors), [colors]);
  const reduceMotion = useReduceMotion();
  const { generation } = useBillsRefresh();
  const [granularity, setGranularity] = useState<ChartGranularity>("week");
  const [periodIndex, setPeriodIndex] = useState(0);
  const [barAnimRevision, setBarAnimRevision] = useState(0);

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

  const chartFade = useSharedValue(1);
  const skipChartFade = useRef(true);

  useEffect(() => {
    if (skipChartFade.current) {
      skipChartFade.current = false;
      return;
    }
    chartFade.value = 0;
    chartFade.value = withTiming(1, { duration: FADE_MS.normal });
  }, [granularity, safeIndex]);

  useEffect(() => {
    setBarAnimRevision((r) => r + 1);
  }, [granularity, safeIndex]);

  const chartFadeStyle = useAnimatedStyle(() => ({
    opacity: chartFade.value,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pageScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.pageTop}>
          <View style={styles.paddedRow}>
            <ChartGranularitySpringBar
              granularity={granularity}
              colors={colors}
              styles={styles}
              onSelect={(g) => {
                setGranularity(g);
                setPeriodIndex(0);
              }}
            />
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
                <SpringPressable
                  key={`${p.label}-${i}`}
                  style={[styles.tabChip, on ? styles.tabChipOn : null]}
                  onPress={() => {
                    if (i !== safeIndex) {
                      hapticSelect();
                      setPeriodIndex(i);
                    }
                  }}
                >
                  <Text style={[styles.tabChipText, on ? styles.tabChipTextOn : null]}>{p.label}</Text>
                </SpringPressable>
              );
            })}
          </ScrollView>
          <GroupedInset style={{ marginTop: 16 }}>
            <View style={styles.kpiInner}>
              <Text style={styles.kpiLabel}>本期支出</Text>
              <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                ¥{formatAmountDisplay(periodTotal)}
              </Text>
              <Text style={styles.kpiHint}>{labelP} · 仅统计支出</Text>
            </View>
          </GroupedInset>
          <Text style={styles.sectionTitle}>支出趋势</Text>
          <GroupedInset>
            <View style={styles.trendInner}>
              <Text style={styles.cardRange}>{rangeHint}</Text>
              <Text style={styles.cardSubtitle}>
                与下方「分类构成」同一筛选；柱高为区间内相对值
              </Text>
              <Animated.View style={chartFadeStyle}>
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
                          <TrendBar
                            targetHeight={h}
                            index={idx}
                            animRevision={barAnimRevision}
                            reduceMotion={reduceMotion}
                            barStyle={styles.bar}
                            barOnStyle={styles.barOn}
                            hasData={pt.hasData}
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
          </GroupedInset>
          <Text style={styles.sectionTitleSpaced}>分类构成</Text>
          <GroupedInset>
            <View style={styles.listInner}>
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
          </GroupedInset>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
