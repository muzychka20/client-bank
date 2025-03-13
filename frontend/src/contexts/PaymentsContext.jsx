import React, { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
const PaymentsContext = createContext();

export function PaymentsContextProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const addPayments = (payments, countRecords, sumRecords) => {
    setPayments(payments);
    setTotalRecords(countRecords);
    setTotalSum(sumRecords);
  };
 
  const removePayments = () => {
    setPayments([]);
    setTotalRecords(0);
    setTotalSum(0);
  };
  return (
    <PaymentsContext.Provider value={{ payments, totalRecords, totalSum, addPayments, removePayments }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error("usePayments must be used within a PaymentsContextProvider");
  }
  return context;
}