import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
export const EmbedHeader = () => {
  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.top.postMessage("closeBuddhiChat", "*");
    }
  };
  return (
    <div className="text-white flex justify-between p-5">
      <span>BuddhiAI</span>
      <div className="flex space-x-5">
        <HiOutlineRefresh className="h-6 w-6" />
        <AiOutlineClose onClick={handleClose} className="h-6 w-6" />
      </div>
    </div>
  );
};
