import { type ButtonHTMLAttributes } from "react";
import cl from "./MyButton.module.css";
interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const MyButton = ({ children, className = "", ...props }: MyButtonProps) => {
  return (
    <button className={`${cl.MyButton} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default MyButton;
