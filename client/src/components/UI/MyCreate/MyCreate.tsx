import MyButton from "../../UI/MyButton/MyButton.tsx";
import MyInput from "../../UI/MyInput/MyInput.tsx";
import { useInput } from "../../../hooks/useInput.ts";
import cl from "./MyCreate.module.css";
import MyLoader from "../../UI/MyLoader/MyLoader.tsx";
import { memo, useEffect } from "react";

interface CreateTodoProps {
  onCreate: (name: string) => void;
  error: string | null;
  isLoading: boolean;
  title: string;
  placeholder: string;
  uniqueResetKey?: number;
}

const MyCreate = ({ onCreate, isLoading, error, title, placeholder, uniqueResetKey = 0 }: CreateTodoProps) => {
  const { value: name, reset: resetName, onChange: setName } = useInput<string>("");

  useEffect(() => {
    if (uniqueResetKey) {
      resetName();
    }
  }, [uniqueResetKey, resetName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name);
      resetName(); // Очищаем поле после создания
    }
  };

  return (
    <div className={cl.CreateTodo}>
      {isLoading ? (
        <MyLoader />
      ) : (
        <form onSubmit={handleSubmit} className={cl.wrapper}>
          <MyButton onClick={() => onCreate(name)}>{title}</MyButton>
          <MyInput placeholder={placeholder} value={name} onChange={setName} />
        </form>
      )}
      {<div className="error">{error}</div>}
    </div>
  );
};

export default memo(MyCreate);
