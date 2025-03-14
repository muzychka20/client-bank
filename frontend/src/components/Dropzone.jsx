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
import { checkWarnings, checkErrors, checkRecords } from "../helper";

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
      addMessage(
        <Message
          name={"Uploading..."}
          message={"Please wait..."}
          type={"success"}
        />
      );
      const res = await api.post("/api/upload/file/", formData, config);
      checkRecords(res, addMessage, addPayments, "dropzone");
      checkWarnings(res, addMessage);
      setFile(null);
    } catch (error) {
      checkErrors(error, addMessage);
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
