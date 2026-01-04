import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Group, GroupActive } from "../../types/GroupsCollection.ts";
import type { Todo } from "../../types/todoItem.ts";

const initialState: GroupActive = {
  isActive: false,
  id: 0,
  createdAt: "",
  name: "",
  tasks: [],
  updatedAt: "",
  userId: 0,
};

export const groupActive = createSlice({
  name: "groupActive",
  initialState,
  reducers: {
    setActiveGroup(state, action: PayloadAction<Group>) {
      return {
        ...state,
        ...action.payload,
        isActive: true,
      };
    },
    setDeactivateGroup(state) {
      return {
        ...state,
        isActive: false,
      };
    },
    changeTodoSuccess(state, action: PayloadAction<Todo>) {
      state.tasks.push(action.payload);
    },
    changeTodoInGroup(state, action: PayloadAction<Todo>) {
      const newTodo = action.payload;
      state.tasks = state.tasks.map(todo => (newTodo.id === todo.id ? newTodo : todo));
    },
  },
  // extraReducers: builder => {},
});

export default groupActive.reducer;
export const { setDeactivateGroup, setActiveGroup, changeTodoSuccess, changeTodoInGroup } = groupActive.actions;
