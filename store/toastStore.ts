import { create } from "zustand";
import Toast, { ToastShowParams } from "react-native-toast-message";

interface ToastState {
  showToast: (params: ToastShowParams) => void;
  hideToast: () => void;
}

// TODO : 추후 토스트 복잡해지면 store 레이어에서 확장이 필요함( 라이브러리도 변경해야함 )
const useToastStore = create<ToastState>(() => ({
  showToast: (params) => {
    Toast.show(params);
  },
  hideToast: () => {
    Toast.hide();
  },
}));

export default useToastStore;
