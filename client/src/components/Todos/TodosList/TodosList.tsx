import { type CSSProperties } from "react";
import type { Todo } from "../../../types/todoItem.ts";
import TodoItem from "../TodoItem/TodoItem.tsx";

import { useErrorTimeout } from "../../../hooks/useErrorTimeout.ts";
import { clearError } from "../../../store/actionCreators/todo/clearError.ts";
import MyLoader from "../../UI/MyLoader/MyLoader.tsx";

import cl from "./TodosList.module.css";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
import { useTodoActions } from "../../../hooks/useTodoActions.ts";
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

  const { removeTodo, updateTodo } = useTodoActions();

  return (
    <div className={cl.list} style={style}>
      {updateError && <div className="error">{updateError}</div>}

      {todos.map(todo => {
        return loadingId === todo.id ? (
          <MyLoader key={todo.id} />
        ) : (
          <TodoItem key={todo.id} todo={todo} needNameGroup={true} onUpdateTodo={updateTodo} onRemove={removeTodo} />
        );
      })}

      <div className="error">{removeError}</div>
    </div>
  );
};

export default TodosList;
