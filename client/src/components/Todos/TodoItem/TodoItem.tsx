import type { Todo } from "../../../types/todo.ts";
import MyCheckBox from "../../UI/MyCheckBox/MyCheckBox.tsx";

import cl from "./todoItem.module.css";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const isStatus = todo.status === "1";
  return (
    <div className={cl.todo}>
      <div className={cl.title}>{todo.name}</div>
      <MyCheckBox checked={isStatus ? true : false} />
    </div>
  );
};

export default TodoItem;
