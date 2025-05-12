import { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  useAuthActions,
  useAuthIsLoading,
  useAuthError,
} from "@/store/authStore"; // Zustand 액션 임포트
import { Config } from "@/config/env";

// Expo Go 또는 웹 환경에서 웹 브라우저를 사용하여 인증 결과를 앱으로 리디렉션 가능하게 함
WebBrowser.maybeCompleteAuthSession();

const useGoogleAuthentication = () => {
  const { loginSuccess, setLoading, setError } = useAuthActions();
  // const iosClientId = Constants.expoConfig?.extra?.googleClientIdIos; // iOS 구현 시

  // 플랫폼에 맞는 클라이언트 ID 선택
  // Expo Go에서는 webClientId를 사용하는 경우가 많음
  // 독립 실행형 Android 앱에서는 androidClientId 사용
  // 실제 빌드 환경 및 테스트 환경에 따라 조정 필요

  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: webClientId, // Expo Go / Web 에서 사용
    androidClientId: Config.googleAndroidClientId,
    webClientId: Config.googleWebClientId,
    scopes: ["profile", "email"], // 필요한 정보 범위 요청
    // selectAccount: true, // 항상 계정 선택 화면 표시 (선택 사항)
  });

  useEffect(() => {
    const handleAuthentication = async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const backendResponse = await fetch(Config.apiHost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, clientId: Config.googleClientId }), // Google ID Token 전송
        });

        if (!backendResponse.ok) {
          // 서버 응답 에러 처리 (4xx, 5xx)
          const errorData = await backendResponse.json().catch(() => ({})); // JSON 파싱 실패 대비
          console.error("Backend Error:", backendResponse.status, errorData);
          throw new Error(
            errorData.message || `서버 통신 오류 (${backendResponse.status})`
          );
        }

        const data = await backendResponse.json();

        if (data.accessToken) {
          loginSuccess(data.accessToken); // Zustand 스토어 업데이트
        } else {
          throw new Error("서버 응답에 accessToken이 없습니다.");
        }
      } catch (error: any) {
        console.error("Google Sign-In - Backend Communication Error:", error);
        setError(error.message || "로그인 중 문제가 발생했습니다.");
        setLoading(false); // 에러 시 로딩 상태 해제
      }
    };

    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        // **중요**: 백엔드가 어떤 토큰을 기대하는지 확인 필요.
        // 보통 idToken을 보내 사용자 인증/정보 확인에 사용.
        console.log("authentication:", JSON.stringify(authentication, null, 2));
        handleAuthentication(authentication.idToken);
      } else if (authentication?.accessToken) {
        // 만약 백엔드가 Access Token을 요구한다면 이것을 사용.
        // handleAuthentication(authentication.accessToken);
        console.warn(
          "ID Token not found, but Access Token is available. Ensure backend expects Access Token."
        );
        setError("Google 인증 중 ID 토큰을 받지 못했습니다."); // 또는 다른 에러 처리
      } else {
        console.error(
          "Authentication success, but no token found:",
          authentication
        );
        setError("Google 인증 후 토큰을 받지 못했습니다.");
      }
    } else if (response?.type === "error") {
      console.error("Google Sign-In Error:", response.error);
      setError(
        response.error?.message || "Google 로그인 중 오류가 발생했습니다."
      );
    } else if (response?.type === "cancel") {
      // 사용자가 로그인을 취소함
      console.log("Google Sign-In Cancelled");
      // 필요시 상태 업데이트 (예: setError(null), setLoading(false))
    }
  }, [response, loginSuccess, setLoading, setError]); // response 객체가 변경될 때마다 실행

  const signIn = async () => {
    if (!request) {
      setError("Google 로그인 요청을 초기화할 수 없습니다.");
      return;
    }

    setError(null); // 이전 에러 초기화
    // promptAsync는 브라우저 또는 Google 로그인 화면을 엽니다.
    await promptAsync({});
  };

  return { signIn, isLoading: useAuthIsLoading(), error: useAuthError() }; // 로그인 함수, 로딩 상태, 에러 상태 반환
};

export default useGoogleAuthentication;
