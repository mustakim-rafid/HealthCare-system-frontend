"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LimitSelect } from "./LimitSelect";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
}

const TablePagination = ({ currentPage, totalPages }: TablePaginationProps) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  if (totalPages <= 1 && currentPage === 1) {
    return (
      <div className="flex justify-center items-center">
        <LimitSelect />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 w-full">
      <div className="flex justify-center items-center gap-2 w-full sm:w-auto">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNumber;

            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size={"sm"}
                onClick={() => navigateToPage(pageNumber)}
                disabled={isPending}
                className="w-9 sm:w-10"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="flex items-center"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 sm:ml-1" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <LimitSelect />
      </div>
    </div>
  );
};

export default TablePagination;
