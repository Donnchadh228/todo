import { combineReducers } from "redux";
import { authReducer } from "./authReducer.ts";
import { todoReducer } from "./todoReducer.ts";
import { todoItemReducer } from "./todoItemReducer.ts";
import { groupReducer } from "./groupReducer.ts";

export const rootReducer = combineReducers({
  user: authReducer,
  todos: todoReducer,
  todo: todoItemReducer,
  groups: groupReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
