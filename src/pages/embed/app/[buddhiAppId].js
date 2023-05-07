// import { askQuestion } from "../../axios";
import ChatApp from "@/components/ChatApp";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
const App = () => {
  const { query } = useRouter();
  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.top.postMessage("closeBuddhiChat", "*");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#343541] rounded-md">
      <div className="flex p-5 justify-between text-white">
        <span>BuddhiAI</span>
        <div className="flex space-x-5">
          <HiOutlineRefresh className="h-6 w-6" />
          <AiOutlineClose onClick={handleClose} className="h-6 w-6" />
        </div>
      </div>
      <ChatApp buddhiAppId={query?.buddhiAppId} />
      <small className="text-center py-0.5 text-white">
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
