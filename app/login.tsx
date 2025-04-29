// app/login.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Text } from "@rneui/themed";
import { useAuthStore } from "../store/authStore";
import { Redirect, useRouter } from "expo-router";

export default function LoginScreen() {
  const {
    signInWithGoogle,
    isLoading,
    error,
    user,
    googleRequest,
    initializeAuth,
  } = useAuthStore();
  const router = useRouter();

  // 컴포넌트 마운트 시 Google Auth Request 초기화 확인/실행
  useEffect(() => {
    if (!googleRequest) {
      initializeAuth();
    }
  }, [googleRequest, initializeAuth]);

  // 로그인 성공 시 (app) 그룹의 메인 페이지로 이동
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>
        Todo App 로그인
      </Text>
      {isLoading && <ActivityIndicator size="large" color="#3498db" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        title="Google 계정으로 로그인"
        icon={{ name: "google", type: "font-awesome", color: "white" }}
        onPress={signInWithGoogle}
        disabled={isLoading || !googleRequest} // 로딩 중이거나 request 준비 안됐으면 비활성화
        loading={isLoading}
        buttonStyle={styles.button}
      />
      {!googleRequest && !isLoading && (
        <Text style={styles.errorText}>
          로그인 설정을 로드 중입니다. 잠시 후 다시 시도해주세요.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: 40,
    color: "#333",
  },
  button: {
    backgroundColor: "#4285F4", // Google Blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 250,
  },
  errorText: {
    color: "red",
    marginTop: 15,
    textAlign: "center",
  },
});
