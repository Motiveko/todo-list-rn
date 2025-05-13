import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect, Stack, Tabs, useRouter, useSegments } from "expo-router";
import { Button } from "@rneui/themed"; // 로그아웃 버튼용
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";

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
        headerRight: () => (
          <Button
            title="Logout"
            onPress={actions.logout}
            buttonStyle={{ backgroundColor: "red" }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="todo"
        options={{
          title: "Todo",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="checkbox" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
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
