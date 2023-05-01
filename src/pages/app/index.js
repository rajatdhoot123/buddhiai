import ChatMessage from "@/components/ChatMessage";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const LEFT_ICONS = [{ label: "Agent" }];

const App = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
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
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
            <ChatMessage
              message={{
                user: { name: "Rajats", avatarUrl: "" },
                text: "Hello",
              }}
              isCurrentUser
            />
            <ChatMessage
              isCurrentUser={false}
              message={{
                user: {
                  name: "Rajats",
                  avatarUrl: <FaRobot size="36px" />,
                },
                text: "Hello",
              }}
            />
          </div>
          <div className="px-44 mb-12">
            <form onSubmit={handleSubmit} className="flex">
              <input
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
