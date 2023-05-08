import { askQuestion } from "../../axios";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
import Link from "next/link";
import ChatApp from "../../components/ChatApp";

const App = () => {
  const { activeFile, files, handleActiveFile } = useApp();

  if (activeFile) {
    return <ChatApp activeFile={activeFile} />;
  }
  return (
    <div className="flex flex-col justify-between h-full gap-5">
      {!files.length ? (
        <div className="h-full w-full flex-col flex items-center justify-center">
          <Link
            href="/app/upload_document"
            className="border border-white border-opacity-60 p-3 rounded-lg"
          >
            <div className="text-white font-medium text-3xl text-center">
              Upload your doc
            </div>
            <div className="text-white mt-2 text-center">
              Will get your agent trained
            </div>
          </Link>
        </div>
      ) : (
        !activeFile && (
          <div className="h-full w-full flex-col flex items-center justify-center">
            <div className="text-white font-medium text-3xl my-5 text-center">
              Select doc and start talking to your agent
            </div>
            <div className="w-full flex flex-col items-center space-y-3">
              {files.map((file) => (
                <button
                  onClick={() => {
                    handleActiveFile(file.name);
                  }}
                  key={file.name}
                  className="text-white border-white border-opacity-50 border rounded-md w-1/2 py-3"
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default App;
