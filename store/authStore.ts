import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage"; // JWT 영구 저장을 위해 필요
import { jwtDecode } from "jwt-decode"; // JWT 디코딩 라이브러리

interface User {
  id: number;
  email: string;
  displayName: string;
}

interface AuthState {
  user: User | null;
  jwt: string | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    loginSuccess: (token: string) => void;
    logout: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    hydrate: () => Promise<void>; // 앱 시작 시 상태 복원
  };
}

// JWT 페이로드 타입 정의 (서버 응답 기준)
interface JwtPayload {
  id: number;
  email: string;
  name: string;
  // exp, iat 등 표준 필드도 있을 수 있음
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  jwt: null,
  isLoading: true, // 초기 로딩 상태 true
  error: null,
  actions: {
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error }),
    loginSuccess: (token) => {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userData: User = {
          id: decoded.id,
          email: decoded.email,
          displayName: decoded.name,
        };
        set({ user: userData, jwt: token, isLoading: false, error: null });
        AsyncStorage.setItem("jwt", token); // AsyncStorage에 JWT 저장
      } catch (e) {
        console.error("Failed to decode JWT or set auth state:", e);
        set({ isLoading: false, error: "로그인 처리 중 오류가 발생했습니다." });
        AsyncStorage.removeItem("jwt"); // 오류 발생 시 저장된 토큰 제거
      }
    },
    logout: async () => {
      set({ user: null, jwt: null, isLoading: false, error: null });
      await AsyncStorage.removeItem("jwt");
      // TODO : 서버 요청 추가
    },
    hydrate: async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token) {
          // 토큰 유효성 검사 (만료 등) 로직 추가 가능
          get().actions.loginSuccess(token); // 저장된 토큰으로 로그인 상태 복원
        } else {
          set({ isLoading: false }); // 토큰 없으면 로딩 종료
        }
      } catch (e) {
        console.error("Failed to hydrate auth state:", e);
        set({ isLoading: false }); // 오류 시 로딩 종료
      }
    },
  },
}));

// 스토어 초기화 시 AsyncStorage에서 JWT 로드 시도
useAuthStore.getState().actions.hydrate();

// 커스텀 훅으로 액션 쉽게 사용하기 (선택 사항)
export const useAuthActions = () => useAuthStore((state) => state.actions);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthJwt = () => useAuthStore((state) => state.jwt);
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export default useAuthStore;
