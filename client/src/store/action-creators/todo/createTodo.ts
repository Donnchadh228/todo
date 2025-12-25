import type { Dispatch } from "redux";
import { TodoActionTypes, type Todo, type todoAction } from "../../../types/todo.ts";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const createTodo = (name: string) => {
  return async (dispatch: Dispatch<todoAction>) => {
    try {
      dispatch({ type: TodoActionTypes.CREATE_TODO });
      if (name.length <= 3) {
        dispatch({ type: TodoActionTypes.CREATE_TODO_ERROR, payload: "Название не может быть меньше 3-х символов" });
        return;
      }
      const response = await $authHost.post<Todo>("task/", { name });

      dispatch({ type: TodoActionTypes.CREATE_TODO_SUCCESS, payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: TodoActionTypes.CREATE_TODO_ERROR, payload: message });
    }
  };
};
