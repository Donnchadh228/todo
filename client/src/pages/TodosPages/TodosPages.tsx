import { useEffect, useState } from "react";
import TodosList from "../../components/Todos/TodosList/TodosList.tsx";
import { useAppDispatch } from "../../store/index.ts";
import { useTypedSelector } from "../../hooks/useTypedSelector.ts";
import { fetchTodos } from "../../store/action-creators/todo/fetchTodos.ts";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { Pagination } from "../../components/UI/Paginaton/Pagination.tsx";

import CreateTodo from "../../components/CreateTodo/createTodo.tsx";

const TodosPages = () => {
  const [page, setPage] = useState<number>(1);
  const dispatch = useAppDispatch();
  const { fetchError, isLoading, rows, totalPages } = useTypedSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos(page));
  }, [page, dispatch]);

  return (
    <div className="container">
      <CreateTodo onSuccess={() => setPage(1)} />

      {fetchError && <div className="error">{fetchError}</div>}

      {/* <Group title="GROUPtitle"> */}
      {isLoading && <MyLoader />}
      <TodosList style={{ marginBottom: 40, maxWidth: 500 }} todos={rows} />
      {/* </Group> */}

      <Pagination page={page} totalPages={totalPages} changePage={setPage}></Pagination>
    </div>
  );
};

export default TodosPages;
