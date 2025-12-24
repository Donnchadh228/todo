import MyButton from "../../components/UI/MyButton/MyButton.tsx";
import MyForm from "../../components/UI/MyForm/MyForm.tsx";
import MyInput from "../../components/UI/MyInput/MyInput.tsx";
import { useInput } from "../../hooks/useInput.tsx";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { useEffect, type MouseEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { publicRoutesConfig } from "../../utils/const.ts";
import cl from "./LoginPages.module.css";
import { useTypedSelector } from "../../hooks/useTypedSelector.ts";
import { login } from "../../store/action-creators/auth/login.ts";
import { useAppDispatch } from "../../store/index.ts";

const LoginPages = () => {
  const [loginValue, setLoginValue] = useInput<string>();
  const [password, setPassword] = useInput<string>();
  const { user, error, isLoading } = useTypedSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      navigate("/todos");
    }
  }, [navigate, user]);

  const buttonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(login(loginValue, password));
  };

  return (
    <div className="container">
      <MyForm title="Авторизация" style={{ maxWidth: 400 }}>
        <MyInput value={loginValue} onChange={setLoginValue} placeholder="Введите логин" />
        <MyInput value={password} onChange={setPassword} placeholder="Введите логин" />

        <MyLoader visible={isLoading} />
        <div className="error">{error}</div>
        <div className={cl.register}>
          Нет аккаунт? <NavLink to={publicRoutesConfig.REGISTER}>Зарегистрируйтесь!</NavLink>
        </div>
        <MyButton onClick={buttonHandler}>Авторизация</MyButton>
      </MyForm>
    </div>
  );
};

export default LoginPages;
