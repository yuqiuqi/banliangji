import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Reanimated from "react-native-reanimated";
import { CategoryIcon } from "../components/CategoryIcon";
import { GlassEffectContainer, GroupedInset } from "../components/ios";
import { SpringPressable } from "../components/SpringPressable";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { useUiPrefs } from "../context/UiPrefsContext";
import { useDeviceTilt } from "../hooks/useDeviceTilt";
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
import { chartFadeMs, radii, shadows } from "../theme/layout";
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
/** GroupedInset 左右 margin + 卡内左右 padding 各 16 */
const CHART_W = Dimensions.get("window").width - 64;

/** 周/月/年为三档，SegmentedTwo 仅两档，故保留 chip 行；选态底色用 palette.accentSelection。 */
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
    },
    segBtn: { flex: 1, paddingVertical: 8, borderRadius: radii.chip, alignItems: "center" },
    segOn: { backgroundColor: colors.accentSelection },
    segText: { color: colors.onMain, fontSize: 15 },
    segTextOn: { fontWeight: "700", color: colors.accent },
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
    kpiValue: { fontSize: 30, fontWeight: "700", color: colors.title },
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
      width: 14,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
      overflow: "hidden",
      backgroundColor: colors.light,
    },
    barShadow: {
      shadowColor: colors.expense,
      shadowOpacity: 0.38,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    barFill: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
    },
    barHighlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: "rgba(255,255,255,0.65)",
    },
    barRim: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.22)",
    },
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
    progressFg: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressHighlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: "rgba(255,255,255,0.45)",
    },
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

export function ChartScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildChartStyles(colors), [colors]);
  const { chartMotionEnabled } = useUiPrefs();
  const { chartStyle } = useDeviceTilt(chartMotionEnabled);
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
        <View style={styles.pageTop}>
          <View style={styles.paddedRow}>
            <View style={styles.segBar}>
            {(["week", "month", "year"] as const).map((g) => {
              const on = granularity === g;
              const title = g === "week" ? "周" : g === "month" ? "月" : "年";
              return (
                <SpringPressable
                  key={g}
                  style={[styles.segBtn, on ? styles.segOn : null]}
                  hapticOn="pressIn"
                  hapticIntensity="select"
                  scaleTo={0.96}
                  opacityTo={0.96}
                  onPress={() => {
                    setGranularity(g);
                    setPeriodIndex(0);
                  }}
                >
                  <Text style={[styles.segText, on ? styles.segTextOn : null]}>{title}</Text>
                </SpringPressable>
              );
            })}
            </View>
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
                  hapticOn="pressIn"
                  hapticIntensity="select"
                  scaleTo={0.96}
                  opacityTo={0.96}
                  onPress={() => {
                    setPeriodIndex(i);
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
              <Reanimated.View style={chartStyle}>
                <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                  ¥{formatAmountDisplay(periodTotal)}
                </Text>
              </Reanimated.View>
              <Text style={styles.kpiHint}>{labelP} · 仅统计支出</Text>
            </View>
          </GroupedInset>
          <Text style={styles.sectionTitle}>支出趋势</Text>
          <View style={[{ marginHorizontal: 16, borderRadius: radii.card }, shadows.grouped]}>
            <GlassEffectContainer intensity={58} borderRadius={radii.card} style={{ borderRadius: radii.card }}>
              <View style={styles.trendInner}>
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
                  <Reanimated.View style={chartStyle}>
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
                                  pt.hasData ? styles.barShadow : null,
                                ]}
                              >
                                {pt.hasData ? (
                                  <>
                                    <LinearGradient
                                      colors={[colors.expense, "rgba(255,59,48,0.45)"]}
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 0.35, y: 1 }}
                                      style={styles.barFill}
                                    />
                                    <View style={styles.barHighlight} />
                                    <View style={styles.barRim} pointerEvents="none" />
                                  </>
                                ) : null}
                              </View>
                              <Text style={styles.barLabel} numberOfLines={1}>
                                {pt.label}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </Reanimated.View>
                </Animated.View>
              </View>
            </GlassEffectContainer>
          </View>
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
                      <View style={[styles.progressFg, { width: `${Math.round(c.ratio * 100)}%` }]}>
                        <LinearGradient
                          colors={[colors.expense, "rgba(255,59,48,0.55)"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.progressHighlight} />
                      </View>
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
