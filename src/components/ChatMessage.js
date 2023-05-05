import Image from "next/image";
import React from "react";

const Thinking = () => (
  <div className="flex">
    <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
    <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
    <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
  </div>
);

const ChatMessage = React.forwardRef(({ message, type }, ref) => {
  const isCurrentUser = type === "question";
  const messageClasses = `text-white ${
    isCurrentUser ? "" : "bg-[#444654] border border-solid  border-[#32343A]"
  }`;

  return (
    <div
      ref={ref}
      className={`flex items-center px-5 md:px-44 py-5 ${messageClasses}`}
    >
      <div className="relative h-8 w-8 flex-shrink-0">
        <Image
          className="object-contain"
          fill
          alt="Chat GPT"
          src={isCurrentUser ? "/user_icon.png" : "/logo.png"}
        />
      </div>
      <div className="ml-5 flex items-center">
        {type === "thinking" && (
          <span className="mr-2">
            <Thinking />
          </span>
        )}

        <span
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: message.text }}
        ></span>
      </div>
    </div>
  );
});

ChatMessage.displayName = "Chat Message";

export default ChatMessage;
