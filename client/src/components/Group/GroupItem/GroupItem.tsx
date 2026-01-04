import React from "react";
import cl from "./Group.module.css";
import type { Group } from "../../../types/GroupsCollection.ts";
import { useNavigate } from "react-router-dom";
export interface GroupItemProps {
  needPreference?: boolean;
  onRemove?: (groupId: number) => void;
  onSelect?: (group: Group) => void;
}
interface GroupProps {
  group: Group;

  children: React.ReactNode;
  options?: GroupItemProps;
}

const GroupItem = ({ group, children, options }: GroupProps) => {
  const navigate = useNavigate();
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    options?.onRemove?.(group.id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    options?.onSelect?.(group);
    navigate("/todos");
  };

  return (
    <div className={cl.Group}>
      {options?.needPreference && (
        <>
          <button className={cl.pin} onClick={handleSelect}>
            pin
          </button>
          <button className="remove" onClick={handleRemove}>
            X
          </button>
        </>
      )}
      {group.name && (
        <div className={cl.title}>
          <span className={cl.span}>{group.name}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default GroupItem;
