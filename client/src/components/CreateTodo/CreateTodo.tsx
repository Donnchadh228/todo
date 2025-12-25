import MyButton from "../UI/MyButton/MyButton.tsx";
import MyInput from "../UI/MyInput/MyInput.tsx";
import { useInput } from "../../hooks/useInput.ts";
import { useTypedSelector } from "../../hooks/useTypedSelector.ts";
import { useAppDispatch } from "../../store/index.ts";
import { createTodo } from "../../store/action-creators/todo/createTodo.ts";
import cl from "./CreateTodo.module.css";
interface CreateTodoProps {
  onSuccess?: () => void;
}
const CreateTodo = ({ onSuccess }: CreateTodoProps) => {
  const { value: name, reset: resetName, onChange: setName } = useInput<string>("");
  const { createError } = useTypedSelector(state => state.todos);

  const dispatch = useAppDispatch();

  const onCreateTodo = () => {
    dispatch(createTodo(name)).then(onSuccess);
    resetName();
  };
  return (
    <div className={cl.CreateTodo}>
      <div className={cl.wrapper}>
        <MyButton onClick={onCreateTodo}>Create todo</MyButton>
        <MyInput placeholder="Enter name todo" value={name} onChange={setName} />
      </div>
      {<div className="error">{createError}</div>}
    </div>
  );
};

export default CreateTodo;
