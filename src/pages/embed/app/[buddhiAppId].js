// import { askQuestion } from "../../axios";
import ChatApp from "@/components/ChatApp";

import { useRouter } from "next/router";

const App = () => {
  const { query } = useRouter();

  return (
    <ChatApp
      initial_message={query.initial_message}
      styles={{ bgColor: "bg-[#343541]" }}
      buddhiAppId={query?.buddhiAppId}
    />
  );
};

export default App;
