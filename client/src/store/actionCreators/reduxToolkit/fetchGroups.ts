import { $authHost } from "../../../http/index.ts";
import type { GroupsCollectionResponse } from "../../../types/GroupsCollection.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface getGroup {
  page: number;
  sort: string;
}
export const fetchGroups = createAsyncThunk("group/fetchAll", async (params: getGroup, thunkAPI) => {
  try {
    const response = await $authHost.get<GroupsCollectionResponse>(
      `group/?page=${params.page}&sortOrder=${params.sort}`,
    );
    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Не удалось загрузить группы");
  }
});
