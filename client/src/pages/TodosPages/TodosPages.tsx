import { useEffect, useState } from "react";
import TodosList from "../../components/Todos/TodosList/TodosList.tsx";
import Group from "../../components/Group/Group.tsx";
import axios from "axios";
import type { TodoResponse, TodoType } from "../../types/todo.ts";
import { $authHost } from "../../http/index.ts";

const TodosPages = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);

  async function fetchTodo() {
    try {
      const response = await $authHost.get<TodoResponse>("http://localhost:5000/api/task");

      setTodos(response.data.rows);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchTodo();
  }, []);
  return (
    <div className="container">
      <Group title="GROUPtitle">
        <TodosList todos={todos} />
      </Group>
      {/* <Group>
        <TodosList todos={todos} />
      </Group> */}
    </div>
  );
};

export default TodosPages;
