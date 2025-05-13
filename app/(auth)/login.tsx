import React from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuthError } from "@/store/authStore"; // Zustand 상태 가져오기
import useGoogleAuthentication from "@/hooks/useGoogleAuthentication"; // 위에서 만든 훅 임포트

const LoginScreen = () => {
  const authError = useAuthError();
  const { signIn, isLoading, error: googleError } = useGoogleAuthentication(); // Google 로그인 훅 사용
  const combinedLoading = isLoading;
  const combinedError = authError || googleError;

  return (
    <View style={styles.container}>
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
