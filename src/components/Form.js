import React, { useState, useRef } from "react";
import * as Form from "@radix-ui/react-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "../../components/ui";
import { QA_PROMPT_MAPPER } from "../constant/prompt";
import { FaRegFilePdf } from "react-icons/fa";
import { HiUpload, HiOutlineDocumentText } from "react-icons/hi";
import { checkSpecialCharacter } from "../utils";
import { toast } from "react-hot-toast";
import { trainBulk, readExcel } from "../axios";
import Loader from "./Loader";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
const ACCEPTED_FILES = [
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const FilesPreview = ({ files, setFile }) => {
  const handleRemoveFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="flex space-x-2 flex-wrap">
      {files.map((file, index) => {
        return (
          <div key={file.agent_name}>
            <div className="relative inline-block">
              <a
                className="m-auto"
                href={URL.createObjectURL(file)}
                target="_blank"
              >
                {(() => {
                  switch (file.type) {
                    case "application/pdf":
                      return (
                        <>
                          <FaRegFilePdf className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.agent_name}
                          </div>
                        </>
                      );
                    case "text/plain":
                      return (
                        <>
                          <HiOutlineDocumentText className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.agent_name}
                          </div>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
              </a>
              <button
                type="button"
                className="rounded-full absolute top-0 right-0 h-4 w-4 flex justify-center items-center bg-gray-300 p-1 text-gray-700 hover:bg-gray-400 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(index);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const UploadForm = ({ addNewUploadedFile, agents }) => {
  const [state, setState] = useState({
    agentName: "",
    agentType: "super_agent",
    prompt: QA_PROMPT_MAPPER.super_agent,
  });
  const [loading, setLoading] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFile] = useState([]);
  const fileSize = useRef(0);
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const handleSetFiles = async (newFiles) => {
    fileSize.current = newFiles.reduce((acc, current) => {
      return acc + Number(current.size);
    }, fileSize.current);

    if (fileSize.current / (1024 * 1024) > 5) {
      toast(
        "For free version we support file less than 4mb. Contact us for larger files"
      );
      return;
    }
    const data = newFiles.filter(
      (newFile) =>
        !files.find((prevFile) => newfile.agent_name === prevfile.agent_name)
    );
    setFile((prev) => [...prev, ...data]);

    try {
      const formData = new FormData();
      data.forEach((file) => {
        formData.append(file.agent_name, file);
      });
      const { data: fileData } = await readExcel(formData);
      console.log(fileData);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const agent = state.agentName.trim();

    const isAgentPresent = agents.find((a) => a.agent_name === agent);

    if (isAgentPresent) {
      return toast.error(
        `Agent already existed with name ${isAgentPresent.agent_name}`
      );
    }
    if (!agent) {
      return toast.error("Agent name required");
    }
    if (checkSpecialCharacter(agent)) {
      return toast.error("Agent name should not contain special character");
    }
    if (!files.length) {
      return toast.error("Please upload file to train");
    }
    const formData = new FormData();
    formData.append("agent_name", agent);
    formData.append("prompt", state.prompt);
    files.forEach((file) => {
      formData.append(file.name, file);
    });
    try {
      setLoading("Hold on we are training your files");
      const uploadFiles = files.map((file) => {
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
        .insert({
          created_by: user?.id,
          prompt: state.prompt,
          agent_type: state.agentType,
          agent_name: state.agentName,
          files: filesToInsertInTable,
        })
        .select();
      if (isTraind.status === "fulfilled") {
        toast.success(`${agent} Trained Successfully`);
      } else {
        toast.success(`${agent} training failed please try again`);
      }
      setLoading("");
    } catch (err) {
      setLoading("");
      console.log(err);
    } finally {
      await addNewUploadedFile();
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="w-full md:w-1/2 m-auto p-5">
      <Form.Field className="grid mb-[10px]" name="file_name">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Agent Name
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            onChange={(e) =>
              setState((prev) => ({ ...prev, agentName: e.target.value }))
            }
            value={state.agentName}
            className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
            type="text"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="grid mb-[10px]" name="file_name">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Select Agent Type
          </Form.Label>
        </div>
        <Form.Control asChild>
          <Select
            value={state.agentType}
            onValueChange={(e) =>
              setState((prev) => ({
                ...prev,
                agentType: e,
                prompt: QA_PROMPT_MAPPER[e],
              }))
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Agent Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Agent</SelectLabel>
                <SelectItem value="super_agent">Super Agent</SelectItem>
                <SelectItem value="shopping_agent">Shopping Agent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Form.Control>
      </Form.Field>
      <Form.Field
        name="file-upload"
        className={`${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 bg-white"
        } border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-600`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-baseline justify-between w-full">
          <Form.Label className="w-full text-[15px] font-medium leading-[35px] text-black">
            <div className="flex flex-col items-center">
              <HiUpload className="h-12 w-12" aria-hidden="true" />
              <div className="whitespace-nowrap	cursor-pointer text-cen">
                {isDragging
                  ? "Drop pdf file here"
                  : "Drag and drop or click here"}
              </div>
            </div>
            <FilesPreview files={files} setFile={setFile} />
          </Form.Label>
          <Form.Control asChild>
            <input
              required
              multiple
              name="file_upload"
              accept={ACCEPTED_FILES.join(",")}
              type="file"
              className="sr-only"
              onChange={(event) => {
                const files = Array.from(event.target.files);
                handleSetFiles(files);
                event.target.value = null;
              }}
            />
          </Form.Control>
        </div>
      </Form.Field>
      <Form.Field className="grid mb-[10px]" name="question">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Prompt
          </Form.Label>
        </div>
        <Form.Control asChild>
          <textarea
            value={state.prompt}
            onChange={(e) =>
              setState((prev) => ({ ...prev, prompt: e.target.value }))
            }
            rows={5}
            className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9 resize-none"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button
          disabled={loading}
          onClick={handleSubmit}
          type="submit"
          className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-indigo-400 px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]"
        >
          {loading && (
            <span>
              <Loader />
            </span>
          )}
          <span className="text-white">{loading || "Create Agent"}</span>
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default UploadForm;
