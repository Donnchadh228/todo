import { useEffect, useState } from "react";
import { Pagination } from "../../components/UI/Pagination/Pagination.tsx";
import MyLoader from "../../components/UI/MyLoader/MyLoader.tsx";
import { useErrorTimeout } from "../../hooks/useErrorTimeout.ts";

import { fetchGroups } from "../../store/actionCreators/reduxToolkit/fetchGroups.ts";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux.ts";

import GroupCreate from "../../components/Group/GroupCreate/GroupCreate.tsx";
import GroupList from "../../components/Group/GroupList/GroupList.tsx";
import { clearGroupErrors } from "../../store/reducers/groupSlice.ts";

const GroupPage = () => {
  const [page, setPage] = useState<number>(1);
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
      <div className="error">{deleteError}</div>
      <GroupList rows={rows} loadingGroupIds={deletedId} />

      <Pagination page={page} changePage={setPage} totalPages={totalPages} />
      <GroupCreate />
    </div>
  );
};

export default GroupPage;
