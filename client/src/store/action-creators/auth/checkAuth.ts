import type { Dispatch } from "redux";
import { AuthActionTypes, type AuthAction } from "../../../types/auth.ts";
import { $authHost } from "../../../http/index.ts";

export const checkAuth = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch({ type: AuthActionTypes.FETCH_AUTH_CHECK_ERROR });
      return;
    }

    try {
      dispatch({ type: AuthActionTypes.FETCH_AUTH_CHECK });
      const tokenId = localStorage.getItem("tokenId");
      const response = await $authHost.post("user/check", { tokenId });

      dispatch({ type: AuthActionTypes.FETCH_AUTH_CHECK_SUCCESS, payload: response.data.user });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({ type: AuthActionTypes.FETCH_AUTH_CHECK_ERROR });
    }
  };
};
