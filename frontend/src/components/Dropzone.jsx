import React, { useCallback, useState } from "react"; 
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dropzone.css";
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
        message={"Select a valid file format!"}
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
    <p className="mb-2 text-sm text-gray-500 font-semibold dropzone-desc">
      Click to upload or drag and drop
    </p>
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
    <form onSubmit={submitFile}>
      <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out dropzone-block">
          <div {...getRootProps()} className="flex flex-col items-center justify-center pt-5 pb-6">
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faFileImage} className="text-gray-500 dropzone-icon"/>
            <p className="text-xs text-gray-500 dropzone-desc">
              .dbf
            </p>
            {text}
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out dropzone-button">
        Submit
      </button>
    </form>
  );
}

export default Dropzone;
