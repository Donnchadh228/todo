import React, { type FormHTMLAttributes } from "react";
import cl from "./MyForm.module.css";
interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title?: string;
}
const MyForm = ({ title, children, ...props }: FormProps) => {
  return (
    <form className={cl.MyForm} {...props}>
      {title && <h2 className={cl.formTitle}>{title}</h2>}
      {children}
    </form>
  );
};

export default MyForm;
