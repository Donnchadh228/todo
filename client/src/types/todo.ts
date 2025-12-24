export interface Todo {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  groupId: number | null;
}
export interface TodoState {
  count: number;
  rows: Todo[];
  isLoading: boolean;
  error: string;

  currentPage: number;
  totalPages: number;
  limit: number;
}
export interface TodoResponse {
  count: number;
  rows: Todo[];
}

export const TodoActionTypes = {
  FETCH_TODO: "FETCH_TODO",
  FETCH_TODO_SUCCESS: "FETCH_TODO_SUCCESS",
  FETCH_TODO_ERROR: "FETCH_TODO_ERROR",
} as const;

interface FETCH_TODO {
  type: typeof TodoActionTypes.FETCH_TODO;
}
interface FETCH_TODO_SUCCESS {
  type: typeof TodoActionTypes.FETCH_TODO_SUCCESS;
  payload?: TodoResponse;
}
interface FETCH_TODO_ERROR {
  type: typeof TodoActionTypes.FETCH_TODO_ERROR;
}

export type todoAction = FETCH_TODO | FETCH_TODO_SUCCESS | FETCH_TODO_ERROR;
