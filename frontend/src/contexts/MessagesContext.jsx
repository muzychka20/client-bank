import React, { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
const MessagesContext = createContext();

export function MessagesContextProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // Удаление элемента через 7 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev
          .filter((i) => i.timeRemaining > 0)
          .map((item) => {
            return {
              ...item,
              timeRemaining: item.timeRemaining - 1,
            };
          })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Добавление компонента в массив
  const addMessage = (component) => {
    setMessages((prev) => [...prev, component]);
  };

  // Удаление компонента из массива по индексу
  const removeMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage, removeMessage }}>
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
