import type { Dispatch } from "redux";
import { $authHost } from "../../../http/index.ts";
import { AuthActionTypes, type AuthAction } from "../../../types/auth.ts";
import { getErrorMessage } from "../../../utils/getErrorMessage.tsx";

export const logout = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      // Когда interceptor получается код 401 и refreshToken умер, addEventListener выполняет моментально logout не дожидаясь окончания await
      dispatch({ type: AuthActionTypes.FETCH_AUTH_LOGOUT, payload: null });

      const tokenId = localStorage.getItem("tokenId");
      await $authHost.delete("user/logout/" + tokenId);

      localStorage.removeItem("tokenId");
      localStorage.removeItem("accessToken");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch({ type: AuthActionTypes.FETCH_AUTH_ERROR, payload: message });
    }
  };
};
