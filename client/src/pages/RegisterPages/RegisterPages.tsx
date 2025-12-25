import { useEffect, useState, type MouseEvent } from "react";
import MyInput from "../../components/UI/MyInput/MyInput.tsx";
import MyForm from "../../components/UI/MyForm/MyForm.tsx";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { useInput } from "../../hooks/useInput.ts";
import MyButton from "../../components/UI/MyButton/MyButton.tsx";
import { useTypedSelector } from "../../hooks/useTypedSelector.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/index.ts";
import { signIn } from "../../store/action-creators/auth/signIn.ts";

const RegisterPages = () => {
  const { user, error, isLoading } = useTypedSelector(state => state.user);
  const { value: login, onChange: setLogin } = useInput<string>();
  const { value: password, onChange: setPassword } = useInput<string>();
  const { value: passwordRepeat, onChange: setPasswordRepeat } = useInput<string>();
  const [errorValidation, setErrorValidation] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user) {
      navigate("/todos");
    }
  }, [navigate, user]);

  const handleRegistrationSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (password !== passwordRepeat) {
      setErrorValidation("Пароли не совпадают");
      return 0;
    }
    setErrorValidation("");
    dispatch(signIn(login, password));
  };

  return (
    <div>
      <div className="container">
        <MyForm title="Регистрация" style={{ maxWidth: 400 }}>
          <MyInput value={login} onChange={setLogin} placeholder="Введите логин" />
          <MyInput value={password} onChange={setPassword} type="password" placeholder="Введите пароль" />
          <MyInput value={passwordRepeat} onChange={setPasswordRepeat} type="password" placeholder="Повторите пароль" />
          {<MyLoader visible={isLoading} />}
          <div className="error">{errorValidation || error}</div>
          <MyButton onClick={handleRegistrationSubmit}>Регистрация</MyButton>
        </MyForm>
      </div>
    </div>
  );
};

export default RegisterPages;
