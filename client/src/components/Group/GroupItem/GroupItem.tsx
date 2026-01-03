import React from "react";
import cl from "./Group.module.css";
import { removeGroup } from "../../../store/actionCreators/reduxToolkit/removeGroups.ts";
import { useAppDispatch } from "../../../hooks/redux.ts";

interface GroupProps {
  title?: string;
  groupId: number;
  children: React.ReactNode;
}

const GroupItem = ({ title, groupId, children }: GroupProps) => {
  const dispatch = useAppDispatch();
  const removeTodo = () => {
    dispatch(removeGroup(groupId));
  };
  return (
    <div className={cl.Group}>
      <button className="remove" onClick={removeTodo}>
        X
      </button>
      {title && (
        <div className={cl.title}>
          <span className={cl.span}>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default GroupItem;
