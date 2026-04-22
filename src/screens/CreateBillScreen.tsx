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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BillCalculator } from "../components/BillCalculator";
import { SegmentedTwo } from "../components/ios";
import { CategoryIcon } from "../components/CategoryIcon";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { flattenCategories } from "../data/categories";
import { createBillNow, getBillById, updateBill } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { BillAmountKind, CategoryItem } from "../types/models";
import { colors } from "../theme/colors";
import { hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import { formatAmountDisplay } from "../utils/money";

/** 与 TCalculatorView：top 50 + 4 行×60 */
const CALCULATOR_OVERLAY_HEIGHT = 50 + 60 * 4;

/**
 * 在系统 reporting 的 bottom inset 之外再留一截，避免页面/键盘区贴安全边界过紧。
 *（无 inset 的机型也会有最小垫高。）
 */
const SAFE_CONTENT_INSET_EXTRA = 16;

export function CreateBillScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const bottomComfort = insets.bottom + SAFE_CONTENT_INSET_EXTRA;
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
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View
        style={[
          styles.body,
          calcVisible ? null : { paddingBottom: bottomComfort },
        ]}
      >
        <SegmentedTwo
          leftLabel="支出"
          rightLabel="收入"
          value={kind === 1 ? 0 : 1}
          style={styles.kindSegment}
          onChange={(v) => {
            setKind(v === 0 ? 1 : 2);
            setSelected(null);
            setCalcVisible(false);
          }}
        />
        <View style={[styles.listCard, calcVisible ? styles.listCardWithKeyboard : null]}>
          <FlatList
            data={listData}
            keyExtractor={(item) => String(item.categoryId)}
            numColumns={4}
            contentContainerStyle={[
              styles.grid,
              calcVisible
                ? { paddingBottom: CALCULATOR_OVERLAY_HEIGHT + 12 + bottomComfort }
                : null,
            ]}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => {
              const on = selected?.categoryId === item.categoryId;
              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.cell,
                    on ? styles.cellOn : null,
                    { borderRadius: radii.card },
                    pressed ? { opacity: pressedOpacity } : null,
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
      </View>
      {calcVisible ? (
        <View
          style={[
            styles.calcDock,
            { paddingBottom: bottomComfort, backgroundColor: colors.calculatorBg },
          ]}
          pointerEvents="box-none"
        >
          <BillCalculator
            visible
            initialAmount={editId !== undefined ? initialEditAmount : ""}
            billDateLabel={billDateLabel}
            onPickDate={openBillDate}
            onComplete={onCalcComplete}
          />
        </View>
      ) : null}
      {Platform.OS === "ios" && iosDateOpen ? (
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerCard, { paddingBottom: 24 + bottomComfort }]}>
            <View style={styles.pickerToolbar}>
              <Pressable
                onPress={() => setIosDateOpen(false)}
                style={({ pressed }) => [pressed ? { opacity: pressedOpacity } : null]}
              >
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
  body: { flex: 1 },
  listCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...hairlineBorder,
    ...shadows.card,
  },
  listCardWithKeyboard: {
    marginBottom: 0,
  },
  calcDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    elevation: 12,
  },
  kindSegment: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
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
  pickerCard: { backgroundColor: colors.surface },
  pickerToolbar: { alignItems: "flex-end", padding: 12 },
  pickerDone: { color: colors.accent, fontSize: 17, fontWeight: "600" },
});
