import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ACCEPTED_FILES, AGENT_TYPE, CSV, EXCEL_FORMAT } from "../../constant";
import { PROMPT_SUFFIX, generatePrompt } from "../../constant/prompt";
import { useApp } from "../../context/AppContext";
import { useEffect, useReducer, useRef, useState } from "react";
import { checkSpecialCharacter } from "../../utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  Button,
} from "../../../components/ui";
import FilesPreview from "../../components/FilePreview";
import { HiUpload } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { readExcel, trainBulk } from "../../axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";

const SET_STEP = "SET_STEP";
const SET_AGENT_NAME = "SET_AGENT_NAME";
const SET_AGENT_TYPE = "SET_AGENT_TYPE";
const SET_NEXT_STEP = "SET_NEXT_STEP";
const FILE_REMOVE = "FILE_REMOVE";
const SET_FILES = "SET_FILES";
const REMOVE_FILE = "REMOVE_FILE";
const SET_PREV_STEP = "SET_PREV_STEP";
const SET_PROMPT = "SET_PROMPT";
const SET_PROMPT_HELPER = "SET_PROMPT_HELPER";

function reducer(state, action) {
  switch (action.type) {
    case SET_PROMPT_HELPER:
      return { ...state, prompt_helper: action.payload };
    case SET_PREV_STEP:
      return { ...state, step: state.step - 1 };
    case SET_FILES:
      return { ...state, files: [...state.files, ...action.payload] };
    case FILE_REMOVE:
      return state;
    case SET_NEXT_STEP:
      return { ...state, step: state.step + 1 };
    case SET_AGENT_TYPE:
      return {
        ...state,
        agent_type: action.payload,
        prompt: generatePrompt(action.payload),
      };
    case SET_PROMPT:
      return { ...state, prompt: action.payload };
    case SET_STEP:
      return { ...state, step: action.payload };
    case REMOVE_FILE:
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.payload),
      };
    case SET_AGENT_NAME:
      return {
        ...state,
        agent_name: action.payload, //{ ...state.agent_name, ...action.payload },
      };
    default:
      return state;
  }
}

const ThirdStep = ({ state, dispatch }) => {
  useEffect(() => {
    if (state.agent_type === AGENT_TYPE.SHOPPING_AGENT && state.prompt_helper) {
      dispatch({
        type: SET_PROMPT,
        payload: generatePrompt(AGENT_TYPE.SHOPPING_AGENT, state.prompt_helper),
      });
    }
  }, [state.agent_type, state.prompt_helper, dispatch]);
  return (
    <div className="grid mb-[10px]" name="question">
      <div className="flex items-baseline justify-between">
        <div className="text-[15px] font-medium leading-[35px] text-white">
          Prompt
        </div>
      </div>
      <textarea
        value={state.prompt}
        onChange={(e) =>
          dispatch({ type: SET_PROMPT, payload: e.target.value })
        }
        rows={10}
        className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9 resize-none"
        required
      />
    </div>
  );
};

const SecondStep = ({ state, dispatch }) => {
  const fileSize = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const handleFileRemove = (index) => {
    dispatch({ type: REMOVE_FILE, payload: index });
  };

  const handleSetFiles = async (newFiles) => {
    fileSize.current = newFiles.reduce((acc, current) => {
      return acc + Number(current.size);
    }, fileSize.current);

    if (fileSize.current / (1024 * 1024) > 25) {
      toast(
        "For free version we support file less than 4mb. Contact us for larger files"
      );
      return;
    }
    const data = newFiles.filter(
      (newFile) =>
        !state.files.find((prevFile) => newFile.name === prevFile.name)
    );
    dispatch({ type: SET_FILES, payload: data });

    try {
      const formData = new FormData();
      data.forEach((file) => {
        if ([CSV, EXCEL_FORMAT].includes(file.type)) {
          formData.append(file.name, file);
        }
      });
      const { data: fileData } = await readExcel(formData);
      const columns = fileData.filter(Boolean).reduce((acc, current) => {
        return [...acc, ...Object.keys(current.data[0])];
      }, []);

      dispatch({ type: SET_PROMPT_HELPER, payload: columns.join(",") });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    const acceptedFiles = files.filter((file) =>
      ACCEPTED_FILES.includes(file.type)
    );
    handleSetFiles(acceptedFiles);
  };
  return (
    <div
      name="file-upload"
      className={`${
        isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
      } w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-600`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label
        htmlFor="file_upload"
        className="flex items-baseline justify-between w-full"
      >
        <div className="w-full text-[15px] font-medium leading-[35px] text-black">
          <div className="flex flex-col items-center">
            <HiUpload className="h-12 w-12" aria-hidden="true" />
            <div className="whitespace-nowrap	cursor-pointer text-cen">
              {isDragging
                ? "Drop pdf file here"
                : "Drag and drop or click here"}
            </div>
          </div>
          <FilesPreview files={state.files} onFileRemove={handleFileRemove} />
        </div>
        <input
          required
          multiple
          id="file_upload"
          accept={ACCEPTED_FILES.join(",")}
          type="file"
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files);
            handleSetFiles(files);
            event.target.value = null;
          }}
        />
      </label>
    </div>
  );
};

