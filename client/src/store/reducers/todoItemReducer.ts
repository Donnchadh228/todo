import { TodoItemActionTypes, type todoItemAction, type TodoState } from "../../types/todoItem.ts";

const initialState: TodoState = {
  todo: null,
  createError: null,
  updateError: null,
  isLoading: false,
  loadingId: null,
  removeError: null,
};

export const todoItemReducer = (state = initialState, action: todoItemAction): TodoState => {
  switch (action.type) {
    case TodoItemActionTypes.CREATE_TODO:
      return {
        ...state,
        createError: "",
        isLoading: true,
      };
    case TodoItemActionTypes.CREATE_TODO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        createError: "",
        todo: action.payload,
      };
    }
    case TodoItemActionTypes.CREATE_TODO_ERROR:
      return {
        ...state,
        createError: action.payload || "Ошибка при создании",
        isLoading: false,
        errorTimestamp: Date.now(),
      };
    case TodoItemActionTypes.CLEAR_ERROR:
      return {
        ...state,
        createError: "",
        isLoading: false,
        updateError: "",
        removeError: "",
      };

    case TodoItemActionTypes.REMOVE_TODO:
      return { ...state, loadingId: action.payload.todoId, removeError: "" };
    case TodoItemActionTypes.REMOVE_TODO_SUCCESS:
      return { ...state, loadingId: null, todo: null };
    case TodoItemActionTypes.REMOVE_TODO_ERROR:
      return {
        ...state,
        loadingId: null,
        todo: action.payload.todo,
        removeError: action.payload.error ?? "Ошибка при удалении",
      };

    case TodoItemActionTypes.UPDATE_TODO:
      return { ...state, todo: action.payload.newTodo, loadingId: action.payload.newTodo.id };
    case TodoItemActionTypes.UPDATE_TODO_SUCCESS:
      return { ...state, todo: null, loadingId: null };
    case TodoItemActionTypes.UPDATE_TODO_ERROR:
      return {
        ...state,
        todo: null,
        loadingId: null,
        updateError: action.payload.updateError,
        errorTimestamp: Date.now(),
      };

    default:
      return state;
  }
};
