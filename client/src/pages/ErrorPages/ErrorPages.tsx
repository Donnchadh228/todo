import cl from "./ErrorPages.module.css";
import MyButton from "../../components/UI/MyButton/MyButton.tsx";
interface ErrorProps {
  title?: string;
  message?: string;
}

const Error = ({ title = "Ошибка", message = "Что-то пошло не так. Пожалуйста, попробуйте еще раз." }: ErrorProps) => {
  return (
    <>
      <div className={cl.error}>
        <h1 className={cl.title}>{title}</h1>
        <p className={cl.message}>{message}</p>
        <MyButton>Вернуться на начальную страницу</MyButton>
      </div>
    </>
  );
};

export default Error;
