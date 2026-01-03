import type { Todo } from "../types/todoItem.ts";

export const areTodoItemsEqual = (
  prevProps: Readonly<{ todo: Todo }>,
  nextProps: Readonly<{ todo: Todo }>,
): boolean => {
  if (prevProps.todo.status !== nextProps.todo.status) {
    return false;
  }

  if (prevProps.todo.name !== nextProps.todo.name) {
    return false;
  }

  return true;
};
export const areGroupItemsEqual = (
  prevProps: Readonly<{ todo: Todo }>,
  nextProps: Readonly<{ todo: Todo }>,
): boolean => {
  if (prevProps.todo.status !== nextProps.todo.status) {
    return false;
  }

  if (prevProps.todo.name !== nextProps.todo.name) {
    return false;
  }

  return true;
};
