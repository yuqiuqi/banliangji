import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BillCalculator, BILL_CALCULATOR_CONTENT_HEIGHT } from "../components/BillCalculator";
import { SpringPressable } from "../components/SpringPressable";
import { CategoryIcon } from "../components/CategoryIcon";
import { IOSChromeGlassBackground, SegmentedTwo } from "../components/ios";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { flattenCategories } from "../data/categories";
import { createBillNow, getBillById, updateBill } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { radii, shadows } from "../theme/layout";
import { iosType } from "../theme/typography";
import { SPRING } from "../theme/motion";
import type { BillAmountKind, CategoryItem } from "../types/models";
import { formatAmountDisplay } from "../utils/money";
import { hapticSuccess } from "../utils/haptics";

const CALCULATOR_OVERLAY_HEIGHT = BILL_CALCULATOR_CONTENT_HEIGHT;
const SAFE_CONTENT_INSET_EXTRA = 16;
function buildCreateBillStyles(colors: AppPalette, borderTopGlass: string) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.createBody },
    body: { flex: 1 },
    listOuter: {
      flex: 1,
      marginHorizontal: 12,
      marginBottom: 16,
      borderRadius: radii.card,
    },
    listOuterWithKeyboard: {
      marginBottom: 0,
    },
    listInner: {
      flex: 1,
      borderRadius: radii.card,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    calcDock: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      elevation: 12,
      overflow: "hidden",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: borderTopGlass,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        default: {},
      }),
    },
    calcDockForeground: {
      position: "relative",
      width: "100%",
    },
    kindSegment: {
      marginHorizontal: 12,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: colors.createBody,
    },
    grid: { paddingVertical: 14, paddingHorizontal: 6 },
    row: { justifyContent: "flex-start" },
    cellHit: {
      width: "25%",
      paddingHorizontal: 4,
      paddingVertical: 5,
    },
    cellPlate: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 11,
      paddingHorizontal: 4,
      borderRadius: radii.chip,
      backgroundColor: colors.tertiaryFill,
    },
    cellPlateOn: {
      backgroundColor: colors.accentSelection,
      ...shadows.categoryCellOn,
    },
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
}

export function CreateBillScreen(): React.ReactElement {
  const { colors, colorScheme } = useAppTheme();
  const borderTopGlass =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.45)";
  const styles = useMemo(() => buildCreateBillStyles(colors, borderTopGlass), [colors, borderTopGlass]);

  const dockScale = useSharedValue(1);
  const dockAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dockScale.value }],
  }));

  const insets = useSafeAreaInsets();
  const bottomComfort = insets.bottom + SAFE_CONTENT_INSET_EXTRA;
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, "CreateBill">>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <SpringPressable
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="放弃本次编辑"
        >
          <Text style={{ color: colors.onMain, ...iosType.body }}>放弃本次编辑</Text>
        </SpringPressable>
      ),
    });
  }, [navigation, colors.onMain]);
  const { refresh, generation } = useBillsRefresh();
  const editId = route.params?.billId;

  const { expenses, income } = useMemo(() => flattenCategories(), []);

  const [kind, setKind] = useState<BillAmountKind>(1);
  const [selected, setSelected] = useState<CategoryItem | null>(null);
  const [calcVisible, setCalcVisible] = useState(false);
  const [billDate, setBillDate] = useState(() => new Date());
  const [iosDateOpen, setIosDateOpen] = useState(false);

  useEffect(() => {
    if (calcVisible) {
      dockScale.value = withSpring(0.985, SPRING.UI);
      const t = setTimeout(() => {
        dockScale.value = withSpring(1, SPRING.UI);
      }, 140);
      return () => clearTimeout(t);
    }
    dockScale.value = 1;
    return undefined;
  }, [calcVisible, selected]);

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
      const billTimeSec =
        new Date(billDate.getFullYear(), billDate.getMonth(), billDate.getDate()).getTime() / 1000;

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
      hapticSuccess();
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
        <View
          style={[
            styles.listOuter,
            shadows.grouped,
            calcVisible ? styles.listOuterWithKeyboard : null,
          ]}
        >
          <View style={styles.listInner}>
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
                  <SpringPressable
                    style={styles.cellHit}
                    onPress={() => {
                      setSelected(item);
                      setCalcVisible(true);
                    }}
                  >
                    <View style={[styles.cellPlate, on ? styles.cellPlateOn : null]}>
                      <CategoryIcon categoryId={item.categoryId} />
                      <Text style={styles.cellLabel} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  </SpringPressable>
                );
              }}
            />
          </View>
        </View>
      </View>
      {calcVisible ? (
        <Animated.View style={[styles.calcDock, dockAnimStyle, { paddingBottom: bottomComfort }]} pointerEvents="box-none">
          {Platform.OS === "ios" ? (
            <IOSChromeGlassBackground variant="dock" />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.calculatorDockFallback }]}
            />
          )}
          <View style={styles.calcDockForeground} pointerEvents="box-none">
            <BillCalculator
              visible
              initialAmount={editId !== undefined ? initialEditAmount : ""}
              billDateLabel={billDateLabel}
              onPickDate={openBillDate}
              onComplete={onCalcComplete}
            />
          </View>
        </Animated.View>
      ) : null}
      {Platform.OS === "ios" && iosDateOpen ? (
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerCard, { paddingBottom: 24 + bottomComfort }]}>
            <View style={styles.pickerToolbar}>
              <SpringPressable onPress={() => setIosDateOpen(false)}>
                <Text style={styles.pickerDone}>完成</Text>
              </SpringPressable>
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
