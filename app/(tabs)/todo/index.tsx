import React, { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useAuthenticatedUser } from "@/store/authStore";
import { Link } from "expo-router";
import { ListItem, CheckBox, Button, Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import {
  Todo,
  useTodoActions,
  useTodoIsLoading,
  useTodoTodos,
} from "@/store/todoStore";

export default function TodoListPage() {
  const user = useAuthenticatedUser();
  const todos = useTodoTodos();
  const isLoading = useTodoIsLoading();
  const { fetchTodos, toggleDone, deleteTodo } = useTodoActions();

  useEffect(() => {
    fetchTodos();
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
    Toast.show({
      text1: `Delete todo: ${id}`,
      type: "success",
    });
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <ListItem
      bottomDivider
      className="flex justify-center bg-white my-1 rounded-lg shadow"
    >
      <CheckBox
        checked={item.isDone}
        onPress={() => toggleDone(item.id)}
        className="p-0 m-0"
      />
      <Link className="flex-1" href={`/todo/${item.id}`}>
        <ListItem.Content>
          <ListItem.Title className="font-bold text-lg">
            {item.title}
          </ListItem.Title>
          <ListItem.Subtitle className="text-gray-600">
            {item.description}
          </ListItem.Subtitle>
        </ListItem.Content>
      </Link>
      <Button
        icon={<Icon name="delete" type="material" color="red" />}
        onPress={() => handleDeleteTodo(item.id)}
        type="clear"
      />
    </ListItem>
  );

  return (
    <View className="flex bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-center">
        {user.email}님의 할일 목록
      </Text>
      {todos.length === 0 && (
        <Text className="text-center text-gray-500">
          아직 등록된 할일이 없어요!
        </Text>
      )}
      {todos.length > 0 && (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          className="w-full"
          onRefresh={fetchTodos}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}
