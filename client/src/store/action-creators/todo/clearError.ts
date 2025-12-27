import type { Dispatch } from "redux";
import { TodoItemActionTypes, type todoItemAction } from "../../../types/todoItem.ts";

export const clearError = () => {
  return async (dispatch: Dispatch<todoItemAction>) => {
    dispatch({ type: TodoItemActionTypes.CLEAR_ERROR, payload: "" });
  };
};
