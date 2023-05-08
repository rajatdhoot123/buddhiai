import {
  useContext,
  useEffect,
  createContext,
  useReducer,
  useState,
} from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { getAvailableAgents } from "../axios";

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
          state.files.find((file) => file.name === action.payload) || null,
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
  const [docsLoading, setDocsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const userId = user?.id;

  const handleActiveFile = (fileId) => {
    dispatch({ type: SET_FILE_ACTIVE, payload: fileId });
  };

  const addNewUploadedFile = async () => {
    const { data: availableAgent } = await getAvailableAgents();
    dispatch({
      type: SET_ALL_DOS,
      payload: availableAgent.data,
    });
    return availableAgent.data;
  };

  const updateFiles = (files) => {
    dispatch({
      type: SET_ALL_DOS,
      payload: files,
    });
  };

  useEffect(() => {
    const getChatAgents = async (userId) => {
      const { data, error } = await supabaseClient
        .from("chat_agents")
        .select()
        .eq("created_by", userId);
      return { data, error };
    };
    if (userId) {
      (async () => {
        setDocsLoading(true);
        try {
          const [{ data: availableAgent }, { data: chat_agents }] =
            await Promise.all([getAvailableAgents(), getChatAgents(userId)]);

          dispatch({
            type: SET_ALL_DOS,
            payload: availableAgent.data,
          });
        } catch (err) {
          console.log({ err });
        } finally {
          setDocsLoading(false);
        }
      })();
    }
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        docsLoading,
        handleActiveFile,
        addNewUploadedFile,
        updateFiles,
      }}
    >
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
