import type { Dispatch } from "redux";
import { TodoItemActionTypes, type Todo, type todoItemAction } from "../../../types/todoItem.ts";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";
import { TodosCollectionActionTypes, type todosAction } from "../../../types/todosCollection.ts";

export const updateTodo = (updatedTodo: Todo, oldTodo: Todo) => {
  return async (dispatch: Dispatch<todoItemAction | todosAction>) => {
    try {
      dispatch({ type: TodoItemActionTypes.UPDATE_TODO, payload: { newTodo: updatedTodo } });
      dispatch({ type: TodosCollectionActionTypes.UPDATE_TODO_START, payload: { newTodo: updatedTodo } });

      const response = await $authHost.put<Todo>("task/" + updatedTodo.id, {
        status: updatedTodo.status,
        name: updatedTodo.name,
      });
      dispatch({ type: TodosCollectionActionTypes.SHOULD_FETCH });
      dispatch({ type: TodoItemActionTypes.UPDATE_TODO_SUCCESS, payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);

      dispatch({ type: TodosCollectionActionTypes.UPDATE_TODO_ROLLBACK, payload: { oldTodo } });
      dispatch({
        type: TodoItemActionTypes.UPDATE_TODO_ERROR,
        payload: { oldTodo: updatedTodo, updateError: message },
      });
    }
  };
};
