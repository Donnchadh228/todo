import { useEffect } from "react";
import { useAppDispatch } from "../store/index.ts";

type ClearErrorFn = (dispatch: ReturnType<typeof useAppDispatch>) => void;
export const useErrorTimeout = (
  error: string | null,
  errorTimestamp: number | undefined,
  clearAction: ClearErrorFn,
  delay: number = 3000,
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!error || !errorTimestamp) return;

    const timePassed = Date.now() - errorTimestamp;

    if (timePassed >= delay) {
      clearAction(dispatch);
      return;
    }

    const remaining = delay - timePassed;
    const timer = setTimeout(() => clearAction(dispatch), remaining);

    return () => clearTimeout(timer);
  }, [error, errorTimestamp, clearAction, dispatch, delay]);
};
