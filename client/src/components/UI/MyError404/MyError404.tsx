import React from "react";
import cl from "./MyError404.module.css";
import MyButton from "../MyButton/MyButton.tsx";

interface ErrorProps {
  title?: string;
  message?: string;
}
const MyError404: React.FC<ErrorProps> = ({
  title = "Ошибка",
  message = "Что-то пошло не так. Пожалуйста, попробуйте еще раз.",
}) => {
  return (
    <div className={cl.error}>
      <h1 className={cl.title}>{title}</h1>
      <p className={cl.message}>{message}</p>
      <MyButton>Вернуться на начальную страницу</MyButton>
    </div>
  );
};

export default MyError404;
