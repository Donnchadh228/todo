import GroupItem from "../GroupItem/GroupItem.tsx";
import TodoItem from "../../Todos/TodoItem/TodoItem.tsx";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";
import cl from "./BoxGroupActive.module.css";
import { setDeactivateGroup } from "../../../store/reducers/groupActive.ts";
import type { DragEvent } from "react";
import type { GroupActive } from "../../../types/GroupsCollection.ts";
import { addTodoToGroup } from "../../../store/actionCreators/reduxToolkit/addTodo.ts";

const BoxGroupActive = () => {
  const group = useTypedSelector(state => state.groupActive);
  const dispatch = useAppDispatch();

  const deactivate = () => {
    dispatch(setDeactivateGroup());
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, group: GroupActive) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("todoId"));
    const name = e.dataTransfer.getData("todoName");
    if (group.tasks.find(task => task.id === id)) {
      return "";
    }
    dispatch(addTodoToGroup({ id, name }, { id: group.id, name: group.name }));
  };
  return (
    group.isActive && (
      <div className={cl.groupWrapper} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, group)}>
        <GroupItem group={group}>
          <button className="remove" onClick={deactivate}>
            Скрыть
          </button>
          <div className={cl.todoWrapper}>
            {group.tasks.map(todo => {
              return <TodoItem key={todo.id} todo={todo} />;
            })}
          </div>
        </GroupItem>
      </div>
    )
  );
};

export default BoxGroupActive;
