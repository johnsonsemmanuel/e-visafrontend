"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PaginationProps<T> {
  data: PaginatedData<T> | null;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
  showInfo?: boolean;
  showPerPageSelector?: boolean;
  perPageOptions?: number[];
}

export function Pagination<T>({
  data,
  onPageChange,
  loading = false,
  className = "",
  showInfo = true,
  showPerPageSelector = false,
  perPageOptions = [10, 25, 50, 100]
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(data?.current_page || 1);
  const [perPage, setPerPage] = useState(data?.per_page || 10);

  useEffect(() => {
    if (data?.current_page) {
      setCurrentPage(data.current_page);
    }
  }, [data?.current_page]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > (data?.last_page || 1)) return;
    setCurrentPage(page);
    onPageChange(page);
  }, [data?.last_page, onPageChange]);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    onPageChange(1); // Reset to first page
  }, [onPageChange]);

  if (!data || data.last_page <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const totalPages = data.last_page;
    const current = currentPage;

    // Always show first page
    if (totalPages > 1) {
      pages.push(1);
    }

    // Show ellipsis if needed
    if (current > 3) {
      pages.push('...');
    }

    // Show range around current page
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Show ellipsis if needed
    if (current < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * perPage) + 1} to{' '}
          {Math.min(currentPage * perPage, data.total)} of{' '}
          {data.total} results
        </div>
      )}

      <div className="flex items-center gap-2">
        {showPerPageSelector && (
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={typeof page !== 'number' || loading}
              className={`px-3 py-2 text-sm rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : typeof page === 'number'
                  ? 'border border-gray-300 hover:bg-gray-50'
                  : 'cursor-default text-gray-500'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === data.last_page || loading}
            className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
