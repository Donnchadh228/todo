export interface Todo {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  groupId: number | null;
}
export interface TodoState {
  count: number;
  rows: Todo[];
  isLoading: boolean;
  fetchError: string | null;
  createError: string | null;

  currentPage: number;
  totalPages: number;
  limit: number;
}
export interface TodoResponse {
  count: number;
  limit: number;
  rows: Todo[];
  currentPage: number;
}

export const TodoActionTypes = {
  FETCH_TODO: "FETCH_TODO",
  FETCH_TODO_SUCCESS: "FETCH_TODO_SUCCESS",
  FETCH_TODO_ERROR: "FETCH_TODO_ERROR",

  CREATE_TODO: "CREATE_TODO",
  CREATE_TODO_SUCCESS: "CREATE_TODO_SUCCESS",
  CREATE_TODO_ERROR: "CREATE_TODO_ERROR",
} as const;

interface FETCH_TODO {
  type: typeof TodoActionTypes.FETCH_TODO;
}
interface FETCH_TODO_SUCCESS {
  type: typeof TodoActionTypes.FETCH_TODO_SUCCESS;
  payload: TodoResponse;
}
interface FETCH_TODO_ERROR {
  type: typeof TodoActionTypes.FETCH_TODO_ERROR;
  payload?: string;
}

interface CREATE_TODO {
  type: typeof TodoActionTypes.CREATE_TODO;
}
interface CREATE_TODO_SUCCESS {
  type: typeof TodoActionTypes.CREATE_TODO_SUCCESS;
  payload: Todo;
}
interface CREATE_TODO_ERROR {
  type: typeof TodoActionTypes.CREATE_TODO_ERROR;
  payload?: string;
}

export type todoAction =
  | FETCH_TODO
  | FETCH_TODO_SUCCESS
  | FETCH_TODO_ERROR
  | CREATE_TODO
  | CREATE_TODO_SUCCESS
  | CREATE_TODO_ERROR;
