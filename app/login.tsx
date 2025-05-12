import React from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  useAuthUser,
  useAuthIsLoading,
  useAuthError,
} from "../store/authStore"; // Zustand 상태 가져오기
import useGoogleAuthentication from "../hooks/useGoogleAuthentication"; // 위에서 만든 훅 임포트
import { Link, Redirect } from "expo-router"; // expo-router 사용 시

const LoginScreen = () => {
  const user = useAuthUser();
  const isLoading = useAuthIsLoading(); // Google 로그인 + 백엔드 통신 로딩 상태
  const authError = useAuthError();
  const {
    signIn,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuthentication(); // Google 로그인 훅 사용

  // Zustand의 isLoading은 백엔드 통신 포함, isGoogleLoading은 Google 로그인 창 띄우는 과정의 로딩일 수 있음.
  // 필요에 따라 로딩 상태를 통합하거나 분리하여 사용
  const combinedLoading = isLoading || isGoogleLoading;
  const combinedError = authError || googleError;

  // 이미 로그인 되어 있다면 홈 화면 등으로 리디렉션 (expo-router 예시)
  if (user) {
    return <Redirect href="/(app)/main" />; // 예시 경로
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      {combinedLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Google 계정으로 로그인"
          onPress={signIn}
          disabled={!signIn} // signIn 함수 준비 안됐을 때 비활성화
        />
      )}

      {combinedError && <Text style={styles.errorText}>{combinedError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    marginTop: 15,
    color: "red",
    textAlign: "center",
  },
});

export default LoginScreen;
