import React, { useEffect, useState } from "react";
import "../styles/PaymentTable.css";
import { usePayments } from "../contexts/PaymentsContext";
import LoadingIndicator from "./LoadingIndicator";

export default function PaymentTable({ loading, setLoading }) {
  const { payments } = usePayments();

  const keys = [
    "Date",
    "№ Doc",
    "Summa",
    "Status",
    "NaznP",
    "Client Name",
    "Address",
  ];

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

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg payment-table-block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 table-header-cell"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          {payments.length > 0 ? (
            <tbody>
              {payments.map((payment) => (
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
                  <td className="px-6 py-4 table-cell">
                    {payment.client_name}
                  </td>
                  <td className="px-6 py-4 table-cell">{payment.address}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <div className="table-loading relative overflow-x-auto shadow-md sm:rounded-lg payment-table-block">
              {loading && <LoadingIndicator />}
            </div>
          )}
        </table>
      </div>
    </>
  );
}
