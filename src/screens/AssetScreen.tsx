import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupedInset } from "../components/ios";
import type { AssetAccountRow } from "../db/assetRepo";
import {
  deleteAssetAccount,
  insertAssetAccount,
  listAssetAccounts,
  updateAssetAccount,
} from "../db/assetRepo";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { pressedOpacity, radii, shadows } from "../theme/layout";
import { iosType } from "../theme/typography";
import { formatAmountDisplay, parseAmount } from "../utils/money";

function buildAssetStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    headerBanner: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: colors.canvas,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    headerTitle: { ...iosType.largeTitle, color: colors.title },
    headerSub: { marginTop: 4, ...iosType.caption1, color: colors.lightTitle },
    listPad: { paddingTop: 16, paddingBottom: 32, flexGrow: 1 },
    cardInner: { padding: 16 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    rowName: { fontSize: 16, fontWeight: "600", color: colors.title, flex: 1 },
    rowBal: { fontSize: 16, fontWeight: "600", color: colors.title, marginLeft: 12 },
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
    footerAdd: { marginTop: 16, alignItems: "center", padding: 12 },
    footerAddText: { fontSize: 16, fontWeight: "600", color: colors.tabbarTint },
    modalBackdrop: {
      flex: 1,
      backgroundColor: colors.modalScrim,
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
    fieldLabel: { marginTop: 12, fontSize: 13, color: colors.lightTitle },
    input: {
      marginTop: 6,
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

export function AssetScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildAssetStyles(colors), [colors]);
  const [accounts, setAccounts] = useState<AssetAccountRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [balanceInput, setBalanceInput] = useState("");

  const reload = useCallback(() => {
    setAccounts(listAssetAccounts());
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const openAdd = (): void => {
    setEditingId(null);
    setNameInput("");
    setBalanceInput("");
    setModalOpen(true);
  };

  const openEdit = (row: AssetAccountRow): void => {
    setEditingId(row.id);
    setNameInput(row.name);
    setBalanceInput(formatAmountDisplay(parseAmount(row.balance)));
    setModalOpen(true);
  };

  const save = (): void => {
    const name = nameInput.trim();
    if (name.length === 0) {
      return;
    }
    const bal = formatAmountDisplay(parseAmount(balanceInput.trim()));
    const now = Date.now() / 1000;
    if (editingId === null) {
      insertAssetAccount(name, bal, now);
    } else {
      updateAssetAccount(editingId, name, bal, now);
    }
    setModalOpen(false);
    reload();
  };

  const confirmDelete = (row: AssetAccountRow): void => {
    Alert.alert("删除账户", `确定删除「${row.name}」？`, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          deleteAssetAccount(row.id);
          reload();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerBanner}>
        <Text style={styles.headerTitle}>资产</Text>
        <Text style={styles.headerSub}>手动维护余额快照 · 与账单弱耦合</Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listPad}
      >
        {accounts.length === 0 ? (
          <GroupedInset>
            <View style={styles.cardInner}>
              <Text style={styles.emptyTitle}>暂无账户</Text>
              <Text style={styles.emptyHint}>添加一个资产账户并记录当前余额。</Text>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: pressedOpacity } : null]}
                onPress={openAdd}
                accessibilityRole="button"
                accessibilityLabel="添加账户"
              >
                <Text style={styles.primaryBtnText}>添加账户</Text>
              </Pressable>
            </View>
          </GroupedInset>
        ) : (
          <>
            <GroupedInset>
              {accounts.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.row,
                    index < accounts.length - 1 ? styles.rowBorder : null,
                    pressed ? { opacity: pressedOpacity } : null,
                  ]}
                  onPress={() => openEdit(item)}
                  onLongPress={() => confirmDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}，余额 ${formatAmountDisplay(parseAmount(item.balance))}`}
                >
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowBal}>{formatAmountDisplay(parseAmount(item.balance))}</Text>
                </Pressable>
              ))}
            </GroupedInset>
            <Pressable
              style={({ pressed }) => [styles.footerAdd, pressed ? { opacity: pressedOpacity } : null]}
              onPress={openAdd}
              accessibilityRole="button"
              accessibilityLabel="添加账户"
            >
              <Text style={styles.footerAddText}>+ 添加账户</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId === null ? "添加账户" : "编辑账户"}</Text>
            <Text style={styles.fieldLabel}>名称</Text>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="例如：现金"
              placeholderTextColor={colors.lightTitle}
            />
            <Text style={styles.fieldLabel}>余额</Text>
            <TextInput
              style={styles.input}
              value={balanceInput}
              onChangeText={setBalanceInput}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.lightTitle}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setModalOpen(false)}
                style={({ pressed }) => [styles.modalCancel, pressed ? { opacity: pressedOpacity } : null]}
                accessibilityRole="button"
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </Pressable>
              <Pressable
                onPress={save}
                style={({ pressed }) => [styles.modalSave, pressed ? { opacity: pressedOpacity } : null]}
                accessibilityRole="button"
                accessibilityLabel="保存账户"
              >
                <Text style={styles.modalSaveText}>保存账户</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
