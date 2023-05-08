import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { FaRegFilePdf } from "react-icons/fa";
import { HiUpload, HiOutlineDocumentText } from "react-icons/hi";
import { checkSpecialCharacter } from "../utils";
import { toast } from "react-hot-toast";
import { trainBulk } from "../axios";
const ACCEPTED_FILES = ["text/plain", "application/pdf"];

const FilesPreview = ({ files, setFile }) => {
  const handleRemoveFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="flex space-x-2 flex-wrap">
      {files.map((file, index) => {
        return (
          <div key={file.name}>
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
                            {file.name}
                          </div>
                        </>
                      );
                    case "text/plain":
                      return (
                        <>
                          <HiOutlineDocumentText className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.name}
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

const FormDemo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFile] = useState([]);
  const [agentName, setAgentName] = useState("");

  const handleSetFiles = (newFiles) => {
    const data = newFiles.filter(
      (newFile) => !files.find((prevFile) => newFile.name === prevFile.name)
    );

    setFile((prev) => [...prev, ...data]);
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
    console.log("dfdsfs");
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
    const agent = agentName.trim();
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
    files.forEach((file) => {
      formData.append(file.name, file);
    });
    try {
      const { data } = await trainBulk(formData);
      console.log({ data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="w-[460px]">
      <Form.Field className="grid mb-[10px]" name="file_name">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Agent Name
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            onChange={(e) => setAgentName(e.target.value)}
            value={agentName}
            className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
            type="text"
            required
          />
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
      <Form.Submit asChild>
        <button
          onClick={handleSubmit}
          type="submit"
          className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]"
        >
          Train
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default FormDemo;
