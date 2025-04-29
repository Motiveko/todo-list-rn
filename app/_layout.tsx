// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, createTheme } from "@rneui/themed";

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
        {/* Expo Router의 Stack 네비게이터 사용 */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* 로그인 페이지와 인증된 앱 페이지 분리 */}
          <Stack.Screen name="login" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
