import type { Dispatch } from "redux";
import { TodoItemActionTypes, type Todo, type todoItemAction } from "../../../types/todoItem.ts";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const createTodo = (name: string) => {
  return async (dispatch: Dispatch<todoItemAction>) => {
    if (name.length <= 2) {
      const errorMsg = "Название не может быть меньше 2-х символов";
      dispatch({
        type: TodoItemActionTypes.CREATE_TODO_ERROR,
        payload: errorMsg,
      });
      throw "";
    }

    try {
      dispatch({ type: TodoItemActionTypes.CREATE_TODO });

      const response = await $authHost.post<Todo>("task/", { name });
      dispatch({ type: TodoItemActionTypes.CREATE_TODO_SUCCESS, payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: TodoItemActionTypes.CREATE_TODO_ERROR, payload: message });
      throw error;
    }
  };
};
