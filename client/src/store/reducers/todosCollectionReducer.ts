import {
  TodosCollectionActionTypes,
  type todosAction,
  type TodosCollectionState,
} from "../../types/todosCollection.ts";

const initialState: TodosCollectionState = {
  count: 0,
  rows: [],
  currentPage: 1,
  fetchError: null,

  limit: 9,
  isLoading: true,
  totalPages: 0,
};

export const todosReducer = (state = initialState, action: todosAction): TodosCollectionState => {
  switch (action.type) {
    case TodosCollectionActionTypes.FETCH_TODO:
      return { ...state, isLoading: true, fetchError: null, rows: [], count: 0, currentPage: 1 };

    case TodosCollectionActionTypes.FETCH_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rows: action.payload.rows,
        count: action.payload.count,
        limit: action.payload.limit,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
        currentPage: action.payload.currentPage,
        fetchError: "",
      };
    case TodosCollectionActionTypes.FETCH_TODO_ERROR:
      return {
        ...state,
        fetchError: action.payload ?? "Ошибка при получении",
        isLoading: false,
        rows: [],
        count: 0,
        limit: 0,
        currentPage: 0,
        totalPages: 0,
      };

    case TodosCollectionActionTypes.REMOVE_TODO_REMOVE:
      return {
        ...state,
        rows: state.rows.filter(todo => {
          return todo.id !== action.payload.todo.id;
        }),
      };

    case TodosCollectionActionTypes.UPDATE_TODO_START:
      return {
        ...state,
        rows: state.rows.map(todo => {
          return todo.id === action.payload.newTodo.id ? action.payload.newTodo : todo;
        }),
      };

    case TodosCollectionActionTypes.UPDATE_TODO_ROLLBACK: {
      return {
        ...state,
        rows: state.rows.map(todo => {
          return todo.id === action.payload.oldTodo.id ? action.payload.oldTodo : todo;
        }),
      };
    }

    case TodosCollectionActionTypes.SYNC_TODO_IN_GROUP: {
      return {
        ...state,
        rows: state.rows.map(todo => {
          return todo.id === action.payload.newTodo.id ? action.payload.newTodo : todo;
        }),
      };
    }

    default:
      return state;
  }
};
