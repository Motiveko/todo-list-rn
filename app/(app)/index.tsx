// app/(app)/index.tsx
import React, { useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Text, ListItem, CheckBox, Button, Icon } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useTodoStore, Todo } from "../../store/todoStore";

export default function TodoListScreen() {
  const router = useRouter();
  const { todos, isLoading, error, fetchTodos, toggleTodo, deleteTodo } =
    useTodoStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 Todo 목록 가져오기
    fetchTodos();
  }, [fetchTodos]);

  const renderItem = ({ item }: { item: Todo }) => (
    <ListItem.Swipeable
      bottomDivider
      onPress={() => router.push(`/todos/${item.id}`)} // 상세 페이지로 이동
      leftContent={(
        reset // 왼쪽 스와이프 (완료/미완료 토글)
      ) => (
        <Button
          title={item.completed ? "미완료" : "완료"}
          onPress={() => {
            toggleTodo(item.id);
            reset();
          }}
          icon={{ name: item.completed ? "undo" : "check", color: "white" }}
          buttonStyle={{
            minHeight: "100%",
            backgroundColor: item.completed ? "#f39c12" : "#2ecc71",
          }}
        />
      )}
      rightContent={(
        reset // 오른쪽 스와이프 (삭제)
      ) => (
        <Button
          title="삭제"
          onPress={() => {
            deleteTodo(item.id);
            reset();
          }}
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{ minHeight: "100%", backgroundColor: "#e74c3c" }}
        />
      )}
    >
      <CheckBox
        checked={item.completed}
        onPress={() => toggleTodo(item.id)}
        iconType="material-community"
        checkedIcon="checkbox-marked-outline"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#2ecc71"
      />
      <ListItem.Content>
        <ListItem.Title style={item.completed ? styles.completedText : null}>
          {item.text}
        </ListItem.Title>
        {/* <ListItem.Subtitle>{new Date(item.createdAt).toLocaleString()}</ListItem.Subtitle> */}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>할 일이 없습니다!</Text>
        }
        refreshControl={
          // 당겨서 새로고침
          <RefreshControl refreshing={isLoading} onRefresh={fetchTodos} />
        }
        style={styles.list}
      />

      {/* 새 Todo 추가 버튼 */}
      <Button
        icon={<Icon name="add" color="white" />}
        title="새 할 일 추가"
        onPress={() => router.push("/todos/new")}
        containerStyle={styles.addButtonContainer}
        buttonStyle={styles.addButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 10,
    backgroundColor: "#ffe0e0",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  addButton: {
    borderRadius: 30, // 원형 버튼
    padding: 15,
    backgroundColor: "#3498db",
  },
});
