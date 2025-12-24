import React, { useState } from "react";
import TodosList from "../../components/Todos/TodosList/TodosList.tsx";

const TodosPages = () => {
  const [todos, setTodos] = useState([
    { id: 1, name: "first todo", status: 0 },
    { id: 2, name: "second todo", status: 1 },
    { id: 3, name: "first todo", status: 0 },
    { id: 4, name: "second todo", status: 1 },
  ]);

  return (
    <div>
      <TodosList todos={todos} />
    </div>
  );
};

export default TodosPages;
