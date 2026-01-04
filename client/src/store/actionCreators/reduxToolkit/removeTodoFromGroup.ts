import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authHost } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";
interface Todo {
  id: number;
  name: string;
}
export const removeTodoFromGroup = createAsyncThunk("group/removeTodo", async (todo: Todo, thunkAPI) => {
  try {
    const response = await $authHost.put<number>("task/" + todo.id, { name: todo.name, groupId: null });
    if (response.data < 1) {
      return thunkAPI.rejectWithValue("Ошибка при удалении");
    }

    return todo.id;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});
