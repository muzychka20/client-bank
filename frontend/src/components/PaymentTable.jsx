import React, { useEffect, useState } from "react";
import "../styles/PaymentTable.css";
import { usePayments } from "../contexts/PaymentsContext";
import LoadingIndicator from "./LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

export default function PaymentTable({ loading, setLoading }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const { payments } = usePayments();

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  const keys = ["Date", "№ Doc", "Summa", "Status", "NaznP", "Name", "Address"];

  const status = {
    1: "в обработке",
    3: "удален",
    5: "зачислен",
  };

  const statusStyle = {
    1: "status-process",
    3: "status-deleted",
    5: "status-success",
  };

  const titles = [
    { label: "Date", key: "date" },
    { label: "№ Doc", key: "num_doc" },
    { label: "Summa", key: "sum" },
    { label: "Status", key: "status" },
    { label: "NaznP", key: "n_p" },
    { label: "Name", key: "client_name" },
    { label: "Address", key: "address" },
  ];

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg payment-table-block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {titles.map((title) => (
                <th
                  key={title.key}
                  scope="col"
                  className="px-6 py-3 table-header-cell"
                  onClick={() => handleSort(title.key)}
                >
                  <a href="#" className={"table-header-cell-sort"}>
                    {title.label}
                    {title.key === sortKey ? (
                      <FontAwesomeIcon
                        icon={sortOrder === "asc" ? faSortUp : faSortDown}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map((payment) => (
              <tr
                key={payment.num_doc}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4 table-cell">{payment.date}</td>
                <td className="px-6 py-4 table-cell">{payment.num_doc}</td>
                <td className="px-6 py-4 table-cell">{payment.sum}</td>
                <td className="px-6 py-4 table-cell">
                  <p className={`${statusStyle[payment.status]}`}>
                    {status[payment.status]}
                  </p>
                </td>
                <td className="px-6 py-4 table-cell">{payment.n_p}</td>
                <td className="px-6 py-4 table-cell">{payment.client_name}</td>
                <td className="px-6 py-4 table-cell">{payment.address}</td>
              </tr>
            ))}
          </tbody>
          {payments.length > 0 ? (
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-4 text-base table-cell">
                  Total
                </th>
                <td className="px-6 py-4 table-cell">{0}</td>
                <td className="px-6 py-4 table-cell">{0}</td>
                <td className="px-6 py-4 table-cell"></td>
                <td className="px-6 py-4 table-cell"></td>
                <td className="px-6 py-4 table-cell"></td>
                <td className="px-6 py-4 table-cell"></td>
              </tr>
            </tfoot>
          ) : (
            <tfoot></tfoot>
          )}
        </table>
        <div className="table-loading relative overflow-x-auto shadow-md sm:rounded-lg payment-table-block">
          {loading && <LoadingIndicator />}
        </div>
      </div>      
    </>
  );
}
