import { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext?: boolean;
};

const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
): ReactNode[] => {
  const pages: ReactNode[] = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    const startPages = [1, 2];
    const endPages = [totalPages - 1, totalPages];
    const middlePage = currentPage;

    // Add start pages
    startPages.forEach((page) => {
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => onPageChange(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Add middle page if needed
    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(
        <PaginationItem key={middlePage}>
          <PaginationLink
            onClick={() => onPageChange(middlePage)}
            isActive={true}
          >
            {middlePage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    // Add end pages
    endPages.forEach((page) => {
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => onPageChange(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  }

  return pages;
};

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext = true,
}: PaginatorProps) {
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages > 0 && currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousClick}
              isActive={currentPage <= 1}
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages > 0 && currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext
              onClick={handleNextClick}
              isActive={currentPage >= totalPages}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
