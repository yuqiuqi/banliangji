import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
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
import { BillCalculator } from "../components/BillCalculator";
import { CategoryIcon } from "../components/CategoryIcon";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { flattenCategories } from "../data/categories";
import { createBillNow, getBillById, updateBill } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { BillAmountKind, CategoryItem } from "../types/models";
import { colors } from "../theme/colors";
import { hairlineBorder, radii, shadows } from "../theme/layout";
import { formatAmountDisplay } from "../utils/money";

export function CreateBillScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, "CreateBill">>();
  const { refresh, generation } = useBillsRefresh();
  const editId = route.params?.billId;

  const { expenses, income } = useMemo(() => flattenCategories(), []);

  const [kind, setKind] = useState<BillAmountKind>(1);
  const [selected, setSelected] = useState<CategoryItem | null>(null);
  const [calcVisible, setCalcVisible] = useState(false);
  const [billDate, setBillDate] = useState(() => new Date());
  const [iosDateOpen, setIosDateOpen] = useState(false);

  useEffect(() => {
    if (editId === undefined) {
      return;
    }
    const existing = getBillById(editId);
    if (existing === null) {
      return;
    }
    setKind(existing.type);
    const pool = existing.type === 1 ? expenses : income;
    const found = pool.find((c) => c.categoryId === existing.categoryId);
    setSelected(
      found ?? {
        categoryId: existing.categoryId,
        name: existing.name ?? "",
        iconAssetKey: existing.icon ?? "",
        isIncome: existing.type === 2,
      },
    );
    const bt = existing.billTime;
    if (bt !== null && bt !== undefined) {
      setBillDate(new Date(bt * 1000));
    }
    setCalcVisible(true);
  }, [editId, expenses, income, generation]);

  const listData = kind === 1 ? expenses : income;

  const initialEditAmount = useMemo(() => {
    if (editId === undefined) {
      return "";
    }
    return getBillById(editId)?.amount ?? "";
  }, [editId, generation]);

  const billDateLabel = useMemo(
    () =>
      `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, "0")}-${String(
        billDate.getDate(),
      ).padStart(2, "0")}`,
    [billDate],
  );

  const openBillDate = useCallback(() => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: billDate,
        mode: "date",
        onChange: (_e, d) => {
          if (d !== undefined) {
            setBillDate(d);
          }
        },
      });
    } else {
      setIosDateOpen(true);
    }
  }, [billDate]);

  const onCalcComplete = useCallback(
    (value: number) => {
      if (selected === null) {
        return;
      }
      const amountStr = formatAmountDisplay(value);
      const billTimeSec = new Date(
        billDate.getFullYear(),
        billDate.getMonth(),
        billDate.getDate(),
      ).getTime() / 1000;

      if (editId !== undefined) {
        const existing = getBillById(editId);
        if (existing === null) {
          return;
        }
        const next = {
          ...existing,
          type: kind,
          categoryId: selected.categoryId,
          icon: selected.iconAssetKey,
          name: selected.name,
          amount: amountStr,
          updateTime: Date.now() / 1000,
          billTime: billTimeSec,
        };
        updateBill(next);
      } else {
        createBillNow({
          type: kind,
          categoryId: selected.categoryId,
          icon: selected.iconAssetKey,
          name: selected.name,
          remark: null,
          amount: amountStr,
          billTimeSec,
        });
      }
      refresh();
      navigation.goBack();
    },
    [billDate, editId, kind, navigation, refresh, selected],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.tabs}>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            kind === 1 ? styles.tabOn : null,
            pressed ? { opacity: 0.94 } : null,
          ]}
          onPress={() => {
            setKind(1);
            setSelected(null);
            setCalcVisible(false);
          }}
        >
          <Text style={[styles.tabText, kind === 1 ? styles.tabTextOn : null]}>支出</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            kind === 2 ? styles.tabOn : null,
            pressed ? { opacity: 0.94 } : null,
          ]}
          onPress={() => {
            setKind(2);
            setSelected(null);
            setCalcVisible(false);
          }}
        >
          <Text style={[styles.tabText, kind === 2 ? styles.tabTextOn : null]}>收入</Text>
        </Pressable>
      </View>
      <View style={styles.listCard}>
        <FlatList
          data={listData}
          keyExtractor={(item) => String(item.categoryId)}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const on = selected?.categoryId === item.categoryId;
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.cell,
                  on ? styles.cellOn : null,
                  { borderRadius: radii.card },
                  pressed ? { opacity: 0.94 } : null,
                ]}
                onPress={() => {
                  setSelected(item);
                  setCalcVisible(true);
                }}
              >
              <CategoryIcon categoryId={item.categoryId} />
              <Text style={styles.cellLabel} numberOfLines={1}>
                {item.name}
              </Text>
              </Pressable>
            );
          }}
        />
      </View>
      <BillCalculator
        visible={calcVisible}
        initialAmount={editId !== undefined ? initialEditAmount : ""}
        billDateLabel={billDateLabel}
        onPickDate={openBillDate}
        onComplete={onCalcComplete}
      />
      {Platform.OS === "ios" && iosDateOpen ? (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerToolbar}>
              <Pressable onPress={() => setIosDateOpen(false)}>
                <Text style={styles.pickerDone}>完成</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={billDate}
              mode="date"
              display="spinner"
              onChange={(_e, d) => {
                if (d !== undefined) {
                  setBillDate(d);
                }
              }}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.createBody },
  listCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    overflow: "hidden",
    ...hairlineBorder,
    ...shadows.card,
  },
  tabs: { flexDirection: "row", backgroundColor: colors.white },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabOn: { borderBottomWidth: 2, borderBottomColor: colors.title },
  tabText: { fontSize: 16, color: colors.lightTitle },
  tabTextOn: { color: colors.title, fontWeight: "600" },
  grid: { paddingVertical: 12 },
  row: { justifyContent: "flex-start" },
  cell: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 12,
  },
  cellOn: { backgroundColor: colors.light },
  cellLabel: { marginTop: 6, fontSize: 12, color: colors.title, maxWidth: 72, textAlign: "center" },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  pickerCard: { backgroundColor: colors.white, paddingBottom: 24 },
  pickerToolbar: { alignItems: "flex-end", padding: 12 },
  pickerDone: { color: colors.title, fontSize: 16, fontWeight: "600" },
});
