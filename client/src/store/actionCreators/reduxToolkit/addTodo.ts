import type { AppDispatch } from "../../index.ts";
import { $authHost } from "../../../http/index.ts";
import type { Todo } from "../../../types/todoItem.ts";
import { changeTodoSuccess } from "../../reducers/groupActive.ts";
import { syncTodoInGroup } from "../todo/syncTodosInGroup.ts";

export const addTodoToGroup =
  (todo: { id: number; name: string }, group: { id: number; name: string }) => async (dispatch: AppDispatch) => {
    try {
      const response = await $authHost.put<Todo>("task/" + todo.id, {
        groupId: group.id,
        name: todo.name,
      });
      dispatch(changeTodoSuccess(response.data));
      dispatch(syncTodoInGroup({ ...response.data, group: { name: group.name } }));
    } catch {
      //
    }
  };
