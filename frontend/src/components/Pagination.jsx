import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
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
              handlePageChange(currentPage);
            }}
            className="pagination-cell flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
        {[...Array(totalPages).keys()].map((page) => (
          <li key={page}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page + 1); // Add 1 because keys are 0-indexed
              }}
              className={`pagination-cell flex items-center justify-center px-3 h-8 leading-tight ${
                currentPage === page
                  ? "z-10 text-blue-600 border border-blue-300 bg-blue-50"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              {page + 1}
            </a>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage);
            }}
            className="pagination-cell flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
