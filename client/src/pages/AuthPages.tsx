import MyButton from "../components/UI/MyButton/MyButton.tsx";
import MyForm from "../components/UI/MyForm/MyForm.tsx";
import MyInput from "../components/UI/MyInput/MyInput.tsx";
import { useInput } from "../hooks/useInput.tsx";
import MyLoader from "../components/UI/MyLoader/MyLoader.tsx";
import { useState, type MouseEvent } from "react";

const Auth = () => {
  const [value, setValue] = useInput();
  const [value1, setValue1] = useInput();
  const [visible, setVisible] = useState<boolean>(false);
  const buttonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setVisible(prev => !prev);
  };
  return (
    <div>
      <MyForm title="Авторизация">
        <MyInput value={value} onChange={setValue} placeholder="Введите логин" />
        <MyInput value={value1} onChange={setValue1} placeholder="Введите логин" />
        <MyLoader visible={visible} />
        <MyButton onClick={buttonHandler}>Нажмите на меня</MyButton>
      </MyForm>
    </div>
  );
};

export default Auth;
