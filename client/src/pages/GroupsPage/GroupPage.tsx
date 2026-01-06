import { useEffect, useState } from "react";
import { Pagination } from "../../components/UI/Pagination/Pagination.tsx";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { useErrorTimeout } from "../../hooks/useErrorTimeout.ts";

import { fetchGroups } from "../../store/actionCreators/reduxToolkit/fetchGroups.ts";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux.ts";

import GroupCreate from "../../components/Group/GroupCreate/GroupCreate.tsx";
import GroupList from "../../components/Group/GroupList/GroupList.tsx";
import { clearGroupErrors } from "../../store/reducers/groupSlice.ts";
import MySelect from "../../components/UI/MySelect/MySelect.tsx";
import { optionsSort } from "../../types/selectOptions.ts";
import { useInput } from "../../hooks/useInput.ts";
import cl from "./GroupPage.module.css";

const GroupPage = () => {
  const [page, setPage] = useState<number>(1);
  const { value: sort, setValue: setSort } = useInput<string>("desc");
  const { rows, isLoading, fetchError, totalPages, deletedId, deleteError, errorTimestamp } = useTypedSelector(
    state => state.groupsReducer,
  );

  const dispatch = useAppDispatch();

  useErrorTimeout(
    errorTimestamp,
    () => {
      dispatch(clearGroupErrors());
    },
    4000,
  );

  useEffect(() => {
    dispatch(fetchGroups({ page, sort }));
  }, [page, dispatch, sort]);

  const beforeSuccessCreate = () => {
    if (page === 1) dispatch(fetchGroups({ page, sort }));
    else setPage(1);
  };

  if (fetchError) {
    return <div className="error">{fetchError}</div>;
  }

  return (
    <div>
      <MySelect
        className={cl.sort}
        items={optionsSort.items}
        firstOption="Сначала показывать:"
        onChange={setSort}
        value={sort}
      />
      <div className="error">{deleteError}</div>
      {isLoading ? <MyLoader /> : <GroupList rows={rows} loadingGroupIds={deletedId} />}

      <Pagination page={page} changePage={setPage} totalPages={totalPages} />
      <GroupCreate onSuccess={beforeSuccessCreate} />
    </div>
  );
};

export default GroupPage;
