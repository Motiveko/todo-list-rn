import React from "react";
import { StyleSheet } from "react-native";
import { Redirect, Tabs, useRouter, useSegments } from "expo-router";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import CommonHeader from "@/components/header";

export default function AppLayout() {
  const { user, isLoading, actions } = useAuthStore();
  const segments = useSegments(); // 현재 라우트 경로 파악
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: (props) => (
          <CommonHeader title={props.options.title} logout={actions.logout} />
        ),
      }}
      // https://reactnavigation.org/docs/bottom-tab-navigator#backbehavior
      // 뒤로가기 동작이 stack처럼 동작하게 하기 위해서는 옵션 추가가 필요함.
      backBehavior="order"
    >
      <Tabs.Screen
        name="todo"
        options={{
          title: "Todo",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="checkbox" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index" // TODO : 이거 왜 /index를 넣어줘야하는지 모르겠음
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
