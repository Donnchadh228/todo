import { createTodo } from "../../../store/actionCreators/todo/createTodo.ts";
import { clearError } from "../../../store/actionCreators/todo/clearError.ts";
import { useErrorTimeout } from "../../../hooks/useErrorTimeout.ts";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
import MyCreate from "../../UI/MyCreate/MyCreate.tsx";
import { useState } from "react";

interface createTodoProps {
  onSuccess: () => void;
}
const CreateTodo = ({ onSuccess = () => {} }: createTodoProps) => {
  const [resetKey, setResetKey] = useState<number>(0);
  const { createError, isLoading, errorTimestamp } = useTypedSelector(state => state.todo);
  const dispatch = useAppDispatch();

  useErrorTimeout(
    errorTimestamp,
    () => {
      dispatch(clearError());
    },
    3000,
  );

  const onCreateTodo = (name: string) => {
    dispatch(createTodo(name)).then(() => {
      onSuccess();
      setResetKey(prev => prev + 1);
    });
  };

  return (
    <MyCreate
      title="Create todo"
      placeholder="Enter name todo"
      isLoading={isLoading}
      error={createError}
      onCreate={onCreateTodo}
      uniqueResetKey={resetKey}
    />
  );
};

export default CreateTodo;
