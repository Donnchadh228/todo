import { memo, useState, type ChangeEvent, type FocusEvent, type HTMLAttributes } from "react";
import type { Todo } from "../../../types/todoItem.ts";
import MyCheckBox from "../../UI/MyCheckBox/MyCheckBox.tsx";

import cl from "./todoItem.module.css";
import MyButton from "../../UI/MyButton/MyButton.tsx";
import MyInput from "../../UI/MyInput/MyInput.tsx";
import { useInput } from "../../../hooks/useInput.ts";

interface TodoItemProps extends HTMLAttributes<HTMLDivElement> {
  todo: Todo;
  onUpdateTodo: (updatedTodo: Todo, oldTodo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

const TodoItem = ({ todo, onUpdateTodo, onRemove, ...props }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { value: editedText, onChange: onSetEditedText, reset: resetText } = useInput<string>(todo.name);

  const handleSave = () => {
    onUpdateTodo({ ...todo, name: editedText }, todo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetText();
    setIsEditing(false);
  };

  const changeTodo = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onUpdateTodo({ ...todo, status: event.target.checked }, todo);
  };

  const removeTodo = () => {
    onRemove(todo);
  };

  const handleBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cl.editing} onBlur={handleBlur}>
        <MyInput type="text" value={editedText} onChange={onSetEditedText} autoFocus />
        <MyButton onClick={handleSave}>✓</MyButton>
        <MyButton onClick={handleCancel}>✗</MyButton>
      </div>
    );
  }

  return (
    <div className={cl.todo} {...props}>
      <div className={cl.title}>{todo.name}</div>
      <div className={cl.wrapperSettings}>
        <MyButton className={cl.edit} onClick={() => setIsEditing(true)}>
          ✏️
        </MyButton>
        <span className={cl.remove} onClick={removeTodo}>
          X
        </span>
        <MyCheckBox checked={todo.status} onChange={changeTodo} />
      </div>
    </div>
  );
};

export default memo(TodoItem, (prevProps, nextProps) => {
  if (prevProps.todo.status !== nextProps.todo.status) {
    return false;
  }

  if (prevProps.todo.name !== nextProps.todo.name) {
    return false;
  }

  return true;
});
