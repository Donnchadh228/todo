import type { Todo } from "./todoItem.ts";

export interface TodoState {
  todo: Todo | null;
  createError: string | null;
  updateError: string | null;
  removeError: string | null;
  isLoading: boolean;
  errorTimestamp?: number;
}
export interface TodosCollectionState {
  count: number;
  rows: Todo[];
  isLoading: boolean;
  fetchError: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;

  shouldFetch: boolean;
}

export interface TodosResponse {
  count: number;
  limit: number;
  rows: Todo[];
  currentPage: number;
}

export const TodosCollectionActionTypes = {
  FETCH_TODO: "FETCH_TODO",
  FETCH_TODO_SUCCESS: "FETCH_TODO_SUCCESS",
  FETCH_TODO_ERROR: "FETCH_TODO_ERROR",

  REMOVE_TODO_REMOVE: "REMOVE_TODO_REMOVE",

  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_ROLLBACK: "UPDATE_TODO_ROLLBACK",

  SYNC_TODO_IN_GROUP: "SYNC_TODO_IN_GROUP",

  SHOULD_FETCH: "SHOULD_FETCH",
} as const;

//TODOS
interface FETCH_TODO {
  type: typeof TodosCollectionActionTypes.FETCH_TODO;
}
interface FETCH_TODO_SUCCESS {
  type: typeof TodosCollectionActionTypes.FETCH_TODO_SUCCESS;
  payload: TodosResponse;
}
interface FETCH_TODO_ERROR {
  type: typeof TodosCollectionActionTypes.FETCH_TODO_ERROR;
  payload?: string;
}
interface REMOVE_TODO_REMOVE {
  type: typeof TodosCollectionActionTypes.REMOVE_TODO_REMOVE;
  payload: { error?: string; todo: Todo };
}

interface UPDATE_TODO_START {
  type: typeof TodosCollectionActionTypes.UPDATE_TODO_START;
  payload: { newTodo: Todo };
}
interface UPDATE_TODO_ROLLBACK {
  type: typeof TodosCollectionActionTypes.UPDATE_TODO_ROLLBACK;
  payload: { oldTodo: Todo };
}
interface SYNC_TODO_IN_GROUP {
  type: typeof TodosCollectionActionTypes.SYNC_TODO_IN_GROUP;
  payload: { newTodo: Todo; group: { name: string } };
}
interface SHOULD_FETCH {
  type: typeof TodosCollectionActionTypes.SHOULD_FETCH;
}

export type todosAction =
  | FETCH_TODO
  | FETCH_TODO_SUCCESS
  | FETCH_TODO_ERROR
  | REMOVE_TODO_REMOVE
  | UPDATE_TODO_ROLLBACK
  | UPDATE_TODO_START
  | SYNC_TODO_IN_GROUP
  | SHOULD_FETCH;
