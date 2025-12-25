import { useState, type ChangeEvent } from "react";

export const useInput = <T extends string = string>(initialValue: T = "" as T) => {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
  };

  return {
    value,
    onChange,
    setValue,
    reset: () => setValue(initialValue),
  } as const;
};
