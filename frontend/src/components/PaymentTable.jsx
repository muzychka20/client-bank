import React, { useEffect, useState } from "react";
import "../styles/PaymentTable.css";
import { usePayments } from "../contexts/PaymentsContext";

export default function PaymentTable() {
  const { payments } = usePayments();
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (payments.length > 0) {
      const keys = Object.keys(payments[0]);
      setKeys(keys);
    }
  }, [payments]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg payment-table-block">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {keys.map((key) => (
              <th scope="col" className="px-6 py-3">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <td className="px-6 py-4">{payment.date}</td>
              <td className="px-6 py-4">{payment.num_doc}</td>
              <td className="px-6 py-4">{payment.sum}</td>
              <td className="px-6 py-4">{payment.status}</td>
              <td className="px-6 py-4">{payment.n_p}</td>
              <td className="px-6 py-4">{payment.client_name}</td>
              <td className="px-6 py-4">{payment.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
