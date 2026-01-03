import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type GroupCollectionState,
  type GroupsCollectionResponse,
  type GroupWithTasks,
} from "../../types/GroupsCollection.ts";
import { fetchGroups } from "../actionCreators/reduxToolkit/fetchGroups.ts";
import { createGroup } from "../actionCreators/reduxToolkit/createGroup.ts";
import { removeGroup } from "../actionCreators/reduxToolkit/removeGroups.ts";

const initialState: GroupCollectionState = {
  count: 0,
  rows: [] as GroupWithTasks[],
  isLoading: false,
  fetchError: null,
  currentPage: 1,
  totalPages: 0,
  limit: 10,

  isDeleting: false,
  deleteError: null,
  deletedId: [],

  createLoading: false,
  createError: "",
};

export const groupSlice = createSlice({
  name: "groupSlice",
  initialState,
  reducers: {
    clearGroupErrors(state) {
      state.createError = null;
      state.fetchError = null;
      state.deleteError = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchGroups.pending, state => {
      state.isLoading = true;
      state.fetchError = null;
    });
    builder.addCase(fetchGroups.fulfilled, (state, action: PayloadAction<GroupsCollectionResponse>) => {
      state.isLoading = false;
      state.fetchError = null;
      state.rows = action.payload.rows;
      state.count = action.payload.count;
      state.currentPage = action.payload.currentPage;
      state.limit = action.payload.limit;
      state.totalPages = Math.ceil(action.payload.count / action.payload.limit);
    });
    builder.addCase(fetchGroups.rejected, (state, action) => {
      state.isLoading = false;
      state.fetchError = (action.payload as string) || "Произошла ошибка при загрузке групп";
      state.errorTimestamp = Date.now();
    });

    builder.addCase(createGroup.pending, state => {
      state.createError = null;
      state.createLoading = true;
    });
    builder.addCase(createGroup.fulfilled, state => {
      state.currentPage = 1;
      state.createLoading = false;
    });

    builder.addCase(createGroup.rejected, (state, action) => {
      state.createError = (action.payload as string) || "Произошла ошибка при добавлении группы";
      state.createLoading = false;
      state.errorTimestamp = Date.now();
    });

    builder.addCase(removeGroup.pending, (state, action) => {
      const groupId = action.meta.arg;
      state.deleteError = null;
      state.deletedId = state.deletedId.includes(groupId) ? state.deletedId : [...state.deletedId, groupId];
    });
    builder.addCase(removeGroup.fulfilled, (state, action: PayloadAction<number>) => {
      const deletedId = action.payload;
      const newRows = state.rows.filter(group => group.id !== deletedId);
      state.rows = newRows;
      state.deletedId = state.deletedId.filter(id => id !== deletedId);
      state.count = Math.max(0, state.count - 1);
      state.totalPages = Math.ceil(Math.max(0, state.count - 1) / state.limit);
    });
    builder.addCase(removeGroup.rejected, (state, action) => {
      const groupId = action.meta.arg;
      state.isDeleting = false;
      state.deleteError = (action.payload as string) || "Произошла ошибка при удалении группы";
      state.deletedId = state.deletedId.filter(id => id !== groupId);
      state.errorTimestamp = Date.now();
    });
  },
});

export default groupSlice.reducer;
export const { clearGroupErrors } = groupSlice.actions;
