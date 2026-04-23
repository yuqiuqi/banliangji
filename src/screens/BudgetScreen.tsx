import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupedInset } from "../components/ios";
import { SpringPressable } from "../components/SpringPressable";
import { sumExpenseForCalendarMonth } from "../budget/monthExpense";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { getBudgetCap, upsertBudgetCap } from "../db/budgetRepo";
import { queryBillsForMonth } from "../db/billRepo";
import { useReduceMotion } from "../hooks/useReduceMotion";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { radii, shadows } from "../theme/layout";
import { FADE_MS, SPRING } from "../theme/motion";
import { iosType } from "../theme/typography";
import { formatAmountDisplay, parseAmount } from "../utils/money";
import { hapticLight, hapticSuccess } from "../utils/haptics";

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function buildBudgetStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    headerBanner: {
      paddingHorizontal: 16,
      backgroundColor: colors.canvas,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    headerTitle: { ...iosType.largeTitle, color: colors.title },
    headerSub: { marginTop: 4, ...iosType.footnote, color: colors.lightTitle },
    scroll: { paddingTop: 16, paddingBottom: 32 },
    cardInner: { padding: 16 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 15, color: colors.lightTitle },
    amount: { fontSize: 17, fontWeight: "600", color: colors.title },
    track: {
      marginTop: 12,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.light,
      overflow: "hidden",
    },
    trackFill: { height: "100%", borderRadius: 5 },
    warn: { marginTop: 10, fontSize: 14, fontWeight: "600", color: colors.expense },
    emptyTitle: { fontSize: 17, fontWeight: "600", color: colors.title },
    emptyHint: { marginTop: 8, fontSize: 14, color: colors.lightTitle, lineHeight: 20 },
    primaryBtn: {
      marginTop: 16,
      alignSelf: "flex-start",
      backgroundColor: colors.tabbarTint,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: radii.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 255, 255, 0.35)",
      ...shadows.fluentButton,
    },
    primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: "600" },
    secondaryBtn: {
      marginTop: 16,
      alignSelf: "flex-start",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: radii.card,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      ...shadows.card,
    },
    secondaryBtnText: { color: colors.title, fontSize: 15, fontWeight: "600" },
    modalBackdrop: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderRadius: radii.sheet,
      padding: 20,
      ...shadows.grouped,
    },
    modalTitle: { fontSize: 17, fontWeight: "600", color: colors.title },
    input: {
      marginTop: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      borderRadius: radii.card,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 17,
      color: colors.title,
    },
    modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 },
    modalCancel: { paddingVertical: 10, paddingHorizontal: 12 },
    modalCancelText: { color: colors.lightTitle, fontSize: 16 },
    modalSave: {
      backgroundColor: colors.tabbarTint,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: radii.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 255, 255, 0.35)",
      ...shadows.fluentButton,
    },
    modalSaveText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  });
}

