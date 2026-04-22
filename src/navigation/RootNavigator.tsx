import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlatformPressable } from "@react-navigation/elements";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BillsRefreshProvider } from "../context/BillsRefreshContext";
import { AssetScreen } from "../screens/AssetScreen";
import { BillDetailScreen } from "../screens/BillDetailScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { ChartScreen } from "../screens/ChartScreen";
import { CreateBillScreen } from "../screens/CreateBillScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MineScreen } from "../screens/MineScreen";
import { colors } from "../theme/colors";
import { pressedOpacity } from "../theme/layout";
import type { HomeStackParamList, RootTabParamList } from "./types";

/** Tab bar press feedback — `PlatformPressable` is built on RN `Pressable`; uses theme `pressedOpacity`. */
function ClayTabBarButton(props: BottomTabBarButtonProps): React.ReactElement {
  return <PlatformPressable {...props} pressOpacity={pressedOpacity} />;
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    primary: colors.main,
    card: colors.white,
    border: colors.body,
    text: colors.title,
  },
};

function HomeStackNavigator(): React.ReactElement {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.main },
        headerTintColor: colors.title,
        headerTitleStyle: { color: colors.title },
        contentStyle: { backgroundColor: colors.canvas }, // Clay canvas
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: "明细",
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen name="BillDetail" component={BillDetailScreen} options={{ title: "账单详情" }} />
      <HomeStack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: colors.main },
        }}
      >
        <HomeStack.Screen name="CreateBill" component={CreateBillScreen} options={{ title: "记一笔" }} />
        <HomeStack.Screen name="Calendar" component={CalendarScreen} options={{ title: "日历" }} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

function Tabs(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabbarTint,
        tabBarInactiveTintColor: colors.lightTitle,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.body,
        },
        tabBarButton: (props) => <ClayTabBarButton {...props} />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "明细",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="receipt" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ChartTab"
        component={ChartScreen}
        options={{
          title: "图表",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-arc" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="BudgetTab"
        component={BudgetScreen}
        options={{
          title: "预算",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-pie" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AssetTab"
        component={AssetScreen}
        options={{
          title: "资产",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wallet" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MineTab"
        component={MineScreen}
        options={{
          title: "我的",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <BillsRefreshProvider>
        <NavigationContainer theme={navTheme}>
          <Tabs />
        </NavigationContainer>
      </BillsRefreshProvider>
    </SafeAreaProvider>
  );
}
