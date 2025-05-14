import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

// TODO : stack이랑 tab이랑 헤더 옵션값이 좀 달라서 수동으로 타입을 만들어줌.
// drawer 등 다른 navigation 적용시 타입 계속 확장해야 할 수 있음
type CommonHeaderOptions = Pick<
  BottomTabNavigationOptions,
  "headerStyle" | "headerTintColor" | "headerTitleStyle"
> &
  Pick<
    NativeStackNavigationOptions,
    "headerStyle" | "headerTintColor" | "headerTitleStyle"
  >;

export const commonHeaderOptions: CommonHeaderOptions = {
  headerStyle: {
    backgroundColor: "teal", // 원하는 배경색
    elevation: 4, // Android에서 그림자 효과 (선택 사항)
    height: 56,
    // shadowOpacity: 0.3, // iOS에서 그림자 효과 (선택 사항)
    // height: 56, // 원하는 특정 높이 (필요한 경우, 플랫폼별로 다를 수 있음)
  },
  headerTintColor: "#FFFFFF", // 헤더의 텍스트 및 아이콘 색상
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 18, // 원하는 폰트 크기
    // fontFamily: 'YourCustomFont', // 커스텀 폰트 사용 시
  },
  // headerTitleAlign: 'center', // 제목 중앙 정렬 (선택 사항)
  // headerBackTitleVisible: false, // iOS에서 뒤로가기 버튼 옆 텍스트 숨기기
};
