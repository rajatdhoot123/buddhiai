import { useContext, useEffect, createContext, useReducer } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { checkFileExist } from "../axios";

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

  const addNewUploadedFile = async () => {
    const { data } = await supabaseClient.storage
      .from("buddhi_docs")
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    const files = data.filter(({ name }) => name !== ".emptyFolderPlaceholder");
    const { data: isFileAvailable } = await checkFileExist({ files });

    dispatch({
      type: SET_ALL_DOS,
      payload: isFileAvailable.data,
    });
    return isFileAvailable.data;
  };

  const updateFiles = (files) => {
    dispatch({
      type: SET_ALL_DOS,
      payload: files,
    });
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
        const files = data.filter(
          ({ name }) => name !== ".emptyFolderPlaceholder"
        );

        const { data: isFileAvailable } = await checkFileExist({ files });
        dispatch({
          type: SET_ALL_DOS,
          payload: isFileAvailable.data,
        });
      })();
    }
  }, [userId]);

  return (
    <AppContext.Provider
      value={{ ...state, handleActiveFile, addNewUploadedFile, updateFiles }}
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
