import type { Dispatch } from "redux";
import { TodoItemActionTypes, type Todo, type todoItemAction } from "../../../types/todoItem.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";
import { $authHost } from "../../../http/index.ts";
import { TodosCollectionActionTypes, type todosAction } from "../../../types/todosCollection.ts";

export const removeTodo = (todo: Todo) => {
  return async (dispatch: Dispatch<todoItemAction | todosAction>) => {
    try {
      dispatch({ type: TodoItemActionTypes.REMOVE_TODO, payload: { todoId: todo.id } });

      const response = await $authHost.delete<number>("task/" + todo.id);
      if (response.data < 1) {
        return dispatch({
          type: TodoItemActionTypes.REMOVE_TODO_ERROR,
          payload: { error: "ошибка при удалении", todo: todo },
        });
      }

      dispatch({ type: TodoItemActionTypes.REMOVE_TODO_SUCCESS, payload: todo });

      dispatch({ type: TodosCollectionActionTypes.REMOVE_TODO_REMOVE, payload: { todo } });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: TodoItemActionTypes.REMOVE_TODO_ERROR, payload: { error: message, todo: todo } });
    }
  };
};
