import { io } from "socket.io-client";
import {
  useContext,
  useEffect,
  createContext,
  useState,
  useReducer,
} from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const AppContext = createContext();

const SET_ALL_DOS = "set_all_docs";
const SET_FILE_ACTIVE = "set_file_active";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ALL_DOS:
      return { ...state, files: action.payload || [] };
    case SET_FILE_ACTIVE:
      return {
        ...state,
        activeFile:
          state.files.find((file) => file.id === action.payload) || null,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children = null }) => {
  const [state, dispatch] = useReducer(reducer, {
    files: [],
    activeFile: null,
  });
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const userId = user?.id;

  const handleActiveFile = (fileId) => {
    dispatch({ type: SET_FILE_ACTIVE, payload: fileId });
  };
  useEffect(() => {
    if (userId) {
      (async () => {
        const { data } = await supabaseClient.storage
          .from("buddhi_docs")
          .list(userId, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        dispatch({
          type: SET_ALL_DOS,
          payload: data.filter(
            ({ name }) => name !== ".emptyFolderPlaceholder"
          ),
        });
      })();
    }
  }, [userId]);

  return (
    <AppContext.Provider value={{ ...state, handleActiveFile }}>
      {children}
    </AppContext.Provider>
  );
};

function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}

export { AppProvider, useApp };
