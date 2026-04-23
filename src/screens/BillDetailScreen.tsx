import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { CategoryIcon } from "../components/CategoryIcon";
import { SpringPressable } from "../components/SpringPressable";
import { GroupedInset, ListRow } from "../components/ios";
import { useBillsRefresh } from "../context/BillsRefreshContext";
import { deleteBillById, getBillById } from "../db/billRepo";
import type { HomeStackParamList } from "../navigation/types";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { listContentInset } from "../theme/layout";
import { formatDetailDate } from "../utils/dates";
import { formatAmountDisplay, parseAmount } from "../utils/money";
import { hapticError } from "../utils/haptics";

function buildBillDetailStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.canvas },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    muted: { color: colors.lightTitle },
    body: { paddingTop: 16, paddingBottom: 24 },
    detailInset: {
      marginTop: 0,
    },
    hero: {
      alignItems: "flex-start",
      paddingTop: 22,
      paddingBottom: 20,
      paddingHorizontal: listContentInset,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    iconRing: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: "center",
      justifyContent: "center",
    },
    heroTitle: {
      marginTop: 14,
      fontSize: 20,
      fontWeight: "600",
      color: colors.title,
      letterSpacing: -0.3,
      textAlign: "left",
      alignSelf: "stretch",
    },
    rowInline: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
    },
    rowTitle: {
      fontSize: 16,
      color: colors.detailRowLabel,
      fontWeight: "400",
    },
    rowDetail: {
      flex: 1,
      fontSize: 16,
      color: colors.title,
      fontWeight: "400",
      textAlign: "right",
    },
    rowDetailDate: {
      color: colors.title,
      fontWeight: "500",
    },
    rowDetailMuted: {
      color: colors.lightTitle,
      fontWeight: "400",
    },
    rowRemarkWrap: {
      alignItems: "stretch",
    },
    rowRemarkDetail: {
      marginTop: 8,
      fontSize: 16,
      lineHeight: 22,
      color: colors.title,
      fontWeight: "400",
    },
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
      backgroundColor: colors.surface,
    },
    footerDivider: {
      position: "absolute",
      left: "50%",
      top: 16,
      bottom: 16,
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
    },
    footerBtns: { flexDirection: "row", height: 56 },
    footerHalf: { flex: 1, alignItems: "center", justifyContent: "center" },
    footerText: { fontSize: 17, color: colors.accent, fontWeight: "400" },
    footerDestructive: { color: colors.expense, fontWeight: "500" },
  });
}

export function BillDetailScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildBillDetailStyles(colors), [colors]);
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
  const date = bt === null || bt === undefined ? new Date() : new Date(bt * 1000);
  const isExpense = bill.type === 1;
  const kindLabel = isExpense ? "支出" : "收入";
  const kindColor = isExpense ? colors.expense : colors.income;
  const heroBackdrop = isExpense ? colors.detailHeroBackdropExpense : colors.detailHeroBackdropIncome;

  const amountStr = formatAmountDisplay(parseAmount(bill.amount));
  const rows: { title: string; detail: string; variant?: "kind" | "amount" | "date" | "remark" }[] = [
    { title: "类型", detail: kindLabel, variant: "kind" },
    { title: "金额", detail: amountStr, variant: "amount" },
    { title: "日期", detail: formatDetailDate(date), variant: "date" },
    { title: "备注", detail: bill.remark ?? bill.name ?? "", variant: "remark" },
  ];

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.body}>
        <GroupedInset style={styles.detailInset}>
          <View style={styles.hero}>
            <View style={[styles.iconRing, { backgroundColor: heroBackdrop }]}>
              <CategoryIcon categoryId={bill.categoryId} size={44} color={colors.onMain} />
            </View>
            <Text style={styles.heroTitle}>{bill.name ?? "未分类"}</Text>
          </View>
          {rows.map((r, i) => {
            const isLast = i === rows.length - 1;
            const detailStyle = [
              styles.rowDetail,
              r.variant === "kind" || r.variant === "amount" ? { color: kindColor, fontWeight: "600" as const } : null,
              r.variant === "date" ? styles.rowDetailDate : null,
              r.variant === "remark" && (r.detail === "" || r.detail === bill.name) ? styles.rowDetailMuted : null,
            ];

            if (r.variant === "remark") {
              return (
                <ListRow key={r.title} isLast={isLast} style={styles.rowRemarkWrap}>
                  <Text style={styles.rowTitle}>{r.title}</Text>
                  <Text style={[styles.rowRemarkDetail, r.detail === "" ? styles.rowDetailMuted : null]}>
                    {r.detail === "" ? "无" : r.detail}
                  </Text>
                </ListRow>
              );
            }

            return (
              <ListRow key={r.title} isLast={isLast}>
                <View style={styles.rowInline}>
                  <Text style={styles.rowTitle}>{r.title}</Text>
                  <Text style={detailStyle} numberOfLines={2}>
                    {r.detail}
                  </Text>
                </View>
              </ListRow>
            );
          })}
        </GroupedInset>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.footerBtns}>
          <SpringPressable
            style={styles.footerHalf}
            onPress={() => {
              navigation.navigate("CreateBill", { billId: bill.id });
            }}
          >
            <Text style={styles.footerText}>编辑</Text>
          </SpringPressable>
          <SpringPressable
            style={styles.footerHalf}
            onPress={() => {
              Alert.alert("删除账单", "确定删除这条记录？", [
                { text: "取消", style: "cancel" },
                {
                  text: "删除",
                  style: "destructive",
                  onPress: () => {
                    hapticError();
                    deleteBillById(bill.id);
                    refresh();
                    navigation.goBack();
                  },
                },
              ]);
            }}
          >
            <Text style={[styles.footerText, styles.footerDestructive]}>删除</Text>
          </SpringPressable>
        </View>
      </View>
    </View>
  );
}
