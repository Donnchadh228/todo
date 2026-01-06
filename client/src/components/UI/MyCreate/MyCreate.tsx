import MyButton from "../../UI/MyButton/MyButton.tsx";
import MyInput from "../../UI/MyInput/MyInput.tsx";
import { useInput } from "../../../hooks/useInput.ts";
import cl from "./MyCreate.module.css";
import MyLoader from "../../UI/MyLoader/MyLoader.tsx";
import { memo } from "react";

interface CreateTodoProps {
  onCreate: (name: string) => void;
  error: string | null;
  isLoading: boolean;
  title: string;
  placeholder: string;
}

const MyCreate = ({ onCreate, isLoading, error, title, placeholder }: CreateTodoProps) => {
  const { value: name, reset: resetName, onChange: setName } = useInput<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name);
    resetName();
  };
  const handlerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onCreate(name);
    resetName();
  };
  return (
    <div className={cl.CreateTodo}>
      {isLoading ? (
        <MyLoader />
      ) : (
        <form onSubmit={handleSubmit} className={cl.wrapper}>
          <MyButton onClick={e => handlerClick(e)}>{title}</MyButton>
          <MyInput placeholder={placeholder} value={name} onChange={setName} />
        </form>
      )}
      {<div className="error">{error}</div>}
    </div>
  );
};

export default memo(MyCreate);
