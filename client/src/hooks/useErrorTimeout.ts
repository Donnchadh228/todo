import { useEffect } from "react";

export const useErrorTimeout = (errorTimestamp: number | undefined, clearAction: () => void, delay: number = 3000) => {
  useEffect(() => {
    if (!errorTimestamp) return;

    const timePassed = Date.now() - errorTimestamp;

    if (timePassed >= delay) {
      clearAction();
      return;
    }

    const remaining = delay - timePassed;
    const timer = setTimeout(() => clearAction(), remaining);

    return () => clearTimeout(timer);
  }, [errorTimestamp, clearAction, delay]);
};
