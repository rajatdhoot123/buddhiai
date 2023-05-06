// import { askQuestion } from "../../axios";
import ChatApp from "@/components/ChatApp";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
const App = () => {
  const handleClose = () => {
    if (typeof window !== "undefined") {
      window?.parent?.document?.getElementById("chat-icon")?.click();
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex p-5 justify-between">
        <span>BuddhiAI</span>
        <div className="flex space-x-5">
          <HiOutlineRefresh className="h-6 w-6" />
          <AiOutlineClose onClick={handleClose} className="h-6 w-6" />
        </div>
      </div>
      <ChatApp />
      <small className="text-center py-0.5">
        Powered by{" "}
        <a
          href="https://buddhiai.app"
          target="_blank"
          className="text-indigo-500"
        >
          buddhiai
        </a>
      </small>
    </div>
  );
};

export default App;
