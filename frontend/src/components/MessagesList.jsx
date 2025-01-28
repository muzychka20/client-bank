import {
  MessagesContextProvider,
  useMessages,
} from "../contexts/MessagesContext";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MessagesList() {
  const { messages, removeMessage } = useMessages();
  return (
    <div className="messages-block">
      {messages.map((message) => (
        <div key={message.id} className={`message-wrapper`}>
          {message.component}
          <button
            className="message-close"
            onClick={() => removeMessage(message.id)}
          >
            <FontAwesomeIcon icon={faClose} className="icon" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default MessagesList;
