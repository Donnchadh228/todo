import { $authHost } from "../../../http/index.ts";
import type { GroupsCollectionResponse } from "../../../types/GroupsCollection.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGroups = createAsyncThunk("group/fetchAll", async (page: number, thunkAPI) => {
  try {
    const response = await $authHost.get<GroupsCollectionResponse>("group/?page=" + page);

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Не удалось загрузить группы");
  }
});
