import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Message.css";

function Message({ name, message, type }) {
  let icon;
  switch (type) {
    case "error":
      icon = faCircleExclamation;
      break;
    case "success":
      icon = faTriangleExclamation;
      break;
    case "warning":
      icon = faTriangleExclamation;
      break;
    case "neutral":
      icon = faCircleCheck;
      break;
    default:
      icon = faTriangleExclamation;
  }

  return (
    <div className={`message-content ${type}`}>
      <h4 className="message-title">
        <FontAwesomeIcon icon={icon} className="icon" />
        {name}
      </h4>
      <p className="message-text">{message}</p>
    </div>
  );
}

export default Message;
