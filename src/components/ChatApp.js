import { askQuestion } from "../axios";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { EmbedHeader } from "../components/Embed";
import { useRouter } from "next/router";

const ChatApp = ({ activeFile, buddhiAppId, styles, initial_message = "" }) => {
  const [state, setState] = useState([]);

  const [history, setHistory] = useState([]);
  const divRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (initial_message) {
      setTimeout(() => {
        setState((prev) => [
          ...prev,
          {
            type: "answer",
            id: uuidv4(),
            text: initial_message,
          },
        ]);
      }, 200);
    }
  }, [initial_message]);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [state]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(buddhiAppId || activeFile)) {
      toast.error("Please select file to chat");
      event.target.reset();
      return;
    }
    const formData = new FormData(event.currentTarget);
    let payload = {};
    for (let [key, value] of formData.entries()) {
      payload[key] = value;
      payload.id = uuidv4();
      payload.type = "question";
    }
    setState((prev) => [...prev, payload]);
    setTimeout(() => {
      setState((prev) => [
        ...prev,
        {
          type: "thinking",
          id: uuidv4(),
          text: "Hang tight, we're brainstorming to find the perfect solution to your question!",
        },
      ]);
    }, 500);
    event.target.reset();
    try {
      const { data } = await askQuestion({
        question: payload.text,
        history: history,
        filename: activeFile?.name,
        buddhiAppId,
      });
      setHistory((prev) => [...prev, [payload.text, data.text]]);
      setState((prev) => prev.filter((_, index) => index !== prev.length - 1));
      setState((prev) => [
        ...prev,
        { id: uuidv4(), type: "answer", text: data.text },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <div className={`h-screen flex flex-col ${styles?.bgColor}`}>
      {router.pathname.startsWith("/embed") ? (
        <EmbedHeader />
      ) : (
        <div>&nbsp;</div>
      )}

      <div className="flex-1 overflow-y-auto">
        {state.map((el) => (
          <ChatMessage
            key={el.id}
            message={{
              user: { name: "Rajats", avatarUrl: "" },
              text: el.text,
            }}
            type={el.type}
          />
        ))}
        <div ref={divRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="items-end text-center md:px-44 p-2"
      >
        <div className="flex">
          <input
            name="text"
            placeholder="Ask Anything"
            className="w-full rounded-l-md px-5 py-2 focus:outline-none focus:border-blue-200 border"
          />
          <button type="submit" className="bg-white px-5 rounded-r-md">
            <FaPaperPlane />
          </button>
        </div>
        <small className="py-0.5 text-white text-center">
          Powered by{" "}
          <a
            href="https://buddhiai.app"
            target="_blank"
            className="text-indigo-500"
          >
            buddhiai
          </a>
        </small>
      </form>
    </div>
  );
};

export default ChatApp;
