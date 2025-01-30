import React, { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
const PaymentsContext = createContext();

export function PaymentsContextProvider({ children }) {
  const [payments, setPayments] = useState([]);

  const addPayments = (payments) => {
    setPayments(payments);
  };
 
  const removePayments = () => {
    setPayments([]);
  }

  return (
    <PaymentsContext.Provider value={{ payments, addPayments, removePayments }}>
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
