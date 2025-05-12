// app/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

// React Native Elements 테마 설정 (선택 사항)
const theme = createTheme({
  lightColors: {
    primary: "#3498db",
  },
  darkColors: {
    primary: "#2980b9",
  },
  mode: "light", // or 'dark'
});

export default function RootLayout() {
  // 여기서 초기 인증 상태 확인 로직을 넣을 수도 있습니다 (예: AsyncStorage 토큰 확인)
  // 하지만 라우트 그룹 레이아웃에서 처리하는 것이 더 일반적입니다.

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name="(tabs)"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              title: "Login",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="log-in-outline" size={size} color={color} />
              ),
            }}
          />
          {/* +not-found 스크린은 Tabs에 직접 포함시키지 않는 것이 일반적입니다. */}
          {/* 필요하다면 (tabs) 그룹 내 Stack이나 다른 곳에서 처리합니다. */}
          <Tabs.Screen
            name="+not-found"
            options={{ title: "Oops! Not Found" }}
          />
        </Tabs>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
