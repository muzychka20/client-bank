import {
  MessagesContextProvider,
  useMessages,
} from "../contexts/MessagesContext";

function MessagesList() {
  const { messages } = useMessages();
  return (
    <div className="messages-block">
      {messages.map((message, index) => (
        <div key={index} className="messages-block-item">
          {message}
        </div>
      ))}
    </div>
  );
}

export default MessagesList;
