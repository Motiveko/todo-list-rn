// app/_layout.tsx
import "../global.css";
import React, { useEffect } from "react";
import { SplashScreen, Stack, Tabs, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { ActivityIndicator, View } from "react-native";
import { useAuthJwt, useAuthUser } from "@/store/authStore";
import useGoogleAuthentication from "@/hooks/useGoogleAuthentication";
import { configHttpClientAuthentication } from "@/config/app";
import ToastDisplay from "@/components/ToastDisplay";

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
  const router = useRouter();
  const user = useAuthUser();
  const jwt = useAuthJwt();
  const segments = useSegments();
  const { isLoading } = useGoogleAuthentication();

  useEffect(() => {
    configHttpClientAuthentication(jwt);
  }, [jwt]);
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }

    // 로딩이 완료되고 라우팅 결정이 끝나면 스플래시 화면 숨김
    SplashScreen.hideAsync();
  }, [user, segments]);

  if (isLoading) {
    // 로딩 중에는 커스텀 로딩 화면을 보여줄 수 있습니다.
    // 또는 SplashScreen.preventAutoHideAsync() 때문에 기본 스플래시가 계속 보입니다.
    // 여기서는 간단한 ActivityIndicator 예시를 보여줍니다.
    // (실제로는 이 컴포넌트가 렌더링되기 전에 스플래시가 계속 떠있을 것입니다.)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
        </Stack>
        <ToastDisplay />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
