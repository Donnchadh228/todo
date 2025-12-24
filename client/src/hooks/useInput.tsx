import { useState, type ChangeEvent } from "react";

export const useInput = <T extends string | number | readonly string[] = string>(
  initialValue?: T,
): [value: T, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState<T>(initialValue ?? ("" as T));

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value as T);
  };

  return [value, onChange];
};
