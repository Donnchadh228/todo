import { useEffect } from "react";

import { checkAuth } from "../store/actionCreators/auth/checkAuth.ts";
import { logout } from "../store/actionCreators/auth/logout.ts";
import { useAppDispatch } from "./redux.ts";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleSessionExpired = () => dispatch(logout());

  return { handleSessionExpired };
};
