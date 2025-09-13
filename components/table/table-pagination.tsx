'use client';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50, 100],
  showLimitSelector = true,
}: {
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (newLimit: number) => void;
  limitOptions?: number[];
  showLimitSelector?: boolean;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 7; // Total visible page numbers including ellipsis

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5 and ellipsis before last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis after first, then last 4 pages
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page with neighbors, ellipsis, last page
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageClick = (page: number | '...') => {
    if (
      page !== '...' &&
      page !== currentPage &&
      page >= 1 &&
      page <= totalPages
    ) {
      onPageChange?.(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    onLimitChange?.(newLimit);
  };

  if (totalPages <= 1 && !showLimitSelector) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-x-12 gap-y-4 px-2 py-4 sm:flex-row">
      {/* Items info and limit selector */}
      <div className="text-muted-foreground flex items-center gap-4 text-sm">
        <span>
          Showing {startItem}-{endItem} of {totalItems} items
        </span>

        {showLimitSelector && (
          <div className="flex items-center gap-2">
            <Label htmlFor="show">Show:</Label>
            <Select
              onValueChange={(value) => handleLimitChange(Number(value))}
              value={itemsPerPage.toString()}
            >
              <SelectTrigger className="w-fit" value={itemsPerPage}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className={`flex h-10 items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              currentPage <= 1
                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-white/10 dark:bg-blue-50/5 dark:text-gray-300 dark:hover:border-gray-700'
            } `}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="mx-2 flex items-center gap-1">
            {getPageNumbers.map((page, index) => (
              <Button
                key={index}
                onClick={() => handlePageClick(+page)}
                disabled={page === '...'}
                className={`h-10 min-w-[40px] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700'
                    : page === '...'
                      ? 'cursor-default border-transparent bg-transparent text-gray-600 dark:text-gray-300'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-white/10 dark:bg-blue-50/5 dark:text-gray-300 dark:hover:border-gray-700'
                } `}
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Next button */}
          <Button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={`flex h-10 items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-white/10 dark:bg-blue-50/5 dark:text-gray-300 dark:hover:border-gray-700'
            } `}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
