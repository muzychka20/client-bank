import React, { createContext, useContext, useState } from "react";

const PaymentsContext = createContext();

export function PaymentsContextProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [source, setSource] = useState("");

  const addPayments = (payments, countRecords, sumRecords, source) => {
    setPayments(payments);
    setTotalRecords(countRecords);
    setTotalSum(sumRecords);
    setSource(source);
  };

  const removePayments = () => {
    setPayments([]);
    setTotalRecords(0);
    setTotalSum(0);
    setSource("");
  };
  return (
    <PaymentsContext.Provider
      value={{
        payments,
        totalRecords,
        totalSum,
        source,
        addPayments,
        removePayments,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error(
      "usePayments must be used within a PaymentsContextProvider"
    );
  }
  return context;
}
