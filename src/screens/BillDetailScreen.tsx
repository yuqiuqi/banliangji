import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CategoryIcon } from "../components/CategoryIcon";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { deleteBillById, getBillById } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { hairlineBorder, pressedOpacity, radii, shadows } from "../theme/layout";
import { formatDetailDate } from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";

export function BillDetailScreen(): React.ReactElement {
  const route = useRoute<RouteProp<HomeStackParamList, "BillDetail">>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { refresh, generation } = useBillsRefresh();
  const billId = route.params.billId;

  const bill = useMemo(() => getBillById(billId), [billId, generation]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "账单详情" });
  }, [navigation]);

  if (bill === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>找不到该账单</Text>
      </View>
    );
  }

  const bt = bill.billTime;
  const date =
    bt === null || bt === undefined ? new Date() : new Date(bt * 1000);
  const isExpense = bill.type === 1;
  const rows: { title: string; detail: string }[] = [
    { title: "类型", detail: isExpense ? "支出" : "收入" },
    { title: "金额", detail: formatAmountDisplay(parseAmount(bill.amount)) },
    { title: "日期", detail: formatDetailDate(date) },
    { title: "备注", detail: bill.remark ?? bill.name ?? "" },
  ];

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <CategoryIcon categoryId={bill.categoryId} size={48} color={colors.onMain} />
          <Text style={styles.heroTitle}>{bill.name ?? "未分类"}</Text>
        </View>
        <View style={styles.detailCard}>
          {rows.map((r) => (
            <View key={r.title} style={styles.row}>
              <Text style={styles.rowTitle}>{r.title}</Text>
              <Text style={styles.rowDetail}>{r.detail}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.footerBtns}>
          <Pressable
            style={({ pressed }) => [styles.footerHalf, pressed ? { opacity: pressedOpacity } : null]}
            onPress={() => {
              navigation.navigate("CreateBill", { billId: bill.id });
            }}
          >
            <Text style={styles.footerText}>编辑</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.footerHalf, pressed ? { opacity: pressedOpacity } : null]}
            onPress={() => {
              Alert.alert("删除账单", "确定删除这条记录？", [
                { text: "取消", style: "cancel" },
                {
                  text: "删除",
                  style: "destructive",
                  onPress: () => {
                    deleteBillById(bill.id);
                    refresh();
                    navigation.goBack();
                  },
                },
              ]);
            }}
          >
            <Text style={[styles.footerText, styles.footerDestructive]}>删除</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.canvas },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.lightTitle },
  body: { paddingBottom: 24 },
  detailCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    overflow: "hidden",
    ...hairlineBorder,
    ...shadows.card,
  },
  hero: {
    backgroundColor: colors.main,
    alignItems: "center",
    paddingVertical: 28,
  },
  heroTitle: { marginTop: 12, fontSize: 18, color: colors.onMain },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.body,
  },
  rowTitle: { fontSize: 13, color: colors.lightTitle },
  rowDetail: { marginTop: 6, fontSize: 16, color: colors.title },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.body },
  footerDivider: {
    position: "absolute",
    left: "50%",
    top: 16,
    bottom: 16,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.body,
  },
  footerBtns: { flexDirection: "row", height: 56 },
  footerHalf: { flex: 1, alignItems: "center", justifyContent: "center" },
  footerText: { fontSize: 15, color: colors.title, fontWeight: "300" },
  footerDestructive: { color: "#dc3545", fontWeight: "500" },
});
