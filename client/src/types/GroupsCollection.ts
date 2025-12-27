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
}

export interface GroupCollectionState {
  count: number;
  rows: GroupWithTasks[];
  isLoading: boolean;
  fetchError: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;
}
export const GroupsCollectionActionTypes = {
  FETCH_GROUPS: "FETCH_GROUPS",
  FETCH_GROUPS_SUCCESS: "FETCH_GROUPS_SUCCESS",
  FETCH_GROUPS_ERROR: "FETCH_GROUPS_ERROR",
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
export type groupsAction = FETCH_GROUPS | FETCH_GROUPS_SUCCESS | FETCH_GROUPS_ERROR;
