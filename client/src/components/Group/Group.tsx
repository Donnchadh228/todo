import React from "react";
import cl from "./Group.module.css";
interface GroupProps {
  title?: string;
  children: React.ReactNode;
}
const Group = ({ title, children }: GroupProps) => {
  return (
    <div className={cl.Group}>
      {title && (
        <div className={cl.title}>
          <span className={cl.span}>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Group;
