import { TodoActionTypes, type todoAction, type TodoState } from "../../types/todo.ts";

const initialState: TodoState = {
  count: 0,
  rows: [],
  currentPage: 1,
  fetchError: null,
  createError: null,
  limit: 9,
  isLoading: true,
  totalPages: 0,
};

export const todoReducer = (state = initialState, action: todoAction): TodoState => {
  switch (action.type) {
    case TodoActionTypes.FETCH_TODO:
      return { ...state, isLoading: true, fetchError: null, rows: [], count: 0, currentPage: 0 };
    case TodoActionTypes.FETCH_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rows: action.payload.rows,
        count: action.payload.count,
        limit: action.payload.limit,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
        currentPage: action.payload.currentPage,
      };
    case TodoActionTypes.FETCH_TODO_ERROR:
      return {
        ...state,
        fetchError: action.payload ?? "ERROR",
        isLoading: false,
        rows: [],
        count: 0,
        limit: 0,
        currentPage: 0,
        totalPages: 0,
      };

    case TodoActionTypes.CREATE_TODO:
      return {
        ...state,
        isLoading: true,
        createError: null,
      };

    case TodoActionTypes.CREATE_TODO_SUCCESS: {
      const newRows = [action.payload, ...state.rows];
      const limitedRows = newRows.slice(0, state.limit);

      return {
        ...state,
        isLoading: false,
        rows: limitedRows,
        count: state.count + 1,
        currentPage: 1,
        totalPages: Math.ceil((state.count + 1) / state.limit),
      };
    }

    case TodoActionTypes.CREATE_TODO_ERROR:
      return {
        ...state,
        isLoading: false,
        createError: action.payload ?? "ERROR",
      };
    default:
      return state;
  }
};
