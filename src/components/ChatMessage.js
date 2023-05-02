import Image from "next/image";
import React from "react";

const ChatMessage = ({ message, isCurrentUser }) => {
  const messageClasses = `text-white ${
    isCurrentUser ? "" : "bg-[#444654] border border-solid  border-[#32343A]"
  }`;

  return (
    <div className={`flex items-center px-44 py-5 ${messageClasses}`}>
      <div className="relative h-8 w-8 flex-shrink-0">
        <Image
          className="object-contain"
          fill
          alt="Chat GPT"
          src={isCurrentUser ? "/user_icon.png" : "/logo.png"}
        />
      </div>
      <div className="ml-5">{message.text}</div>
    </div>
  );
};

export default ChatMessage;
