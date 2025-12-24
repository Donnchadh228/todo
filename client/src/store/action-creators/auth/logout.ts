import type { Dispatch } from "redux";
import { $authHost } from "../../../http/index.ts";
import { AuthActionTypes, type AuthAction } from "../../../types/auth.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const logout = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      const tokenId = localStorage.getItem("tokenId");
      await $authHost.delete("user/logout/" + tokenId, { withCredentials: true });
      localStorage.removeItem("tokenId");
      localStorage.removeItem("accessToken");

      dispatch({ type: AuthActionTypes.FETCH_AUTH_LOGOUT, payload: null });
    } catch (error: unknown) {
      console.log(2);
      const message = getErrorMessage(error);
      dispatch({ type: AuthActionTypes.FETCH_AUTH_ERROR, payload: message });
    }
  };
};
