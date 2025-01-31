import { usePayments } from "../contexts/PaymentsContext";
import { useMessages } from "../contexts/MessagesContext";
import "../styles/LoadPaymentsMenu.css";
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";
import DatePicker from "./DatePicker";

function LoadPaymentsMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(null);
  const { addPayments, removePayments } = usePayments();
  const { addMessage } = useMessages();

  async function getHistory(index) {
    try {
      removePayments();
      console.log(date);
      const res = await api.get("/api/payments/history/", { date: date }); // TODO: send date to server
      if (res.data && res.data.records) {
        addPayments(res.data.records);
      } else {
        addMessage(
          <Message name="error" message="No records found" type="error" />
        );
      }
      setActiveIndex(index);
    } catch (error) {
      addMessage(<Message name="error" message="API Error" type="error" />);
    }
  }

  async function getLoadedData(index) {
    removePayments();
    setActiveIndex(index);
    try {
      const res = await api.get("/api/payments/loaded/");
      if (res.data && res.data.records) {
        addPayments(res.data.records);
        addMessage(
          <Message name={"Succces!"} message={"Data loaded!"} type="success" />
        );
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const error = err.response.data.error;
        addMessage(
          <Message
            name={error.error_title}
            message={error.error_message}
            type="warning"
          />
        );
      }
    }
  }

  async function clearPayments(index) {
    removePayments();
    try {
      const res = await api.post("/api/payments/clear/");
      const success = res.data.success;
      addMessage(
        <Message
          name={success.success_title}
          message={success.success_message}
          type="success"
        />
      );
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const error = err.response.data.error;
        addMessage(
          <Message
            name={error.error_title}
            message={error.error_message}
            type="warning"
          />
        );
      }
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
