import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthUser } from "@/store/authStore";

export default function TodoListPage() {
  const user = useAuthUser();
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>{user.email} Todo List Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
