export interface Todo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
}
