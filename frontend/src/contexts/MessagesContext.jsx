import React, { createContext, useContext, useState } from "react";

// Создаем контекст
const MessagesContext = createContext();

export function MessagesContextProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // Добавление компонента в массив
  const addMessage = (component) => {
    setMessages((prev) => [...prev, component]);
  };

  // Удаление компонента из массива по индексу
  const removeMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <MessagesContext.Provider
      value={{ messages, addMessage, removeMessage }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error(
      "useMessages must be used within a MessagesContextProvider"
    );
  }
  return context;
}
