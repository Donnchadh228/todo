import { useEffect, useState } from "react";
import TodosList from "../../components/Todos/TodosList/TodosList.tsx";

import { fetchTodos } from "../../store/actionCreators/todo/fetchTodos.ts";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { Pagination } from "../../components/UI/Pagination/Pagination.tsx";

import TodoCreate from "../../components/Todos/TodoCreate/TodoCreate.tsx";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux.ts";
import BoxGroupActive from "../../components/Group/BoxGroupActive/BoxGroupActive.tsx";
import MySelect from "../../components/UI/MySelect/MySelect.tsx";
import { useInput } from "../../hooks/useInput.ts";

import cl from "./TodosPage.module.css";
import { optionsSort, optionsStatus } from "../../types/selectOptions.ts";

const TodosPage = () => {
  const [page, setPage] = useState<number>(1);
  const dispatch = useAppDispatch();
  const { fetchError, isLoading, rows, totalPages, shouldFetch } = useTypedSelector(state => state.todos);

  const { value: sort, setValue: setSort } = useInput<string>("desc");
  const { value: status, setValue: setStatus } = useInput<string>("all");

  useEffect(() => {
    dispatch(fetchTodos(page, sort, status));
  }, [page, dispatch, sort, status, shouldFetch]);

  const beforeSuccessCreate = () => {
    if (page === 1) dispatch(fetchTodos(page, sort, status));
    else setPage(1);
  };

  return (
    <div className="container">
      <div className={cl.wrapperSort}>
        <MySelect items={optionsSort.items} firstOption="Сначала показывать:" onChange={setSort} value={sort} />
        <MySelect items={optionsStatus.items} firstOption="Состояние:" onChange={setStatus} value={status} />
      </div>
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
