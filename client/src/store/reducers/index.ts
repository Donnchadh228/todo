import { combineReducers } from "redux";
import { authReducer } from "./authReducer.ts";

export const rootReducer = combineReducers({
  user: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