const FirstStep = ({ state, dispatch }) => {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <div className="text-[15px] font-medium leading-[35px] text-white">
          Agent Name
        </div>
      </div>
      <input
        onChange={(e) => {
          dispatch({ type: SET_AGENT_NAME, payload: e.target.value });
        }}
        value={state.agent_name}
        className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
        type="text"
      />

      <div className="flex items-baseline justify-between">
        <div className="text-[15px] font-medium leading-[35px] text-white">
          Select Agent Type
        </div>
      </div>
      <Select
        value={state.agent_type}
        onValueChange={(e) => {
          dispatch({ type: SET_AGENT_TYPE, payload: e });
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select Agent Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Agent</SelectLabel>
            <SelectItem value={AGENT_TYPE.SUPER_AGENT}>Super Agent</SelectItem>
            <SelectItem value={AGENT_TYPE.SHOPPING_AGENT}>
              Shopping Agent
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

function TrainAgent() {
  const router = useRouter();
  const { files = [], addNewUploadedFile } = useApp();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const [isLoading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    agent_name: "",
    agent_type: AGENT_TYPE.SUPER_AGENT,
    files: [],
    prompt: generatePrompt(AGENT_TYPE.SUPER_AGENT),
    prompt_helper: "",
  });

  const handleNextStep = () => {
    if (state.step === 1) {
      if (files.find((a) => a.agent_name === state.agent_name)) {
        return toast.error(`Agent with name ${state.agent_name} already exist`);
      }
      if (!state.agent_name) {
        return toast.error("Agent name required");
      }
      if (checkSpecialCharacter(state.agent_name)) {
        return toast.error("Special character not allowed in agent name");
      }
    } else if (state.step === 2) {
      if (state.files.length <= 0) {
        return toast.error("Upload the file to train on");
      }
    }
    dispatch({ type: SET_NEXT_STEP });
  };

  const handlePrevStep = () => {
    dispatch({ type: SET_PREV_STEP });
  };

  const handleAgentCreate = async () => {
    const final_prompt = `${state.prompt} ${PROMPT_SUFFIX}`;
    const agent = state.agent_name.trim();
    const formData = new FormData();
    formData.append("agent_name", state.agent_name);
    formData.append("prompt", final_prompt);
    state.files.forEach((file) => {
      formData.append(file.name, file);
    });
    try {
      setLoading("Hold on we are training your files");
      const { data: createAgent, error } = await supabaseClient
        .from("chat_agents")
        .insert({
          created_by: user?.id,
          prompt: final_prompt,
          agent_type: state.agent_type,
          agent_name: state.agent_name,
        })
        .select();

      if (error) {
        return toast.error(`Something went wrong: ${error.message}`);
      }
      const uploadFiles = state.files.map((file) => {
        return supabaseClient.storage
          .from("buddhi_docs")
          .upload(`${user.id}/${agent}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: true,
          });
      });
      const data = await Promise.allSettled([
        trainBulk(formData),
        ...uploadFiles,
      ]);
      const [isTraind, ...uploadedFiles] = data;

      const filesToInsertInTable = uploadedFiles.map((file) => {
        if (file.status === "fulfilled") {
          return file?.value?.data?.path;
        }
        return "";
      });

      await supabaseClient
        .from("chat_agents")
        .update({
          files: filesToInsertInTable,
        })
        .eq("id", createAgent[0].id);

      if (isTraind.status === "fulfilled") {
        toast.success(`${agent} Trained Successfully`);
        router.push("/app/agent");
      } else {
        toast.error(`${agent} training failed please try again`);
      }
      setLoading("");
    } catch (err) {
      setLoading("");
    } finally {
      await addNewUploadedFile();
    }
  };

  return (
    <div className="md:px-44 p-5 h-full flex items-center flex-col justify-center w-full">
      <ol className="flex items-center w-full justify-center">
        <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
          <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </li>
        <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
          <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </li>
      </ol>

      <div className="py-12 flex items-center w-full">
        {(() => {
          switch (state.step) {
            case 1:
              return (
                <div className="w-full">
                  <FirstStep state={state} dispatch={dispatch} />
                  <div className="w-full flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      className="my-5 w-36 bg-white text-black hover:text-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              );
            case 2:
              return (
                <div className="w-full">
                  <SecondStep state={state} dispatch={dispatch} />
                  <div className="w-full flex justify-between">
                    <Button
                      onClick={handlePrevStep}
                      className="my-5 w-36 bg-white text-black hover:text-white"
                    >
                      Prev
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="my-5 w-36 bg-white text-black hover:text-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              );
            case 3:
              return (
                <div className="w-full">
                  <ThirdStep state={state} dispatch={dispatch} />
                  <div className="w-full flex justify-between">
                    <Button
                      onClick={handlePrevStep}
                      className="my-5 w-36 bg-white text-black hover:text-white"
                    >
                      Prev
                    </Button>
                    <Button
                      disabled={isLoading}
                      onClick={handleAgentCreate}
                      className="flex my-5 w-44 bg-white text-black hover:text-white"
                    >
                      {isLoading && (
                        <Loader className="text-black hover:text-white" />
                      )}
                      <span>{isLoading || "Create Agent"}</span>
                    </Button>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}

export default TrainAgent;
