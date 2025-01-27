import React from "react";
import { useDropzone } from "react-dropzone";
import "../styles/Dropzone.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";

function Dropzone(props) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "image/*": [] } });

  // Determine the dynamic class based on dropzone state
  let dropzoneClassName = "dropzone-wrapper";
  if (isFocused) dropzoneClassName += " dropzone-focused";
  if (isDragAccept) dropzoneClassName += " dropzone-accept";
  if (isDragReject) dropzoneClassName += " dropzone-reject";

  return (
    <div className="dropzone-block">
      <div className="dropzone-wrapper" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <FontAwesomeIcon icon={faFileImage} className="icon" />
          <p className="dropzone-title">
            DROP FILE HERE
          </p>
          <p className="dropzone-desc"> 
            Drag and drop your .dbf file here.            
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dropzone;
