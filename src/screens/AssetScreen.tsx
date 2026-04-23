import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
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
import type { AssetAccountRow } from "../db/assetRepo";
import {
  deleteAssetAccount,
  insertAssetAccount,
  listAssetAccounts,
  updateAssetAccount,
} from "../db/assetRepo";
import { useReduceMotion } from "../hooks/useReduceMotion";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { radii, shadows } from "../theme/layout";
import { FADE_MS, SPRING } from "../theme/motion";
import { iosType } from "../theme/typography";
import { formatAmountDisplay, parseAmount } from "../utils/money";
import { hapticError, hapticLight, hapticSuccess } from "../utils/haptics";

const LIST_STAGGER_MAX = 12;

function buildAssetStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    headerBanner: {
      paddingHorizontal: 16,
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
  const reduceMotion = useReduceMotion();
  const scrollY = useSharedValue(0);
  const [accounts, setAccounts] = useState<AssetAccountRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [balanceInput, setBalanceInput] = useState("");

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
    setAccounts(listAssetAccounts());
  }, []);

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

  const confirmDelete = (row: AssetAccountRow): void => {
    Alert.alert("删除账户", `确定删除「${row.name}」？`, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          hapticError();
          deleteAssetAccount(row.id);
          reload();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View style={[styles.headerBanner, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>资产</Text>
        <Text style={styles.headerSub}>手动维护余额快照 · 与账单弱耦合</Text>
      </Animated.View>
      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listPad}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {accounts.length === 0 ? (
          <GroupedInset>
            <View style={styles.cardInner}>
              <Text style={styles.emptyTitle}>暂无账户</Text>
              <Text style={styles.emptyHint}>添加一个资产账户并记录当前余额。</Text>
              <SpringPressable
                style={styles.primaryBtn}
                onPress={openAdd}
                accessibilityRole="button"
                accessibilityLabel="添加账户"
              >
                <Text style={styles.primaryBtnText}>添加账户</Text>
              </SpringPressable>
            </View>
          </GroupedInset>
        ) : (
          <>
            <GroupedInset>
              {accounts.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={
                    reduceMotion
                      ? undefined
                      : FadeInDown.delay(Math.min(index, LIST_STAGGER_MAX - 1) * 40).springify()
                  }
                >
                  <SpringPressable
                    style={[
                      styles.row,
                      index < accounts.length - 1 ? styles.rowBorder : null,
                    ]}
                    onPress={() => openEdit(item)}
                    onLongPress={() => confirmDelete(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}，余额 ${formatAmountDisplay(parseAmount(item.balance))}`}
                  >
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowBal}>{formatAmountDisplay(parseAmount(item.balance))}</Text>
                  </SpringPressable>
                </Animated.View>
              ))}
            </GroupedInset>
            <SpringPressable
              style={styles.footerAdd}
              onPress={openAdd}
              accessibilityRole="button"
              accessibilityLabel="添加账户"
            >
              <Text style={styles.footerAddText}>+ 添加账户</Text>
            </SpringPressable>
          </>
        )}
      </Animated.ScrollView>

      <Modal visible={modalOpen} transparent animationType="none">
        <Animated.View style={[styles.modalBackdrop, backdropAnimStyle]}>
          <Animated.View style={[styles.modalCard, sheetAnimStyle]}>
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
              <SpringPressable onPress={closeModalAnimated} style={styles.modalCancel} accessibilityRole="button">
                <Text style={styles.modalCancelText}>取消</Text>
              </SpringPressable>
              <SpringPressable
                onPress={save}
                style={styles.modalSave}
                accessibilityRole="button"
                accessibilityLabel="保存账户"
              >
                <Text style={styles.modalSaveText}>保存账户</Text>
              </SpringPressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}
