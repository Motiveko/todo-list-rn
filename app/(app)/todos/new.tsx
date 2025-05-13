import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NewTodoPage() {
  return (
    <View style={styles.container}>
      <Text>New Todo Page</Text>
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
