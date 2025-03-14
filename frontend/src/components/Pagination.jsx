import React from "react";
import "../styles/Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 10;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 9) {
        pages.push(
          ...Array.from({ length: 10 }, (_, i) => i + 1),
          ellipsis,
          totalPages
        );
      } else if (currentPage >= totalPages - 10) {
        pages.push(
          1,
          ellipsis,
          ...Array.from({ length: 10 }, (_, i) => totalPages - 9 + i)
        );
      } else {
        pages.push(
          1,
          ellipsis,
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          ellipsis,
          totalPages
        );
      }
    }

    return pages.map((page, index) => (
      <li key={index}>
        {page === ellipsis ? (
          <span className="px-3 h-8 leading-tight text-gray-500">{page}</span>
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
            className={`pagination-cell flex items-center justify-center px-3 h-8 leading-tight ${
              currentPage === page
                ? "z-10 text-blue-600 border border-blue-300 bg-blue-50"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            {page}
          </a>
        )}
      </li>
    ));
  };

  return (
    <nav className="pagination" aria-label="Page navigation example">
      <ul className="flex items-center -space-x-px h-8 text-sm">
        {/* Previous Button */}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={`pagination-cell flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </a>
        </li>

        {/* Page Number Buttons */}
        {renderPageNumbers()}

        {/* Next Button */}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={`pagination-cell flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
