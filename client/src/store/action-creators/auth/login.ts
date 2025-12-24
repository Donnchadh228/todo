import type { Dispatch } from "redux";
import { AuthActionTypes, type AuthAction } from "../../../types/auth.ts";

import { $host } from "../../../http/index.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const login = (login: string, password: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch({ type: AuthActionTypes.FETCH_AUTH });

      const response = await $host.post("user/login", { login, password }, { withCredentials: true });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("tokenId", response.data.tokenId);
      console.log(response);
      dispatch({ type: AuthActionTypes.FETCH_AUTH_SUCCESS, payload: response.data.user });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch({ type: AuthActionTypes.FETCH_AUTH_ERROR, payload: message });
    }
  };
};
