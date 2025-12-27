import type { Dispatch } from "redux";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";
import {
  GroupsCollectionActionTypes,
  type groupsAction,
  type GroupsCollectionResponse,
} from "../../../types/GroupsCollection.ts";

export const fetchGroups = (page: number = 1) => {
  return async (dispatch: Dispatch<groupsAction>) => {
    try {
      dispatch({ type: GroupsCollectionActionTypes.FETCH_GROUPS });

      const response = await $authHost.get<GroupsCollectionResponse>("group/?page=" + page);

      dispatch({
        type: GroupsCollectionActionTypes.FETCH_GROUPS_SUCCESS,
        payload: {
          count: response.data.count,
          rows: response.data.rows,
          currentPage: page,
          limit: response.data.limit,
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: GroupsCollectionActionTypes.FETCH_GROUPS_ERROR, payload: message });
    }
  };
};
