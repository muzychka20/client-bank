import React, { useState } from "react";
import { useMessages } from "../contexts/MessagesContext";
import api from "../api";
import { checkErrors } from "../helper";
import LoadingIndicator from "./LoadingIndicator";
import Message from "./Message";

export default function AnalyzeButtons() {
  const { addMessage } = useMessages();
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await api.post("ai/detect/service/");
  
      if (res.data) {
        const { status, message, data } = res.data;
        
        if (status === "success") {
          addMessage(
            <Message
              name="Analysis Complete"
              message={`Successfully processed ${data.success_count} records. ${data.error_count} errors.`}
              type="success"  
            />
          );
        } else {
          addMessage(
            <Message
              name="Analysis Error"
              message={message || "An error occurred during analysis"}
              type="error"  
            />
          );
        }
      }
    } catch (error) {
      checkErrors(error, addMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out dropzone-button" 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out dropzone-button" 
            onClick={() => console.log("Commit")}
            disabled={loading}
          >
            Commit
          </button>
        </div>
      </div>

      {loading && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"          
        >
          <div className="relative p-4 w-full max-w-2xl">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white " style={{padding: "20px 0px 10px 20px"}}>
                  Analyzing Records
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-4 flex flex-col items-center" style={{padding: "20px"}}>
                <LoadingIndicator />
                <p className="text-gray-500 dark:text-gray-300" style={{marginTop: "20px"}}>
                  Please wait
                </p>
              </div>            
            </div>
          </div>
        </div>
      )}
    </>
  );
}