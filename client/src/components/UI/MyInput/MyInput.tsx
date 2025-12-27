import { type InputHTMLAttributes } from "react";
import cl from "./MyInput.module.css";

const MyInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={cl.MyInput} {...props} />;
};

export default MyInput;
