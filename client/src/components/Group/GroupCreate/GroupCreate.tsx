import MyCreate from "../../UI/MyCreate/MyCreate.tsx";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
import { createGroup } from "../../../store/actionCreators/reduxToolkit/createGroup.ts";
import { useErrorTimeout } from "../../../hooks/useErrorTimeout.ts";
import { clearGroupErrors } from "../../../store/reducers/groupSlice.ts";

const GroupCreate = () => {
  const { createError, createLoading, errorTimestamp } = useTypedSelector(state => state.groupsReducer);
  const dispatch = useAppDispatch();

  useErrorTimeout(errorTimestamp, () => dispatch(clearGroupErrors()), 2000);

  function onCreateGroup(name: string) {
    dispatch(createGroup(name));
  }

  return (
    <MyCreate
      title="Create group"
      placeholder="Enter name group"
      isLoading={createLoading}
      error={createError}
      onCreate={onCreateGroup}
    />
  );
};

export default GroupCreate;
