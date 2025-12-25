import type { CSSProperties } from "react";
import type { Todo } from "../../../types/todo.ts";
import TodoItem from "../TodoItem/TodoItem.tsx";
import cl from "./TodosList.module.css";

interface TodosListProps {
  todos: Todo[];
  style?: CSSProperties;
}

const TodosList = ({ todos, style }: TodosListProps) => {
  return (
    <div className={cl.list} style={style}>
      {todos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
    </div>
  );
};

export default TodosList;
