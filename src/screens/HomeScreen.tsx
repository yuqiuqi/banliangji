import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Platform, SectionList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CategoryIcon } from "../components/CategoryIcon";
import { SpringPressable } from "../components/SpringPressable";
import { GroupedInset } from "../components/ios";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { groupBillsByDayKey, queryBillsForMonth } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { AppPalette } from "../theme/palette";
import { useReduceMotion } from "../hooks/useReduceMotion";
import { useAppTheme } from "../theme/ThemeContext";
import { headerFabIconSize, headerFabSize, listContentInset, shadows } from "../theme/layout";
import { iosType } from "../theme/typography";
import type { Bill } from "../types/models";
import {
  formatHeaderMonth,
  formatHeaderYear,
  formatSectionTitleFromKey,
  formatTimeShort,
} from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";

const LIST_STAGGER_MAX = 12;

type Section = { title: string; data: Bill[] };

function buildHomeScreenStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    listInset: {
      flex: 1,
      marginTop: 8,
      marginBottom: 16,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerChip: {
      width: headerFabSize,
      height: headerFabSize,
      borderRadius: headerFabSize / 2,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
    },
    headerChipWash: {
      backgroundColor: colors.surface,
      borderColor: "rgba(255, 255, 255, 0.65)",
      ...shadows.headerIconWash,
    },
    headerChipAccent: {
      backgroundColor: colors.accent,
      borderColor: "rgba(255, 255, 255, 0.38)",
      ...shadows.headerFab,
    },
    headerBanner: {
      flexDirection: "row",
      backgroundColor: colors.main,
      minHeight: 72,
      alignItems: "stretch",
    },
    headerLeft: {
      width: 110,
      paddingLeft: listContentInset,
      paddingVertical: 8,
      justifyContent: "center",
    },
    yearText: { fontSize: 10, color: colors.onMainSecondary },
    monthRow: { flexDirection: "row", alignItems: "flex-end" },
    monthBig: { fontSize: 30, fontWeight: "300", color: colors.onMain },
    headerDivider: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginVertical: 12,
    },
    headerRight: { flex: 1, flexDirection: "row", paddingLeft: 24, alignItems: "center" },
    statCol: { marginRight: 32 },
    statLabel: { fontSize: 10, color: colors.onMainSecondary },
    statValue: { ...iosType.body, fontWeight: "300", color: colors.onMain, marginTop: 4 },
    sectionHead: {
      backgroundColor: colors.light,
      paddingHorizontal: listContentInset,
      paddingVertical: 8,
    },
    sectionTitle: { ...iosType.footnote, color: colors.lightTitle },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: listContentInset,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      backgroundColor: colors.surface,
    },
    rowMid: { flex: 1, marginLeft: 12 },
    rowTitle: { fontSize: 16, color: colors.title },
    rowSub: { fontSize: 12, color: colors.lightTitle, marginTop: 4 },
    rowAmt: { fontSize: 16, fontWeight: "500" },
    expense: { color: colors.expense },
    income: { color: colors.income },
    empty: { padding: 40, alignItems: "center" },
    emptyText: { ...iosType.caption1, color: colors.lightTitle, textAlign: "center" },
    emptyCta: { marginTop: 16, ...iosType.body, fontWeight: "600", color: colors.accent },
    pickerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "flex-end",
    },
    pickerCard: { backgroundColor: colors.surface, paddingBottom: 24 },
    pickerToolbar: { alignItems: "flex-end", padding: 12 },
    pickerDone: { color: colors.accent, fontSize: 17, fontWeight: "600" },
  });
}

