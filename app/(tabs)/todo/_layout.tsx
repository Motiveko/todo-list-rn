import { Stack } from "expo-router";
import { Button } from "@rneui/themed";
import useAuthStore from "@/store/authStore";
import { commonHeaderOptions } from "@/styles";

export default function TodoLayout() {
  const { actions } = useAuthStore();
  return (
    <Stack
      screenOptions={{
        ...commonHeaderOptions,
        headerTitleAlign: "center",
        headerRight: () => (
          <Button
            title="Logout"
            onPress={actions.logout}
            buttonStyle={{ backgroundColor: "red" }}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Todo List" }} />
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]/index" options={{ title: "Todo Detail" }} />
    </Stack>
  );
}
