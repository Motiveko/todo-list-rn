import { Stack } from "expo-router";
import useAuthStore from "@/store/authStore";
import CommonHeader from "@/components/header";

export default function TodoLayout() {
  const { actions } = useAuthStore();
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        header: (props) => (
          <CommonHeader title={props.options.title} logout={actions.logout} />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Todo List" }} />
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]/index" options={{ title: "Todo Detail" }} />
    </Stack>
  );
}
