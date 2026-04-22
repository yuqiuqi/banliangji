import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryIcon } from "../components/CategoryIcon";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { groupBillsByDayKey, queryBillsForMonth } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { Bill } from "../types/models";
import { colors } from "../theme/colors";
import { hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import {
  addCalendarMonth,
  formatBillDayKey,
  formatSectionTitleFromKey,
  padCalendarLeadingBlanks,
  weekdayLabels,
} from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";

const DAY_CELL = Dimensions.get("window").width / 7;

export function CalendarScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { generation, refresh } = useBillsRefresh();
  const [month, setMonth] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const billsMonth = useMemo(() => queryBillsForMonth(month), [month, generation]);
  const byDay = useMemo(() => groupBillsByDayKey(billsMonth), [billsMonth]);

  const cells = useMemo(() => padCalendarLeadingBlanks(month), [month]);

  const selectedBills: Bill[] = useMemo(() => {
    if (selectedKey === null) {
      return [];
    }
    return byDay.get(selectedKey) ?? [];
  }, [byDay, selectedKey]);

  const onCreate = useCallback(() => {
    navigation.navigate("CreateBill", {});
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.monthBar}>
        <Pressable
          hitSlop={8}
          accessibilityLabel="上一月"
          style={({ pressed }) => (pressed ? { opacity: pressedOpacity } : null)}
          onPress={() => {
            setMonth((m) => addCalendarMonth(m, -1));
            setSelectedKey(null);
          }}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.title} />
        </Pressable>
        <Text style={styles.monthTitle}>
          {month.getFullYear()}年{month.getMonth() + 1}月
        </Text>
        <Pressable
          hitSlop={8}
          accessibilityLabel="下一月"
          style={({ pressed }) => (pressed ? { opacity: pressedOpacity } : null)}
          onPress={() => {
            setMonth((m) => addCalendarMonth(m, 1));
            setSelectedKey(null);
          }}
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color={colors.title} />
        </Pressable>
      </View>
      <View style={styles.gridCard}>
        <View style={styles.weekRow}>
          {weekdayLabels().map((w) => (
            <Text key={w} style={styles.weekCell}>
              {w}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
        {cells.map((d, idx) => {
          if (d === null) {
            return <View key={`e-${idx}`} style={[styles.dayCell, { width: DAY_CELL, height: DAY_CELL }]} />;
          }
          const key = formatBillDayKey(d);
          const has = (byDay.get(key)?.length ?? 0) > 0;
          const sel = selectedKey === key;
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.dayCell,
                { width: DAY_CELL, height: DAY_CELL },
                sel ? styles.daySel : null,
                pressed ? { opacity: pressedOpacity } : null,
              ]}
              onPress={() => {
                setSelectedKey(key);
                refresh();
              }}
            >
              <Text style={styles.dayNum}>{d.getDate()}</Text>
              {has ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        })}
        </View>
      </View>
      <View style={styles.listCard}>
        <FlatList
        data={selectedBills}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          selectedKey ? (
            <Text style={styles.listHead}>{formatSectionTitleFromKey(selectedKey)}</Text>
          ) : (
            <Text style={styles.listHeadMuted}>点选某一天查看明细</Text>
          )
        }
        renderItem={({ item }) => {
          const isExpense = item.type === 1;
          const prefix = isExpense ? "-" : "+";
          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed ? { opacity: pressedOpacity } : null]}
              onPress={() => {
                navigation.navigate("BillDetail", { billId: item.id });
              }}
            >
              <CategoryIcon categoryId={item.categoryId} />
              <View style={styles.rowMid}>
                <Text style={styles.rowTitle}>{item.name}</Text>
              </View>
              <Text style={styles.rowAmt}>
                {prefix}
                {formatAmountDisplay(parseAmount(item.amount))}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          selectedKey ? <Text style={styles.empty}>当日无账单</Text> : null
        }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
      <Pressable
        style={({ pressed }) => [styles.fab, pressed ? { opacity: pressedOpacity } : null]}
        accessibilityLabel="记一笔"
        onPress={onCreate}
      >
        <MaterialCommunityIcons name="plus" color={colors.title} size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  gridCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    overflow: "hidden",
    ...hairlineBorder,
    ...shadows.card,
    paddingBottom: 8,
  },
  listCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    overflow: "hidden",
    ...hairlineBorder,
    ...shadows.card,
  },
  monthBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.main,
  },
  monthTitle: { fontSize: 16, fontWeight: "600", color: colors.title },
  weekRow: { flexDirection: "row", paddingVertical: 8 },
  weekCell: { flex: 1, textAlign: "center", color: colors.lightTitle, fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  daySel: { backgroundColor: colors.light },
  dayNum: { fontSize: 16, color: colors.title },
  dot: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.main,
  },
  listHead: { padding: 16, fontSize: 15, fontWeight: "600", color: colors.title },
  listHeadMuted: { padding: 16, fontSize: 14, color: colors.lightTitle },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.body,
  },
  rowMid: { flex: 1, marginLeft: 10 },
  rowTitle: { fontSize: 15, color: colors.title },
  rowAmt: { fontSize: 15, color: colors.title },
  empty: { textAlign: "center", color: colors.lightTitle, marginTop: 12 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.main,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
