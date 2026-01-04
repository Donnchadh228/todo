import { combineReducers } from "redux";
import { authReducer } from "./authReducer.ts";
import { todosReducer } from "./todosCollectionReducer.ts";
import { todoItemReducer } from "./todoItemReducer.ts";

import groupsReducer from "./groupSlice.ts";
import groupActive from "./groupActive.ts";
export const rootReducer = combineReducers({
  user: authReducer,
  todos: todosReducer,
  todo: todoItemReducer,
  groupsReducer: groupsReducer,
  groupActive: groupActive,
});

export type RootState = ReturnType<typeof rootReducer>;
