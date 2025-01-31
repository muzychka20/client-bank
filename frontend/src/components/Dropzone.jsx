import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dropzone.css";
import "../styles/AuthForm.css";
import api from "../api";
import { useMessages } from "../contexts/MessagesContext";
import Message from "../components/Message";
import { usePayments } from "../contexts/PaymentsContext";

function Dropzone(props) {
  const [file, setFile] = useState(null);
  const { addMessage } = useMessages();
  const { addPayments } = usePayments();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const onDropRejected = useCallback(() => {
    addMessage(
      <Message
        name={"File rejected!"}
        message={"Select one .dbf file!"}
        type={"error"}
      />
    );
  });

  const onDropAccepted = useCallback(() => {
    addMessage(
      <Message
        name={"Success"}
        message={"File uploaded successfully"}
        type={"success"}
      />
    );
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    onDropAccepted,
    accept: {
      "application/vnd.dbf": [".dbf"],
    },
    maxFiles: 1,
  });

  const text = file ? (
    <p className="dropzone-desc">
      File <b>{file.name}</b> was uploaded!
    </p>
  ) : (
    <p className="dropzone-desc">Drag and drop your .dbf file here</p>
  );

  const submitFile = async (e) => {
    e.preventDefault();
    if (!file) {
      addMessage(
        <Message
          name={"No file selected!"}
          message={"Select one .dbf file!"}
          type={"warning"}
        />
      );
      return;
    }
    let formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    try {
      const res = await api.post("/api/upload/file/", formData, config);
      if (res.data && res.data.records) {
        addPayments(res.data.records);
        addMessage(
          <Message name={"Succces!"} message={"Data loaded!"} type="success" />
        );
      }
      setFile(null);
    } catch (error) {
      let err = error.response.data.error;
      addMessage(
        <Message
          name={err.error_title}
          message={err.error_message}
          type={"warning"}
        />
      );
    }
  };

  return (
    <form onSubmit={submitFile} className="dropzone-form">
      <div className="dropzone-block">
        <div className="dropzone-wrapper" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <FontAwesomeIcon icon={faFileImage} className="icon" />
            <p className="dropzone-title">DROP FILE HERE</p>
            {text}
          </div>
        </div>
      </div>
      <button type="submit" className="form-button">
        Submit
      </button>
    </form>
  );
}

export default Dropzone;
