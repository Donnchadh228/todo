import type { Dispatch } from "redux";
import { TodoActionTypes, type todoAction, type TodoResponse } from "../../../types/todo.ts";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const fetchTodos = (page: number = 1) => {
  return async (dispatch: Dispatch<todoAction>) => {
    try {
      dispatch({ type: TodoActionTypes.FETCH_TODO });

      const response = await $authHost.get<TodoResponse>("task/?page=" + page);

      dispatch({ type: TodoActionTypes.FETCH_TODO_SUCCESS, payload: { ...response.data, currentPage: page } });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: TodoActionTypes.FETCH_TODO_ERROR, payload: message });
    }
  };
};
