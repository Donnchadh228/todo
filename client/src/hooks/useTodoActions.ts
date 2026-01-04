import type { Todo } from "../types/todoItem.ts";
import { removeTodo } from "../store/actionCreators/todo/removeTodo.ts";
import { useAppDispatch } from "./redux.ts";
import { updateTodo } from "../store/actionCreators/todo/updateTodo.ts";
import { changeTodoInGroup } from "../store/reducers/groupActive.ts";

export const useTodoActions = () => {
  const dispatch = useAppDispatch();

  const removeTodoHandler = (todo: Todo) => {
    dispatch(removeTodo(todo));
  };

  const updateTodoHandler = (updatedTodo: Todo, oldTodo: Todo) => {
    dispatch(updateTodo(updatedTodo, oldTodo)).then(() => {
      dispatch(changeTodoInGroup(updatedTodo));
    });
  };

  // const updateTodoHandlerGroup = (updatedTodo: Todo, oldTodo: Todo) => {
  //   // dispatch(updateTodo(updatedTodo, oldTodo)).then(() => {
  //   //   dispatch(changeTodoInGroup(updatedTodo));
  //   // });
  // };

  return {
    removeTodo: removeTodoHandler,
    updateTodo: updateTodoHandler,
  };
};
