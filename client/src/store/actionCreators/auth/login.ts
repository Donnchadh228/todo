import type { Dispatch } from "redux";
import { AuthActionTypes, type AuthAction, type AuthResponse } from "../../../types/auth.ts";

import { $host } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.ts";

export const login = (login: string, password: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch({ type: AuthActionTypes.FETCH_AUTH });

      const response = await $host.post<AuthResponse>("user/login", { login, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("tokenId", response.data.tokenId.toString());

      dispatch({ type: AuthActionTypes.FETCH_AUTH_SUCCESS, payload: response.data.user });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch({ type: AuthActionTypes.FETCH_AUTH_ERROR, payload: message });
    }
  };
};
