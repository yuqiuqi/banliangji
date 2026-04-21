import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sumExpenseForCalendarMonth } from "../budget/monthExpense";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { getBudgetCap, upsertBudgetCap } from "../db/budgetRepo";
import { queryBillsForMonth } from "../db/billRepo";
import { colors } from "../theme/colors";
import { hairlineBorder, radii, shadows } from "../theme/layout";
import { formatAmountDisplay, parseAmount } from "../utils/money";

const OVER_BUDGET_COLOR = "#dc3545";

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function BudgetScreen(): React.ReactElement {
  const { generation } = useBillsRefresh();
  const [monthAnchor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [spent, setSpent] = useState(0);
  const [capRaw, setCapRaw] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [capInput, setCapInput] = useState("");

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

  const capVal = capRaw === null ? 0 : parseAmount(capRaw);
  const hasCap = capVal > 0;
  const over = hasCap && spent > capVal;
  const progress = hasCap ? Math.min(1, spent / capVal) : 0;
  const barColor = over ? OVER_BUDGET_COLOR : colors.tabbarTint;

  const openModal = (): void => {
    setCapInput(capRaw !== null && capVal > 0 ? formatAmountDisplay(capVal) : "");
    setModalOpen(true);
  };

  const saveCap = (): void => {
    const now = Date.now() / 1000;
    const normalized = formatAmountDisplay(parseAmount(capInput.trim()));
    upsertBudgetCap(monthKey(monthAnchor), -1, normalized, now);
    setModalOpen(false);
    reload();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>预算</Text>
        <Text style={styles.headerSub}>{format(monthAnchor, "yyyy年M月", { locale: zhCN })}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {!hasCap ? (
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>尚未设置本月预算</Text>
            <Text style={styles.emptyHint}>设置后，将按支出账单统计进度（与图表支出口径一致）。</Text>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
              onPress={openModal}
              accessibilityRole="button"
              accessibilityLabel="设置本月预算"
            >
              <Text style={styles.primaryBtnText}>设置预算</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
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
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed ? { opacity: 0.92 } : null]}
              onPress={openModal}
              accessibilityRole="button"
              accessibilityLabel="修改本月预算"
            >
              <Text style={styles.secondaryBtnText}>修改预算</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
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
              <Pressable
                onPress={() => setModalOpen(false)}
                style={styles.modalCancel}
                accessibilityRole="button"
                accessibilityLabel="取消"
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </Pressable>
              <Pressable
                onPress={saveCap}
                style={styles.modalSave}
                accessibilityRole="button"
                accessibilityLabel="保存预算"
              >
                <Text style={styles.modalSaveText}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.main,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: colors.title },
  headerSub: { marginTop: 4, fontSize: 14, color: colors.onMainSecondary },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: 16,
    ...hairlineBorder,
    ...shadows.card,
  },
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
  warn: { marginTop: 10, fontSize: 14, fontWeight: "600", color: OVER_BUDGET_COLOR },
  emptyTitle: { fontSize: 17, fontWeight: "600", color: colors.title },
  emptyHint: { marginTop: 8, fontSize: 14, color: colors.lightTitle, lineHeight: 20 },
  primaryBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: colors.tabbarTint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.card,
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  secondaryBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.card,
    ...hairlineBorder,
    backgroundColor: colors.white,
  },
  secondaryBtnText: { color: colors.title, fontSize: 15, fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radii.sheet,
    padding: 20,
    ...hairlineBorder,
  },
  modalTitle: { fontSize: 17, fontWeight: "600", color: colors.title },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.body,
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
  },
  modalSaveText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
