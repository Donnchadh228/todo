import MyLoader from "../../UI/MyLoader/MyLoader.tsx";
import GroupItem from "../GroupItem/GroupItem.tsx";
import TodoItem from "../../Todos/TodoItem/TodoItem.tsx";
import type { GroupWithTasks } from "../../../types/GroupsCollection.ts";

interface GroupListProps {
  rows: GroupWithTasks[];
  loadingGroupIds: number[];
}
const GroupList = ({ rows, loadingGroupIds }: GroupListProps) => {
  return (
    <div>
      {rows.map(group => {
        return loadingGroupIds.includes(group.id) ? (
          <MyLoader key={group.id} />
        ) : (
          <GroupItem key={group.id} title={group.name} groupId={group.id}>
            {group.tasks.map(todo => {
              return <TodoItem key={todo.id} todo={todo} />;
            })}
          </GroupItem>
        );
      })}
    </div>
  );
};

export default GroupList;
