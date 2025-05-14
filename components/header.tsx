import { Button } from "@rneui/base";
import { View, Text } from "react-native";

// TODO : 스택 등 네비게이션 타입에 따라 기능이 확장되어야함( e.g. 뒤로가기 버튼 )
export default function CommonHeader({
  title,
  logout,
}: {
  title?: string;
  logout?: () => void;
}) {
  return (
    <View
      style={{
        height: 56,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 16,
        backgroundColor: "teal",
      }}
    >
      <Text style={{ color: "white" }}>{title}</Text>
      <Button
        title="Logout"
        onPress={logout}
        buttonStyle={{ backgroundColor: "red" }}
      />
    </View>
  );
}
