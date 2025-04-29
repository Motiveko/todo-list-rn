// store/authStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Google Cloud Console에서 발급받은 클라이언트 ID 설정
// 실제 앱에서는 환경 변수 등으로 관리하는 것이 안전합니다.
const GOOGLE_CLIENT_ID_IOS = "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID_ANDROID =
  "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com";
// 웹/개발용 클라이언트 ID도 필요할 수 있습니다.
// const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession(); // 웹 브라우저 리디렉션 처리

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  // 필요한 사용자 정보 추가
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // @ts-ignore
  googleRequest: Google.AuthRequest | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>; // 앱 시작 시 인증 상태 확인
  _setUser: (user: User | null) => void; // 내부 상태 업데이트용
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true, // 초기 로딩 상태 true
  error: null,
  googleRequest: null,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user: user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
      // Google Auth Request 초기화 (로그인 페이지에서 필요)
      const [request] = Google.useAuthRequest({
        iosClientId: GOOGLE_CLIENT_ID_IOS,
        androidClientId: GOOGLE_CLIENT_ID_ANDROID,
        // webClientId: GOOGLE_CLIENT_ID_WEB, // 필요시 추가
        scopes: ["profile", "email"],
      });
      set({ googleRequest: request });
    } catch (e) {
      console.error("Failed to initialize auth state:", e);
      set({ user: null, isLoading: false, error: "인증 상태 초기화 실패" });
    }
  },

  signInWithGoogle: async () => {
    const { googleRequest } = get();
    if (!googleRequest) {
      set({ error: "Google 로그인 설정을 먼저 초기화해야 합니다." });
      console.error("Google Auth Request is not initialized.");
      // initializeAuth를 호출하도록 유도하거나, 여기서 직접 초기화 시도
      await get().initializeAuth(); // 재시도
      if (!get().googleRequest) return; // 그래도 없으면 중단
    }

    set({ isLoading: true, error: null });
    try {
      const result = await googleRequest.promptAsync();

      if (result?.type === "success") {
        const { authentication } = result;
        if (!authentication?.accessToken) {
          throw new Error("액세스 토큰을 받지 못했습니다.");
        }

        // Google API를 호출하여 사용자 정보 가져오기
        const response = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );
        const userInfo = await response.json();

        const loggedInUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          photoUrl: userInfo.picture,
        };

        await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
        await AsyncStorage.setItem("accessToken", authentication.accessToken); // 토큰 저장 (필요시)
        set({ user: loggedInUser, isLoading: false });
      } else if (result?.type === "cancel") {
        set({ isLoading: false, error: "로그인이 취소되었습니다." });
      } else {
        set({ isLoading: false, error: "Google 로그인에 실패했습니다." });
        console.error("Google Sign-In Error:", result);
      }
    } catch (e: any) {
      console.error("Google Sign-In Exception:", e);
      set({
        isLoading: false,
        error: e.message || "Google 로그인 중 오류 발생",
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      // TODO: Google 토큰 만료/무효화 API 호출 (필요한 경우)
      // 예: const accessToken = await AsyncStorage.getItem('accessToken');
      // await Google.revokeAsync({ token: accessToken, ...config }, { revokeUrl: '...' });

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("accessToken"); // 저장된 토큰도 삭제
      set({ user: null, isLoading: false, error: null });
    } catch (e) {
      console.error("Sign out error:", e);
      set({ isLoading: false, error: "로그아웃 실패" });
    }
  },

  _setUser: (user: User | null) => set({ user }), // 내부 업데이트 함수
}));

// 앱 시작 시 초기화 호출 (예: 최상위 레이아웃이나 앱 진입점에서)
// useAuthStore.getState().initializeAuth(); // 비동기이므로 적절한 위치에서 호출 필요
