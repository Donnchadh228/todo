import {
  type GroupCollectionState,
  type groupsAction,
  GroupsCollectionActionTypes,
} from "../../types/GroupsCollection.ts";

const initialState: GroupCollectionState = {
  count: 0,
  rows: [],
  isLoading: false,
  fetchError: null,
  currentPage: 1,
  totalPages: 0,
  limit: 10,
};

export const groupReducer = (state = initialState, action: groupsAction): GroupCollectionState => {
  switch (action.type) {
    case GroupsCollectionActionTypes.FETCH_GROUPS:
      return {
        ...state,
        isLoading: true,
        fetchError: null,
      };

    case GroupsCollectionActionTypes.FETCH_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fetchError: null,
        rows: action.payload.rows,
        count: action.payload.count,
        currentPage: action.payload.currentPage,
        limit: action.payload.limit,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };

    case GroupsCollectionActionTypes.FETCH_GROUPS_ERROR:
      return {
        ...state,
        isLoading: false,
        fetchError: action.payload || "Ошибка при загрузке групп",
        rows: [],
        count: 0,
        currentPage: 1,
        totalPages: 0,
      };
    default:
      return state;
  }
};
