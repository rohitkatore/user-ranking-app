/**
 * Pagination Component - Handles navigation between pages of users
 * @param {Object} props - Component props
 * @param {Object} props.pagination - Pagination data object
 * @param {Function} props.onPageChange - Callback for page changes
 */
import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  /**
   * Generates array of page numbers for pagination display
   * @returns {Array<number>} Array of page numbers to display
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first 3, ellipsis, last
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first, ellipsis, last 3
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div
      className="pagination"
      role="navigation"
      aria-label="User list pagination"
    >
      <div className="pagination-info">
        Showing page {currentPage} of {totalPages}
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="pagination-btn pagination-prev"
          aria-label="Go to previous page"
          type="button"
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="pagination-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                type="button"
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="pagination-btn pagination-next"
          aria-label="Go to next page"
          type="button"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);
