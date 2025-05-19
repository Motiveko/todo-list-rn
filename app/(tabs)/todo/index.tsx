import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useAuthenticatedUser, useAuthUser } from "@/store/authStore";
import { Link } from "expo-router";
import { ListItem, CheckBox, Button, Icon } from "@rneui/themed";
import { API } from "@/apis";
import { Todo } from "@/apis/todo";
import Toast from "react-native-toast-message";

export default function TodoListPage() {
  const user = useAuthenticatedUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await API.todo.list();
      setTodos(response);
    } catch (e: any) {
      Toast.show({
        text1: e.message || "Failed to fetch todos",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  if (loading) {
    return (
      <View className="flex">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleToggleDone = (id: number) => {
    // TODO : 실제기능구현
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    // TODO : 실제기능구현
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    Toast.show({
      text1: `Delete todo: ${id}`,
      type: "success",
    });
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <ListItem bottomDivider className="bg-white my-1 rounded-lg shadow">
      <CheckBox
        checked={item.isDone}
        onPress={() => handleToggleDone(item.id)}
        className="p-0 m-0"
      />
      <Link href={`/todo/${item.id}`}>
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
        />
      )}
    </View>
  );
}
