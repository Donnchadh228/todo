import MyLoader from "../../UI/MyLoader/MyLoader.tsx";
import GroupItem, { type GroupItemProps } from "../GroupItem/GroupItem.tsx";
import TodoItem from "../../Todos/TodoItem/TodoItem.tsx";
import type { Group, GroupWithTasks } from "../../../types/GroupsCollection.ts";
import cl from "./GroupList.module.css";
import { removeGroup } from "../../../store/actionCreators/reduxToolkit/removeGroups.ts";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
import { setActiveGroup } from "../../../store/reducers/groupActive.ts";
import MyButton from "../../UI/MyButton/MyButton.tsx";
import { removeTodoFromGroup } from "../../../store/actionCreators/reduxToolkit/removeTodoFromGroup.ts";

interface GroupListProps {
  rows: GroupWithTasks[];
  loadingGroupIds: number[];
}
const GroupList = ({ rows, loadingGroupIds }: GroupListProps) => {
  const dispatch = useAppDispatch();
  const { deleteTodoId } = useTypedSelector(state => state.groupsReducer);

  const handleSelect = (group: Group) => {
    dispatch(setActiveGroup(group));
  };

  const handleRemove = (groupId: number) => {
    dispatch(removeGroup(groupId));
  };

  const deleteFromGroup = (id: number, name: string) => {
    dispatch(removeTodoFromGroup({ id, name }));
  };

  const options: GroupItemProps = { needPreference: true, onRemove: handleRemove, onSelect: handleSelect };

  return (
    <div className={cl.groupList}>
      {rows.map(group => {
        return loadingGroupIds.includes(group.id) ? (
          <MyLoader key={group.id} />
        ) : (
          <GroupItem key={group.id} group={group} options={options}>
            {group.tasks.map(todo =>
              deleteTodoId.includes(todo.id) ? (
                <MyLoader key={todo.id} />
              ) : (
                <div className={cl.wrapperTodo} key={todo.id}>
                  <MyButton className={cl.removeFromGroup} onClick={() => deleteFromGroup(todo.id, todo.name)}>
                    Удалить из группы
                  </MyButton>
                  <TodoItem className={cl.todoItem} todo={todo} />
                </div>
              ),
            )}
          </GroupItem>
        );
      })}
    </div>
  );
};

export default GroupList;
