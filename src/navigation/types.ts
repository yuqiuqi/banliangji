import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type HomeStackParamList = {
  HomeMain: undefined;
  BillDetail: { billId: number };
  CreateBill: { billId?: number } | undefined;
  Calendar: undefined;
};

export type RootTabParamList = {
  HomeTab: undefined;
  ChartTab: undefined;
  BudgetTab: undefined;
  AssetTab: undefined;
  MineTab: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
