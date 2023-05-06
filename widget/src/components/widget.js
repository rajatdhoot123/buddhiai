import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const ACTION_TYPES = {
  ADD_MESSAGE: "ADD_MESSAGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: action.loading,
      };
    default:
      return state;
  }
};

function Chat({ api, ...props }) {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    loading: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);
  const messageContainer = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let payload = {};
    for (let [key, value] of formData.entries()) {
      payload[key] = value;
    }
    event.target.reset();
    dispatch({
      type: ACTION_TYPES.ADD_MESSAGE,
      loading: true,
      payload: {
        message: payload.message,
        type: "user",
      },
    });

    await sleep(200);
    dispatch({
      type: ACTION_TYPES.ADD_MESSAGE,
      loading: true,
      payload: {
        message: "Thinking",
        type: "bot",
      },
    });

    try {
      const { data } = await axios.get(`/answer_bot/${api}`);
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        loading: false,
        payload: {
          message: data.text,
          type: "bot",
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        loading: false,
        payload: {
          message: "Something went wrong please try again",
          type: "bot",
        },
      });
    }
  };

  useEffect(() => {
    if (messageContainer?.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [state]);

  return (
    <>
      <div
        className="fixed bottom-4 right-4 w-16 h-16 bg-blue-500 rounded-full text-white text-center flex items-center justify-center cursor-pointer z-50"
        onClick={toggleChat}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 13c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm0 0l-5-5m5 5l-5-5"
          ></path>
        </svg>
      </div>
      {isOpen && (
        <div className="top-0 md:top-auto flex flex-col fixed md:bottom-20 md:right-4 md:w-80 w-full md:h-96 bg-white rounded-lg shadow-md z-50 h-screen">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-medium">Chat with us!</h3>
            <button onClick={toggleChat}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div
            ref={messageContainer}
            className="space-y-5 h-full overflow-y-auto px-4 py-2"
          >
            {state.messages.map(({ message }) => (
              <div key={message}>{message}</div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-between px-4 py-2"
          >
            <input
              disabled={state.loading}
              type="text"
              name="message"
              placeholder="Type your message..."
              className="flex-1 py-2 px-4 rounded-full bg-gray-200 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chat;
