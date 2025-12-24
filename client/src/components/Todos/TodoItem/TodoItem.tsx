import type { TodoType } from "../../../types/todo.ts";
import MyCheckBox from "../../UI/MyCheckBox/MyCheckBox.tsx";

import cl from "./todoItem.module.css";

interface TodoItemProps {
  todo: TodoType;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  return (
    <div className={cl.todo}>
      <div className={cl.title}>{todo.name}</div>
      <div className={`${cl.status} ${todo.status ? cl.active : ""}`}>{}</div>
      <MyCheckBox checked={todo.status ? true : false} />
    </div>
  );
};

export default TodoItem;
