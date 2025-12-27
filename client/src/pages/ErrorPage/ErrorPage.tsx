import cl from "./ErrorPage.module.css";
import MyButton from "../../components/UI/MyButton/MyButton.tsx";
import { useNavigate } from "react-router-dom";
interface ErrorProps {
  title?: string;
  message?: string;
}

const ErrorPage = ({
  title = "Ошибка",
  message = "Что-то пошло не так. Пожалуйста, попробуйте еще раз.",
}: ErrorProps) => {
  const navigate = useNavigate();
  const onNavigate = () => {
    navigate("/todos");
  };
  return (
    <>
      <div className={cl.error}>
        <h1 className={cl.title}>{title}</h1>
        <p className={cl.message}>{message}</p>
        <MyButton onClick={onNavigate}>Вернуться на начальную страницу</MyButton>
      </div>
    </>
  );
};

export default ErrorPage;
