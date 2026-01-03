import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authHost } from "../../../http/index.ts";
import type { Group } from "../../../types/GroupsCollection.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";
import { fetchGroups } from "./fetchGroups.ts";

export const createGroup = createAsyncThunk("group/create", async (name: string, thunkAPI) => {
  try {
    const response = await $authHost.post<Group>("group/", { name });
    thunkAPI.dispatch(fetchGroups(1));
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});
