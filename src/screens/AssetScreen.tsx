import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AssetAccountRow } from "../db/assetRepo";
import {
  deleteAssetAccount,
  insertAssetAccount,
  listAssetAccounts,
  updateAssetAccount,
} from "../db/assetRepo";
import { colors } from "../theme/colors";
import { hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import { formatAmountDisplay, parseAmount } from "../utils/money";

export function AssetScreen(): React.ReactElement {
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>资产</Text>
        <Text style={styles.headerSub}>手动维护余额快照 · 与账单弱耦合</Text>
      </View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={accounts.length === 0 ? styles.emptyList : styles.listPad}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.card}>
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
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.rowCard, pressed ? { opacity: pressedOpacity } : null]}
            onPress={() => openEdit(item)}
            onLongPress={() => confirmDelete(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}，余额 ${formatAmountDisplay(parseAmount(item.balance))}`}
          >
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowBal}>{formatAmountDisplay(parseAmount(item.balance))}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          accounts.length > 0 ? (
            <Pressable
              style={({ pressed }) => [styles.footerAdd, pressed ? { opacity: pressedOpacity } : null]}
              onPress={openAdd}
              accessibilityRole="button"
              accessibilityLabel="添加账户"
            >
              <Text style={styles.footerAddText}>+ 添加账户</Text>
            </Pressable>
          ) : null
        }
      />

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
  headerTitle: { fontSize: 20, fontWeight: "600", color: colors.onMain },
  headerSub: { marginTop: 4, fontSize: 13, color: colors.onMainSecondary },
  listPad: { padding: 16, paddingBottom: 32 },
  sep: { height: 10 },
  emptyList: { flexGrow: 1, padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    ...hairlineBorder,
    ...shadows.card,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    ...hairlineBorder,
    ...shadows.card,
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
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  footerAdd: { marginTop: 16, alignItems: "center", padding: 12 },
  footerAddText: { fontSize: 16, fontWeight: "600", color: colors.tabbarTint },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.sheet,
    padding: 20,
    ...hairlineBorder,
  },
  modalTitle: { fontSize: 17, fontWeight: "600", color: colors.title },
  fieldLabel: { marginTop: 12, fontSize: 13, color: colors.lightTitle },
  input: {
    marginTop: 6,
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
