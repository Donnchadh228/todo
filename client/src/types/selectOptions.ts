import type { MySelectProps } from "../components/UI/MySelect/MySelect.tsx";

export const optionsSort: MySelectProps = {
  items: [
    { text: "Новые", value: "desc" },
    { text: "Старые", value: "asc" },
  ],
};

export const optionsStatus: MySelectProps = {
  items: [
    { text: "Все", value: "all" },
    { text: "Не выполненные", value: "0" },
    { text: "Выполненные", value: "1" },
  ],
};
