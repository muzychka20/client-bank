import React, { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
const MessagesContext = createContext();

export function MessagesContextProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (component) => {
    const messageWithTimer = {
      id: Date.now(),
      component,
      timeRemaining: 5,
    };
    setMessages((prev) => [...prev, messageWithTimer]);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev
          .map((msg) => ({
            ...msg,
            timeRemaining: msg.timeRemaining - 1,
          }))
          .filter((msg) => msg.timeRemaining > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
