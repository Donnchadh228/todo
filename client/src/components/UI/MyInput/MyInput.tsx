import { type ChangeEvent, type InputHTMLAttributes } from "react";
import cl from "./MyInput.module.css";
interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const MyInput = (props: MyInputProps) => {
  return <input className={cl.MyInput} type="text" {...props} />;
};

export default MyInput;
