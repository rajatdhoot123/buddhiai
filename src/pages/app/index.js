import { askQuestion } from "../../axios";
import ChatMessage from "@/components/ChatMessage";
// import { useSocket } from "@/context/SocketContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const LEFT_ICONS = [{ label: "Agent" }];

const App = () => {
  const [state, setState] = useState([]);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  // const socket = useSocket();

  const handleSubmit = async (event) => {
    const formData = new FormData(event.currentTarget);
    let payload = {};
    for (let [key, value] of formData.entries()) {
      payload[key] = value;
      payload.id = uuidv4();
      payload.type = "question";
    }
    setState((prev) => [...prev, payload]);
    event.target.reset();
    event.preventDefault();
    try {
      const { data } = await askQuestion({ question: payload.text });
      setState((prev) => [
        ...prev,
        { id: uuidv4(), type: "answer", text: data.text },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-12 chat-bg h-screen">
      <div className="col-span-2 p-5 h-full bg-[#202123]">
        <div className="flex flex-col justify-between h-full">
          <ul>
            {LEFT_ICONS.map(({ label }) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <button
            onClick={async () => {
              await supabaseClient.auth.signOut();
              router.push("/");
            }}
            className="text-center bg-red-300 rounded-md text-white py-2"
          >
            Signout
          </button>
        </div>
      </div>
      <div className="col-span-10 overflow-y-scroll">
        <div className="flex flex-col justify-between h-full gap-5">
          <div className="flex-1 h-full overflow-y-scroll">
            {state.map((el) => (
              <ChatMessage
                key={el.id}
                message={{
                  user: { name: "Rajats", avatarUrl: "" },
                  text: el.text,
                }}
                isCurrentUser={el.type === "question"}
              />
            ))}
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
      </div>
    </div>
  );
};

export default App;
