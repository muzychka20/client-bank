import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { USERNAME } from "../constants";
import "../styles/Header.css";

function Header() {
  function logout() {
    addMessage(
      <Message
        name={"Authorization"}
        message={"You've logged out"}
        type={"neutral"}
      />
    );
  }

  return (
    <header>
      <h1 className="header-title">Client Bank</h1>
      <div className="header-info">
        <p className="header-user">
          <FontAwesomeIcon icon={faUserCircle} /> User:{" "}
          {localStorage.getItem(USERNAME)}
        </p>
        <a href="/logout" onClick={logout} className="header-logout">
          Log Out
          <FontAwesomeIcon icon={faRightFromBracket} />
        </a>
      </div>
    </header>
  );
}

export default Header;
