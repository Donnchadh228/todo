import React, { type InputHTMLAttributes } from "react";
import cl from "./MyCheckBox.module.css";
const MyCheckBox = ({ ...inputProps }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <>
      <input className={cl.MyCheckBox} {...inputProps} type="checkBox" />
    </>
  );
};

export default MyCheckBox;
