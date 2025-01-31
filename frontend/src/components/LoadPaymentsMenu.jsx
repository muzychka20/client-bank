import { usePayments } from "../contexts/PaymentsContext";
import { useMessages } from "../contexts/MessagesContext";
import "../styles/LoadPaymentsMenu.css";
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";
import DatePicker from "./DatePicker";
import { checkWarnings, checkErrors, checkRecords } from "../helper";

function LoadPaymentsMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const { addPayments, removePayments } = usePayments();
  const { addMessage } = useMessages();

  async function getHistory(index) {
    try {
      removePayments();
      setActiveIndex(index);
      const formattedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      const res = await api.get("/api/payments/history/", {
        params: { date: formattedDate },
      });
      checkRecords(res, addMessage, addPayments);
      checkWarnings(res, addMessage);
    } catch (error) {
      checkErrors(error, addMessage);
    }
  }

  async function getLoadedData(index) {
    try {
      removePayments();
      setActiveIndex(index);
      const res = await api.get("/api/payments/loaded/");
      checkRecords(res, addMessage, addPayments);
      checkWarnings(res, addMessage);
    } catch (error) {
      checkErrors(error, addMessage);
    }
  }

  async function clearPayments(index) {
    try {
      removePayments();
      const res = await api.post("/api/payments/clear/");
      if (res.data && res.data.success) {
        addMessage(
          <Message
            name={res.data.success.success_title}
            message={res.data.success.success_message}
            type="success"
          />
        );
      }
      checkWarnings(res, addMessage);
    } catch (error) {
      checkErrors(error, addMessage);
    }
  }

  const items = [
    { id: 1, name: "History", func: getHistory },
    { id: 2, name: "Loaded payments", func: getLoadedData },
    { id: 3, name: "Clear payments", func: clearPayments },
  ];

  return (
    <div className="menu">
      <DatePicker setDate={setDate} />
      <div className="inline-flex rounded-md shadow-xs menu-buttons">
        {items.map((item, index) => (
          <a
            key={item.id}
            href="#"
            aria-current="page"
            className={`px-4 py-2 text-sm font-medium bg-white border border-gray-200 ${
              index === 0
                ? "rounded-s-lg"
                : index === items.length - 1
                ? "rounded-e-lg"
                : ""
            } hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white ${
              activeIndex === item.id
                ? "payments-button-active"
                : "payments-button"
            }`}
            onClick={(e) => {
              e.preventDefault();
              item.func(item.id);
            }}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default LoadPaymentsMenu;
