import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { FaRegFilePdf } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";

const FormDemo = () => {
  const [isLoading, setIsLoading] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

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
    setFile(files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };
  return (
    <Form.Root className="w-[260px]">
      <Form.Field className="grid mb-[10px]" name="email">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Email
          </Form.Label>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="valueMissing"
          >
            Please enter your email
          </Form.Message>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="typeMismatch"
          >
            Please provide a valid email
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
            type="email"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="grid mb-[10px]" name="question">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
            Question
          </Form.Label>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a question
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea
            className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9 resize-none"
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
        {file ? (
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              {file.type === "application/pdf" ? (
                <a
                  href={URL.createObjectURL(file)}
                  target="_blank"
                  className="flex justify-center flex-col items-center"
                >
                  <FaRegFilePdf className="w-24 h-24" />
                  <span className="text-center text-xs font-bold my-2">
                    View File
                  </span>
                </a>
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-40 object-cover"
                />
              )}
            </div>
            <button
              type="button"
              className="h-8 w-8 absolute top-0 right-0 rounded-full bg-gray-300 p-1 text-gray-700 hover:bg-gray-400 hover:text-white"
              onClick={handleRemoveFile}
            >
              &times;
            </button>
          </div>
        ) : (
          <>
            <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
              <HiUpload className="h-12 w-12 m-auto" aria-hidden="true" />
              <div>
                {isDragging
                  ? "Drop pdf file here"
                  : "Drag and drop pdf file here"}
              </div>
            </Form.Label>
            <Form.Control asChild>
              <input
                accept="application/pdf"
                type="file"
                className="sr-only"
                onChange={(event) => {
                  const files = Array.from(event.target.files);
                  setFile(files[0]);
                }}
              />
            </Form.Control>
          </>
        )}
      </Form.Field>
      <Form.Submit asChild>
        <button className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
          Post question
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default FormDemo;
