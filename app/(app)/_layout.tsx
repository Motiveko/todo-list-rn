import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Button } from "@rneui/themed"; // 로그아웃 버튼용

export default function AppLayout() {
  const { user, isLoading, initializeAuth, signOut } = useAuthStore();
  const segments = useSegments(); // 현재 라우트 경로 파악
  const router = useRouter();

  useEffect(() => {
    // 앱 레이아웃 로드 시 사용자 정보가 없으면 초기화 시도
    if (!user && !isLoading) {
      initializeAuth();
    }
  }, []); // 마운트 시 한 번만 실행

  // 초기 로딩 중일 때
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // 로딩 완료 후 사용자가 없으면 로그인 페이지로 리디렉션
  if (!user && !isLoading) {
    // Redirect 컴포넌트는 클라이언트 사이드에서만 작동하므로,
    // 레이아웃에서는 router.replace 사용이 더 안정적일 수 있습니다.
    // return <Redirect href="/login" />;
    // 현재 경로가 이미 /login이 아니면 리디렉션
    // (무한 리디렉션 방지)
    // segments 확인이 필요 없을 수도 있음, Expo Router가 처리 가능성 높음
    if (segments[0] !== "login") {
      router.replace("/login"); // replace 사용으로 뒤로가기 스택에 안 남김
    }
    return null; // 리디렉션 중에는 아무것도 렌더링하지 않음
  }

  // 사용자가 있으면 앱 내부 페이지 렌더링
  return (
    <Stack>
      <Stack.Screen
        name="index" // Todo 목록 페이지
        options={{
          title: "나의 할 일 목록",
          headerRight: () => (
            <Button
              title="로그아웃"
              onPress={signOut}
              type="clear"
              titleStyle={{ color: "#3498db" }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="todos/new" // 새 Todo 추가 페이지
        options={{ title: "새 할 일 추가", presentation: "modal" }} // 모달 형태로 표시 (선택)
      />
      <Stack.Screen
        name="todos/[id]" // Todo 상세/수정 페이지
        options={{ title: "할 일 상세보기" }}
      />
      {/* 다른 스크린 설정 추가 가능 */}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
