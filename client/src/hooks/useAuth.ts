import { useEffect } from "react";
import { useAppDispatch } from "../store/index.ts";
import { checkAuth } from "../store/action-creators/auth/checkAuth.ts";
import { logout } from "../store/action-creators/auth/logout.ts";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleSessionExpired = () => dispatch(logout());

  return { handleSessionExpired };
};
