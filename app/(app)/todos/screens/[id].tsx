import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TodoDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>(); // 타입 명시

  return (
    <View style={styles.container}>
      <Text>Todo Detail Page</Text>
      <Text>Todo ID: {id}</Text>
      {/* TODO: id에 해당하는 할 일 상세 정보 표시 및 수정 기능 */}
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
