import React from "react";
import Message from "./components/Message";

export const checkWarnings = (res, addMessage) => {
  if (res.data && res.data.warning) {
    addMessage(
      <Message
        name={res.data.warning.warning_title}
        message={res.data.warning.warning_message}
        type="warning"
      />
    );
  }
};

export const checkErrors = (error, addMessage) => {
  if (error.response && error.response.data && error.response.data.error) {
    const err = error.response.data.error;
    addMessage(
      <Message
        name={err.error_title}
        message={err.error_message}
        type="error"
      />
    );
  }
};

export const checkRecords = (res, addMessage, addPayments, source) => {
  if (res.data && res.data.records) {
    if (source !== "dropzone") {
      addPayments(
        res.data.records,
        res.data.count_record,
        res.data.sum_record,
        source
      );
    }
    addMessage(
      <Message name={"Succces!"} message={"Data loaded!"} type="success" />
    );
  }
};
