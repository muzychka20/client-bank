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
      {messages.map((message, index) => (
        <div key={index} className={`message-wrapper`}>
          {message}
          <button
            className="message-close"
            onClick={() => removeMessage(index)}
            // onClick={console.log(index)}
          >
            <FontAwesomeIcon icon={faClose} className="icon" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default MessagesList;
