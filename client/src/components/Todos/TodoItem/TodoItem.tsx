import { memo, useState, type ChangeEvent, type FocusEvent, type HTMLAttributes } from "react";
import type { Todo } from "../../../types/todoItem.ts";
import MyCheckBox from "../../UI/MyCheckBox/MyCheckBox.tsx";

import MyButton from "../../UI/MyButton/MyButton.tsx";
import MyInput from "../../UI/MyInput/MyInput.tsx";
import { useInput } from "../../../hooks/useInput.ts";

import cl from "./todoItem.module.css";
import { areTodoItemsEqual } from "../../../utils/memoComparisons.ts";

interface TodoItemProps extends HTMLAttributes<HTMLDivElement> {
  todo: Todo;
  onUpdateTodo?: (updatedTodo: Todo, oldTodo: Todo) => void;
  onRemove?: (todo: Todo) => void;
  needNameGroup?: boolean;
}

const TodoItem = ({ todo, onUpdateTodo, onRemove, needNameGroup, className = "", ...props }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { value: editedText, onChange: onSetEditedText, setValue: setEditedText } = useInput<string>(todo.name);

  const handleSave = () => {
    onUpdateTodo?.({ ...todo, name: editedText }, todo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(todo.name);
    setIsEditing(false);
  };

  const changeTodo = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onUpdateTodo?.({ ...todo, status: event.target.checked }, todo);
  };

  const removeTodo = () => {
    onRemove?.(todo);
  };

  const handleBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      handleCancel();
    }
  };

  if (isEditing && onUpdateTodo) {
    return (
      <div className={cl.editing} onBlur={handleBlur}>
        <MyInput type="text" value={editedText} onChange={onSetEditedText} autoFocus />
        <MyButton onClick={handleSave}>✓</MyButton>
        <MyButton onClick={handleCancel}>✗</MyButton>
      </div>
    );
  }
  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, todo: Todo) => {
    e.dataTransfer.setData("todoId", todo.id.toString());
    e.dataTransfer.setData("todoName", todo.name);
  };

  return (
    <div
      className={`${cl.todo} ${todo.status && cl.active} ${className}`}
      {...props}
      onDragStart={e => dragStartHandler(e, todo)}
      draggable="true">
      <div className={cl.title}>{todo.name}</div>
      <div className={cl.wrapperSettings}>
        {onUpdateTodo && (
          <MyButton className={cl.edit} onClick={() => setIsEditing(true)}>
            ✏️
          </MyButton>
        )}
        {onRemove && (
          <button className="remove" onClick={removeTodo}>
            X
          </button>
        )}
        {onUpdateTodo && <MyCheckBox checked={todo.status} onChange={changeTodo} />}
      </div>
      {needNameGroup && todo.group?.name && <div className={cl.groupText}>{todo.group.name}</div>}
    </div>
  );
};

export default memo(TodoItem, areTodoItemsEqual);
