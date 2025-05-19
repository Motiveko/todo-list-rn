import { API } from "@/apis";
import Toast from "react-native-toast-message";
import { create } from "zustand";

export interface Todo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

export interface CreateTodoDto {
  title: string;
  description: string;
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  actions: {
    setLoading: (loading: boolean) => void;
    setTodos: (todos: Todo[]) => void;
    fetchTodos: (showLoading?: boolean) => Promise<void>;
    createTodo: (todo: CreateTodoDto) => Promise<void>;
    toggleDone: (id: number) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
  };
}

const callWithLoading = async (
  func: () => Promise<void>,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    await func();
  } catch (ignore) {}
  setLoading(false);
};

const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  actions: {
    setLoading: (loading) => set({ isLoading: loading }),
    setTodos: (todos) => set({ todos }),
    fetchTodos: async (showLoading = true) => {
      if (showLoading) {
        return callWithLoading(
          () => get().actions.fetchTodos(false),
          get().actions.setLoading
        );
      }

      try {
        const todos = await API.todo.list();
        get().actions.setTodos(todos);
      } catch (error: any) {
        console.error(error);
        Toast.show({
          text1: error.message || "Failed to fetch todos",
          type: "error",
        });
      }
    },
    createTodo: async (todo: CreateTodoDto) => {
      try {
        get().actions.setLoading(true);
        await API.todo.create(todo);
        Toast.show({
          text1: "할일을 추가했어요!",
          type: "success",
        });
        get().actions.fetchTodos(false);
      } catch (error: any) {
        console.error(error);
        Toast.show({
          text1: error.message || "Failed to create todo",
          type: "error",
        });
      } finally {
        get().actions.setLoading(false);
      }
    },
    toggleDone: async (id: number) => {
      try {
        await API.todo.toggleDone(id);
        get().actions.fetchTodos(false);
      } catch (error: any) {
        console.error(error);
        Toast.show({
          text1: error.message || "Failed to toggle done",
          type: "error",
        });
      }
    },
    deleteTodo: async (id: number) => {
      try {
        await API.todo.delete(id);
        Toast.show({
          text1: "할일을 삭제했어요!",
          type: "success",
        });
        get().actions.fetchTodos(false);
      } catch (error: any) {
        console.error(error);
        Toast.show({
          text1: error.message || "Failed to delete todo",
          type: "error",
        });
      }
    },
  },
}));

export const useTodoActions = () => useTodoStore((state) => state.actions);
export const useTodoTodos = () => useTodoStore((state) => state.todos);
export const useTodoIsLoading = () => useTodoStore((state) => state.isLoading);
