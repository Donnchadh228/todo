import MyButton from "../../components/UI/MyButton/MyButton.tsx";
import MyForm from "../../components/UI/MyForm/MyForm.tsx";
import MyInput from "../../components/UI/MyInput/MyInput.tsx";
import { useInput } from "../../hooks/useInput.ts";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { useEffect, type MouseEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { publicRoutesConfig } from "../../utils/const.ts";
import cl from "./LoginPage.module.css";
import { login } from "../../store/actionCreators/auth/login.ts";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux.ts";

const LoginPage = () => {
  const { value: loginValue, onChange: setLoginValue } = useInput<string>();
  const { value: password, onChange: setPassword } = useInput<string>();
  const { user, error, isLoading } = useTypedSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      navigate("/todos");
    }
  }, [navigate, user]);

  const handleLogin = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(login(loginValue, password));
  };

  return (
    <div className="container">
      <MyForm title="Авторизация" style={{ maxWidth: 400 }}>
        <MyInput value={loginValue} onChange={setLoginValue} placeholder="Введите логин" />
        <MyInput type="password" value={password} onChange={setPassword} placeholder="Введите логин" />

        <MyLoader visible={isLoading} />
        <div className="error">{error}</div>
        <div className={cl.register}>
          Нет аккаунт? <NavLink to={publicRoutesConfig.REGISTER}>Зарегистрируйтесь!</NavLink>
        </div>
        <MyButton onClick={handleLogin}>Авторизация</MyButton>
      </MyForm>
    </div>
  );
};

export default LoginPage;
