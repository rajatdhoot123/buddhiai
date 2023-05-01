import { io } from "socket.io-client";
import { useContext, useEffect, createContext, useState } from "react";
import { useSession, useUser } from "@supabase/auth-helpers-react";

const SocketContext = createContext();

const SocketProvider = ({ children = null }) => {
  const [socket, setSocket] = useState(null);
  const user = useUser();
  const session = useSession();
  const userId = user?.id;
  const token = session?.access_token;

  useEffect(() => {
    let socket;
    if (token && userId) {
      socket = io("https://buddhi.kwiktwik.com", {
        path:"/socket",
        withCredentials: true,
        auth: {
          authorization: `Bearer ${token}`,
        },
      });
      setSocket(socket);
      socket.on("connect", () => {
        socket.emit("join", userId);
        console.log("Connected to server");
      });

      socket.on("message", async (message) => {
        console.log(message.clientId, "message");
      });

      socket.on("joined_room", (message) => {
        console.log(message);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }
    return () => {
      socket?.disconnect();
    };
  }, [setSocket, token, userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export { SocketProvider, useSocket };
