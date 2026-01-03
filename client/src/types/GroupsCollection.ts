import type { Todo } from "./todoItem.ts";

export interface Group {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
export interface GroupWithTasks extends Group {
  tasks: Todo[];
}

export interface GroupsCollectionResponse {
  count: number;
  rows: GroupWithTasks[];
  limit: number;
  currentPage: number;
}

export interface GroupCollectionState {
  count: number;
  rows: GroupWithTasks[];
  isLoading: boolean;
  isDeleting: boolean;

  fetchError: string | null;
  deleteError: string | null;
  deletedId: number[];

  currentPage: number;
  totalPages: number;
  limit: number;

  createError: string | null;
  createLoading: boolean;

  errorTimestamp?: number;
}
export const GroupsCollectionActionTypes = {
  FETCH_GROUPS: "FETCH_GROUPS",
  FETCH_GROUPS_SUCCESS: "FETCH_GROUPS_SUCCESS",
  FETCH_GROUPS_ERROR: "FETCH_GROUPS_ERROR",

  REMOVE_GROUP: "REMOVE_GROUP",
  REMOVE_GROUP_SUCCESS: "REMOVE_GROUP_SUCCESS",
  REMOVE_GROUP_ERROR: "REMOVE_GROUP_ERROR",

  CLEAR_GROUP_ERROR: "CLEAR_GROUP_ERROR",
} as const;

interface FETCH_GROUPS {
  type: typeof GroupsCollectionActionTypes.FETCH_GROUPS;
}
interface FETCH_GROUPS_SUCCESS {
  type: typeof GroupsCollectionActionTypes.FETCH_GROUPS_SUCCESS;
  payload: GroupsCollectionResponse & { currentPage: number; limit: number };
}
interface FETCH_GROUPS_ERROR {
  type: typeof GroupsCollectionActionTypes.FETCH_GROUPS_ERROR;
  payload?: string;
}
interface REMOVE_GROUP {
  type: typeof GroupsCollectionActionTypes.REMOVE_GROUP;
  payload: { groupId: number };
}
interface REMOVE_GROUP_SUCCESS {
  type: typeof GroupsCollectionActionTypes.REMOVE_GROUP_SUCCESS;
  payload: { groupId: number };
}
interface REMOVE_GROUP_ERROR {
  type: typeof GroupsCollectionActionTypes.REMOVE_GROUP_ERROR;
  payload: { error: string; groupId: number };
}

interface CLEAR_GROUP_ERROR {
  type: typeof GroupsCollectionActionTypes.CLEAR_GROUP_ERROR;
}
export type groupsAction =
  | FETCH_GROUPS
  | FETCH_GROUPS_SUCCESS
  | FETCH_GROUPS_ERROR
  | REMOVE_GROUP
  | REMOVE_GROUP_SUCCESS
  | REMOVE_GROUP_ERROR
  | CLEAR_GROUP_ERROR;
