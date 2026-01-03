import { useCallback, type CSSProperties } from "react";
import type { Todo } from "../../../types/todoItem.ts";
import TodoItem from "../TodoItem/TodoItem.tsx";

import { removeTodo } from "../../../store/actionCreators/todo/removeTodo.ts";
import { updateTodo } from "../../../store/actionCreators/todo/updateTodo.ts";
import { useErrorTimeout } from "../../../hooks/useErrorTimeout.ts";
import { clearError } from "../../../store/actionCreators/todo/clearError.ts";
import MyLoader from "../../UI/MyLoader/MyLoader.tsx";

import cl from "./TodosList.module.css";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
interface TodosListProps {
  todos: Todo[];
  style?: CSSProperties;
}

const TodosList = ({ todos, style }: TodosListProps) => {
  const { removeError, updateError, errorTimestamp, loadingId } = useTypedSelector(state => state.todo);
  const dispatch = useAppDispatch();

  useErrorTimeout(
    errorTimestamp,
    () => {
      dispatch(clearError());
    },
    4000,
  );

  const removeTodoHandler = useCallback(
    (todo: Todo) => {
      dispatch(removeTodo(todo));
    },
    [dispatch],
  );

  const updateTodoHandler = useCallback(
    (updatedTodo: Todo, oldTodo: Todo) => {
      dispatch(updateTodo(updatedTodo, oldTodo));
    },
    [dispatch],
  );

  return (
    <div className={cl.list} style={style}>
      {updateError && <div className="error">{updateError}</div>}

      {todos.map(todo => {
        return loadingId === todo.id ? (
          <MyLoader key={todo.id} />
        ) : (
          <TodoItem key={todo.id} todo={todo} onUpdateTodo={updateTodoHandler} onRemove={removeTodoHandler} />
        );
      })}

      <div className="error">{removeError}</div>
    </div>
  );
};

export default TodosList;
