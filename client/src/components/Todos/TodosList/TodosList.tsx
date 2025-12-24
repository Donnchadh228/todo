import type { todoItemType } from "../../../types/todo.ts";
import TodoItem from "../TodoItem/TodoItem.tsx";
import cl from "./TodosList.module.css";

interface TodosListProps {
  todos: todoItemType[];
}

const TodosList = ({ todos }: TodosListProps) => {
  return (
    <div className={cl.list}>
      {todos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
    </div>
  );
};

export default TodosList;