export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const reduceMotion = useReduceMotion();
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildHomeScreenStyles(colors), [colors]);
  const { generation, refresh } = useBillsRefresh();
  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <SpringPressable
            onPress={() => {
              navigation.navigate("BillQuery");
            }}
            hitSlop={8}
            accessibilityLabel="查账-打开账单"
            style={[styles.headerChip, styles.headerChipWash]}
          >
            <MaterialCommunityIcons name="filter-variant" size={22} color={colors.onMain} />
          </SpringPressable>
          <SpringPressable
            onPress={() => {
              navigation.navigate("CreateBill");
            }}
            hitSlop={8}
            accessibilityLabel="记一笔"
            style={[styles.headerChip, styles.headerChipAccent]}
          >
            <MaterialCommunityIcons name="plus" size={headerFabIconSize} color={colors.onAccent} />
          </SpringPressable>
        </View>
      ),
      headerLeft: () => (
        <SpringPressable
          onPress={() => {
            navigation.navigate("Calendar");
          }}
          hitSlop={8}
          accessibilityLabel="打开日历"
          style={[styles.headerChip, styles.headerChipWash]}
        >
          <MaterialCommunityIcons name="calendar-month" size={22} color={colors.onMain} />
        </SpringPressable>
      ),
    });
  }, [navigation, colors, styles]);

  const bills = useMemo(() => queryBillsForMonth(monthAnchor), [monthAnchor, generation]);

  const { expense, income } = useMemo(() => {
    let ex = 0;
    let inc = 0;
    for (const b of bills) {
      const v = parseAmount(b.amount);
      if (b.type === 1) {
        ex += v;
      } else {
        inc += v;
      }
    }
    return { expense: ex, income: inc };
  }, [bills]);

  const sections: Section[] = useMemo(() => {
    const map = groupBillsByDayKey(bills);
    const keys = [...map.keys()].sort((a, b) => b.localeCompare(a));
    return keys.map((k) => {
      const list = map.get(k);
      return {
        title: formatSectionTitleFromKey(k),
        data: list ?? [],
      };
    });
  }, [bills]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const openMonthPicker = useCallback(() => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: monthAnchor,
        mode: "date",
        onChange: (_e, date) => {
          if (date !== undefined) {
            setMonthAnchor(date);
          }
        },
      });
    } else {
      setIosPickerOpen(true);
    }
  }, [monthAnchor]);

  const renderItem = useCallback(
    ({ item, index }: { item: Bill; index: number }) => {
      const t = item.billTime;
      const timeLabel = t === null || t === undefined ? "" : formatTimeShort(new Date(t * 1000));
      const isExpense = item.type === 1;
      const prefix = isExpense ? "-" : "+";
      const entering = reduceMotion
        ? undefined
        : FadeInDown.delay(Math.min(index, LIST_STAGGER_MAX - 1) * 40).springify();
      return (
        <Animated.View entering={entering}>
          <SpringPressable
            style={styles.row}
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
          </SpringPressable>
        </Animated.View>
      );
    },
    [navigation, styles, reduceMotion],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={[styles.headerBanner, shadows.raised]}>
        <SpringPressable style={styles.headerLeft} onPress={openMonthPicker}>
          <Text style={styles.yearText}>{formatHeaderYear(monthAnchor)}</Text>
          <View style={styles.monthRow}>
            <Text style={styles.monthBig}>{formatHeaderMonth(monthAnchor)}</Text>
            <MaterialCommunityIcons name="menu-down" size={22} color={colors.onMain} />
          </View>
        </SpringPressable>
        <View style={styles.headerDivider} />
        <View style={styles.headerRight}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>收入</Text>
            <Text style={styles.statValue}>{formatAmountDisplay(income)}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>支出</Text>
            <Text style={styles.statValue}>{formatAmountDisplay(expense)}</Text>
          </View>
        </View>
      </View>
      <GroupedInset style={styles.listInset}>
        <SectionList
          key={String(generation)}
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>本月还没有账单</Text>
              <SpringPressable
                onPress={() => {
                  navigation.navigate("CreateBill");
                }}
                accessibilityRole="button"
                accessibilityLabel="去记一笔"
              >
                <Text style={styles.emptyCta}>去记一笔</Text>
              </SpringPressable>
            </View>
          }
          stickySectionHeadersEnabled
        />
      </GroupedInset>
      {Platform.OS === "ios" && iosPickerOpen ? (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerToolbar}>
              <SpringPressable onPress={() => setIosPickerOpen(false)}>
                <Text style={styles.pickerDone}>完成</Text>
              </SpringPressable>
            </View>
            <DateTimePicker
              value={monthAnchor}
              mode="date"
              display="spinner"
              onChange={(_e, date) => {
                if (date !== undefined) {
                  setMonthAnchor(date);
                }
              }}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
