import { type Todo } from "../../../types/todoItem.ts";
import { TodosCollectionActionTypes } from "../../../types/todosCollection.ts";

export const syncTodoInGroup = (todo: Todo) => {
  return {
    type: TodosCollectionActionTypes.SYNC_TODO_IN_GROUP,
    payload: { newTodo: todo },
  };
};
