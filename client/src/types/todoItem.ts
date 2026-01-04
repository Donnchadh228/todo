export interface Todo {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  groupId: number | null;
  group: { name: string };
}

export interface TodoState {
  todo: Todo | null;
  createError: string | null;
  updateError: string | null;
  removeError: string | null;
  isLoading: boolean;
  errorTimestamp?: number;
  loadingId: number | null;
}

export const TodoItemActionTypes = {
  CREATE_TODO: "CREATE_TODO",
  CREATE_TODO_SUCCESS: "CREATE_TODO_SUCCESS",
  CREATE_TODO_ERROR: "CREATE_TODO_ERROR",

  REMOVE_TODO: "REMOVE_TODO",
  REMOVE_TODO_SUCCESS: "REMOVE_TODO_SUCCESS",
  REMOVE_TODO_ERROR: "REMOVE_TODO_ERROR",

  UPDATE_TODO: "UPDATE_TODO",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

  CLEAR_ERROR: "CLEAR_ERROR",
} as const;

// TODO
interface CREATE_TODO {
  type: typeof TodoItemActionTypes.CREATE_TODO;
}
interface CREATE_TODO_SUCCESS {
  type: typeof TodoItemActionTypes.CREATE_TODO_SUCCESS;
  payload: Todo;
}
interface CREATE_TODO_ERROR {
  type: typeof TodoItemActionTypes.CREATE_TODO_ERROR;
  payload?: string;
}

interface REMOVE_TODO {
  type: typeof TodoItemActionTypes.REMOVE_TODO;
  payload: { todoId: number };
}
interface REMOVE_TODO_SUCCESS {
  type: typeof TodoItemActionTypes.REMOVE_TODO_SUCCESS;
  payload: { id: number };
}
interface REMOVE_TODO_ERROR {
  type: typeof TodoItemActionTypes.REMOVE_TODO_ERROR;
  payload: { error: string; todo: Todo };
}

interface UPDATE_TODO {
  type: typeof TodoItemActionTypes.UPDATE_TODO;
  payload: { newTodo: Todo };
}
interface UPDATE_TODO_SUCCESS {
  type: typeof TodoItemActionTypes.UPDATE_TODO_SUCCESS;
  payload: Todo;
}
interface UPDATE_TODO_ERROR {
  type: typeof TodoItemActionTypes.UPDATE_TODO_ERROR;
  payload: { updateError: string | null; oldTodo: Todo };
}
interface CLEAR_ERROR {
  type: typeof TodoItemActionTypes.CLEAR_ERROR;
}

export type todoItemAction =
  | CREATE_TODO
  | CREATE_TODO_SUCCESS
  | CREATE_TODO_ERROR
  | REMOVE_TODO
  | REMOVE_TODO_SUCCESS
  | REMOVE_TODO_ERROR
  | UPDATE_TODO
  | UPDATE_TODO_SUCCESS
  | UPDATE_TODO_ERROR
  | CLEAR_ERROR;