export function BudgetScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildBudgetStyles(colors), [colors]);
  const reduceMotion = useReduceMotion();
  const { generation } = useBillsRefresh();
  const scrollY = useSharedValue(0);
  const [monthAnchor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [spent, setSpent] = useState(0);
  const [capRaw, setCapRaw] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [capInput, setCapInput] = useState("");

  const backdropOp = useSharedValue(0);
  const sheetY = useSharedValue(60);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(scrollY.value, [0, 56], [8, 4], Extrapolation.CLAMP),
    paddingBottom: interpolate(scrollY.value, [0, 56], [12, 6], Extrapolation.CLAMP),
    minHeight: interpolate(scrollY.value, [0, 56], [72, 44], Extrapolation.CLAMP),
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: colors.modalScrim,
    opacity: backdropOp.value,
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const reload = useCallback(() => {
    const bills = queryBillsForMonth(monthAnchor);
    setSpent(sumExpenseForCalendarMonth(monthAnchor, bills));
    setCapRaw(getBudgetCap(monthKey(monthAnchor), -1));
  }, [monthAnchor]);

  useEffect(() => {
    reload();
  }, [reload, generation]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  useEffect(() => {
    if (modalOpen) {
      backdropOp.value = 0;
      sheetY.value = 60;
      backdropOp.value = withTiming(1, { duration: 250 });
      if (reduceMotion) {
        sheetY.value = withTiming(0, { duration: FADE_MS.normal });
      } else {
        sheetY.value = withSpring(0, SPRING.SHEET);
      }
      hapticLight();
    }
  }, [modalOpen, reduceMotion]);

  const closeModalAnimated = useCallback(() => {
    backdropOp.value = withTiming(0, { duration: 200 });
    if (reduceMotion) {
      sheetY.value = withTiming(60, { duration: FADE_MS.fast });
    } else {
      sheetY.value = withSpring(60, SPRING.SHEET);
    }
    setTimeout(() => setModalOpen(false), 220);
  }, [backdropOp, sheetY, reduceMotion]);

  const capVal = capRaw === null ? 0 : parseAmount(capRaw);
  const hasCap = capVal > 0;
  const over = hasCap && spent > capVal;
  const progress = hasCap ? Math.min(1, spent / capVal) : 0;
  const barColor = over ? colors.expense : colors.tabbarTint;

  const openModal = (): void => {
    setCapInput(capRaw !== null && capVal > 0 ? formatAmountDisplay(capVal) : "");
    setModalOpen(true);
  };

  const saveCap = (): void => {
    const now = Date.now() / 1000;
    const normalized = formatAmountDisplay(parseAmount(capInput.trim()));
    upsertBudgetCap(monthKey(monthAnchor), -1, normalized, now);
    hapticSuccess();
    backdropOp.value = withTiming(0, { duration: 200 });
    if (reduceMotion) {
      sheetY.value = withTiming(60, { duration: FADE_MS.fast });
    } else {
      sheetY.value = withSpring(60, SPRING.SHEET);
    }
    setTimeout(() => {
      setModalOpen(false);
      reload();
    }, 220);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View style={[styles.headerBanner, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>预算</Text>
        <Text style={styles.headerSub}>{format(monthAnchor, "yyyy年M月", { locale: zhCN })}</Text>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {!hasCap ? (
          <GroupedInset>
            <View style={styles.cardInner}>
              <Text style={styles.emptyTitle}>尚未设置本月预算</Text>
              <Text style={styles.emptyHint}>设置后，将按支出账单统计进度（与图表支出口径一致）。</Text>
              <SpringPressable
                style={styles.primaryBtn}
                onPress={openModal}
                accessibilityRole="button"
                accessibilityLabel="设置本月预算"
              >
                <Text style={styles.primaryBtnText}>设置预算</Text>
              </SpringPressable>
            </View>
          </GroupedInset>
        ) : (
          <GroupedInset>
            <View style={styles.cardInner}>
              <View style={styles.row}>
                <Text style={styles.label}>已用</Text>
                <Text
                  style={styles.amount}
                  accessibilityLabel={`已用 ${formatAmountDisplay(spent)}，预算 ${formatAmountDisplay(capVal)}`}
                >
                  {formatAmountDisplay(spent)} / {formatAmountDisplay(capVal)}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.trackFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: barColor }]} />
              </View>
              {over ? (
                <Text style={styles.warn}>已超出预算</Text>
              ) : null}
              <SpringPressable
                style={styles.secondaryBtn}
                onPress={openModal}
                accessibilityRole="button"
                accessibilityLabel="修改本月预算"
              >
                <Text style={styles.secondaryBtnText}>修改预算</Text>
              </SpringPressable>
            </View>
          </GroupedInset>
        )}
      </Animated.ScrollView>

      <Modal visible={modalOpen} transparent animationType="none">
        <Animated.View style={[styles.modalBackdrop, backdropAnimStyle]}>
          <Animated.View style={[styles.modalCard, sheetAnimStyle]}>
            <Text style={styles.modalTitle}>本月预算金额</Text>
            <TextInput
              style={styles.input}
              value={capInput}
              onChangeText={setCapInput}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.lightTitle}
            />
            <View style={styles.modalActions}>
              <SpringPressable
                onPress={closeModalAnimated}
                style={styles.modalCancel}
                accessibilityRole="button"
                accessibilityLabel="取消"
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </SpringPressable>
              <SpringPressable
                onPress={saveCap}
                style={styles.modalSave}
                accessibilityRole="button"
                accessibilityLabel="保存预算"
              >
                <Text style={styles.modalSaveText}>保存</Text>
              </SpringPressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}
