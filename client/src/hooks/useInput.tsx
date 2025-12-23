import { useState, type ChangeEvent } from "react";

export const useInput = (): [value: string, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState("");
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };
  return [value, onChange];
};
