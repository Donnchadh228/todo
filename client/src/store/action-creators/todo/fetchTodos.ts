import type { Dispatch } from "redux";
import { TodosCollectionActionTypes, type todosAction, type TodosResponse } from "../../../types/todosCollection.ts";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";

export const fetchTodos = (page: number = 1) => {
  return async (dispatch: Dispatch<todosAction>) => {
    try {
      dispatch({ type: TodosCollectionActionTypes.FETCH_TODO });

      const response = await $authHost.get<TodosResponse>("task/?page=" + page);
      console.log(response.data);
      dispatch({
        type: TodosCollectionActionTypes.FETCH_TODO_SUCCESS,
        payload: { ...response.data, currentPage: page },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: TodosCollectionActionTypes.FETCH_TODO_ERROR, payload: message });
    }
  };
};
