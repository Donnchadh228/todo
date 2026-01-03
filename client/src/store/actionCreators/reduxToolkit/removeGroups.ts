import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";

export const removeGroup = createAsyncThunk("group/remove", async (groupId: number, thunkAPI) => {
  try {
    const response = await $authHost.delete<number>("group/" + groupId);
    if (response.data < 1) {
      return thunkAPI.rejectWithValue("Ошибка при удалении");
    }

    return groupId;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});
