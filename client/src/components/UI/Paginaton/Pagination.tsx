import { type CSSProperties } from "react";
import { usePagination } from "../../../hooks/usePagination.ts";
import cl from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  page: number;
  changePage: (p: number) => void;
  style?: CSSProperties;
}
export const Pagination = ({ totalPages, page, changePage, style }: PaginationProps) => {
  const pagesArray = usePagination(totalPages);
  return (
    <div style={style} className={cl.wrapper}>
      {pagesArray.map(p => {
        return (
          <span
            className={page === p ? `${cl.page} ${cl.currentPage}` : `${cl.page}`}
            onClick={() => changePage(p)}
            key={p}>
            {p}
          </span>
        );
      })}
    </div>
  );
};
