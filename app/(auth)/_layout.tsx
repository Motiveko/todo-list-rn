import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuthUser } from "@/store/authStore"; // 경로 확인
import useGoogleAuthentication from "@/hooks/useGoogleAuthentication";
import { Text } from "@rneui/base";

export default function AuthLayout() {
  const user = useAuthUser();
  const { isLoading } = useGoogleAuthentication();

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  // 만약 사용자가 로그인 되어 있다면 (app)의 루트로 리디렉션
  // 이 경우는 거의 발생하지 않아야 합니다. RootLayout에서 이미 처리하기 때문입니다.
  // 하지만 방어적으로 추가할 수 있습니다.
  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
