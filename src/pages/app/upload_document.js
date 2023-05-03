import { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { FaRegFilePdf } from "react-icons/fa";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { trainDocs } from "../../axios";
import { useApp } from "../../context/AppContext";

function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const { files = [] } = useApp();

  const supabaseClient = useSupabaseClient();
  const user = useUser();
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

  const handleFileUpload = async () => {
    const { data } = await supabaseClient.storage
      .from("buddhi_docs")
      .upload(`${user.id}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (data?.path) {
      try {
        const result = await trainDocs({ filename: file.name });
        console.log({ result });
      } catch (err) {}
    }
  };

  return (
    <div className="m-12">
      <div
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
            <label htmlFor="file-upload" className="cursor-pointer underline">
              <HiUpload className="h-12 w-12 m-auto" aria-hidden="true" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? "Drop file here" : "Drag and drop file here"}
                </p>
                <p className="text-xs text-gray-500">or {` for a file`}</p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    setFile(files[0]);
                  }}
                />
              </div>
            </label>
          </>
        )}
      </div>
      <button
        onClick={handleFileUpload}
        className="w-full bg-indigo-500 text-white my-5 rounded-md py-3 font-bold"
      >
        Start Upload
      </button>
      <div className="w-full h-0.5 bg-white my-12"></div>
      <ul className="space-y-5">
        {files.map((file) => (
          <li className="text-white" key={file.id}>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadDropzone;
