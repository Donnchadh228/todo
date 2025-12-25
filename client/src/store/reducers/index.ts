import { combineReducers } from "redux";
import { authReducer } from "./authReducer.ts";
import { todoReducer } from "./todoReducer.ts";

export const rootReducer = combineReducers({
  user: authReducer,
  todos: todoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
