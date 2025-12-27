import { useEffect, useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector.ts";
import { fetchGroups } from "../../store/action-creators/group/fetchGroup.ts";
import Group from "../../components/Group/Group.tsx";
import { useAppDispatch } from "../../store/index.ts";
import { Pagination } from "../../components/UI/Paginaton/Pagination.tsx";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import TodoItem from "../../components/Todos/TodoItem/TodoItem.tsx";
const GroupPage = () => {
  const [page, setPage] = useState<number>(1);
  const { rows, isLoading, fetchError, totalPages } = useTypedSelector(state => state.groups);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGroups(page));
  }, [page, dispatch]);
  if (isLoading) {
    return <MyLoader />;
  }

  if (fetchError) {
    return <div className="error">{fetchError}</div>;
  }

  return (
    <div>
      <div className="error">{fetchError}</div>
      {rows.map(group => {
        return (
          <Group key={group.id} title={group.name}>
            {group.tasks.map(todo => {
              return <TodoItem todo={todo} />;
            })}
          </Group>
        );
      })}

      <Pagination page={page} changePage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default GroupPage;
