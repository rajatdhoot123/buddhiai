import { askQuestion } from "../../axios";
import ChatMessage from "@/components/ChatMessage";
import { useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
import Link from "next/link";

const App = () => {
  const [state, setState] = useState([]);
  const lastMessageRef = useRef(null);
  const { activeFile, files, handleActiveFile } = useApp();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!activeFile) {
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
        filename: activeFile.name,
      });
      setState((prev) => prev.filter((_, index) => index !== prev.length - 1));
      setState((prev) => [
        ...prev,
        { id: uuidv4(), type: "answer", text: data.text },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col justify-between h-full gap-5">
      <div className="flex-1 h-full overflow-y-scroll">
        {!files.filter(({ is_available }) => is_available).length ? (
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
              <div className="text-white font-medium text-3xl my-5">
                Select doc and start talking to your agent{" "}
              </div>
              <div className="w-full flex flex-col items-center space-y-3">
                {files.map((file) =>
                  file.is_available ? (
                    <button
                      onClick={() => {
                        handleActiveFile(file.id);
                      }}
                      key={file.id}
                      className="text-white border-white border-opacity-50 border rounded-md w-1/2 py-3"
                    >
                      {file.name}
                    </button>
                  ) : null
                )}
              </div>
            </div>
          )
        )}
        {state.map((el) =>
          el.type === "thinking" ? (
            <div key={el.id}>
              <div className="flex">
                <div className="flex px-44 space-x-2 items-center">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
                  <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
                  <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse bg-white"></div>
                  <div className="text-white ml-2">{el.text}</div>
                </div>
              </div>
            </div>
          ) : (
            <ChatMessage
              key={el.id}
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: el.text,
              }}
              isCurrentUser={el.type === "question"}
            />
          )
        )}
        <div
          style={{ float: "left", clear: "both" }}
          ref={lastMessageRef}
        ></div>
      </div>
      <div className="px-44 mb-12">
        <form onSubmit={handleSubmit} className="flex">
          <input
            name="text"
            placeholder="Type here"
            className="w-full rounded-l-md px-5 py-2 focus:outline-none focus:border-blue-200 border"
          />
          <button type="submit" className="bg-white px-5 rounded-r-md">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
