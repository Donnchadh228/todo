import { useEffect, useState } from "react";
import TodosList from "../../components/Todos/TodosList/TodosList.tsx";

import { fetchTodos } from "../../store/actionCreators/todo/fetchTodos.ts";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { Pagination } from "../../components/UI/Pagination/Pagination.tsx";

import TodoCreate from "../../components/Todos/TodoCreate/TodoCreate.tsx";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux.ts";
import BoxGroupActive from "../../components/Group/BoxGroupActive/BoxGroupActive.tsx";

const TodosPage = () => {
  const [page, setPage] = useState<number>(1);
  const dispatch = useAppDispatch();
  const { fetchError, isLoading, rows, totalPages } = useTypedSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos(page));
  }, [page, dispatch]);

  const beforeSuccessCreate = () => {
    if (page === 1) dispatch(fetchTodos(page));
    else setPage(1);
  };

  return (
    <div className="container">
      <TodoCreate onSuccess={beforeSuccessCreate} />

      {fetchError && <div className="error">{fetchError}</div>}

      {isLoading && <MyLoader />}

      {rows.length <= 0 && !isLoading && <div className="missing">Задач нет</div>}

      <TodosList style={{ marginBottom: 40, maxWidth: 500 }} todos={rows} />

      <Pagination page={page} totalPages={totalPages} changePage={setPage}></Pagination>
      <BoxGroupActive />
    </div>
  );
};

export default TodosPage;
