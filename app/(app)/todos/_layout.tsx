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

  // 사용자가 있으면 앱 내부 페이지 렌더링
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
        name="index" // app/(app)/index.tsx 파일을 가리킴
        options={{
          title: "List",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new" // app/(app)/todos 폴더 (및 그 안의 _layout.tsx)를 가리킴
        options={{
          title: "New",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="add" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screens/[id]" // app/(app)/todos 폴더 (및 그 안의 _layout.tsx)를 가리킴
        options={{
          headerShown: false,
          href: null, // 탭 사라지게 해준다.
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
