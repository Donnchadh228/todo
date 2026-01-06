import React from "react";
import cl from "./MySelect.module.css";

interface SelectOption {
  text: string;
  value: string;
}
export interface MySelectProps {
  items: SelectOption[];
  firstOption?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
const MySelect = ({
  items = [],
  firstOption = "Выберите вариант",
  disabled = false,
  value,
  className = "",
  onChange,
}: MySelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`${cl.selectWrapper} ${className}`}>
      <select className={cl.select} value={value} onChange={handleChange} disabled={disabled}>
        <option value="" disabled>
          {firstOption}
        </option>
        {items.map(option => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MySelect;
