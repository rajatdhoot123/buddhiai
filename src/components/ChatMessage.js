import Image from "next/image";
import React from "react";

const ChatMessage = ({ message, isCurrentUser }) => {
  const messageClasses = `text-white ${
    isCurrentUser ? "" : "bg-[#444654] border border-solid  border-[#32343A]"
  }`;

  return (
    <div className={`flex items-center px-44 py-5 ${messageClasses}`}>
      <div>
        <Image
          alt="Chat GPT"
          height="24"
          width="24"
          src={isCurrentUser ? "/user_icon.png" : "/chat_gpt.png"}
        />
      </div>
      <div className="ml-5">{message.text}</div>
    </div>
  );
};

export default ChatMessage;
