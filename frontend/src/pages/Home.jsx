import { useEffect, useState } from "react";
import api from "../api";
import Dropzone from "../components/Dropzone";
import {
  MessagesContextProvider,
  useMessages,
} from "../contexts/MessagesContext";
import Message from "../components/Message";


function Home() {
  const { addMessage } = useMessages();

  function logout() {
    console.log('click')
    addMessage(
      <Message
        name={"Authorization"}
        message={"You've logged out"}
        type={"neutral"}
      />
    );
  }

  return (
    <div>
      <h1>Hello</h1>
      <Dropzone />
      <a href="/logout" onClick={logout}>
        logout
      </a>
    </div>
  );
}

export default Home;
