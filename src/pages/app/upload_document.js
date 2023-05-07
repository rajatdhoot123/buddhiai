import { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { FaRegFilePdf, FaWhatsapp } from "react-icons/fa";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { WHATSAPP_SUPPORT_NUMBER } from "../../constant";
import { trainDocs } from "../../axios";
import { useApp } from "../../context/AppContext";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

const UploadedFiles = ({ file, handleTrainFile, userId }) => {
  const [loading, setLoading] = useState(false);
  const handleFileTraining = async () => {
    try {
      setLoading(true);
      await handleTrainFile(file);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <li
      className="text-white border border-white border-opacity-60 rounded-md p-2 flex justify-between"
      key={file.id}
    >
      <div>
        <div>{file.name}</div>

        <div
          className={`text-xs ${
            file.is_available ? "text-green-300" : "text-red-300"
          } `}
        >
          {file.is_available
            ? "Docs Trained"
            : "This file is trained chat with your agent"}
        </div>
      </div>
      {file.is_available ? (
        <Dialog>
          <DialogTrigger className="bg-indigo-400 text-white text-sm font-bold px-2 rounded-md flex items-center w-24 justify-center">
            Embed
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add the following script to your website
              </DialogTitle>
              <DialogDescription className="bg-gray-700 text-white px-5 rounded-md py-2">
                <textarea
                  readOnly
                  rows={7}
                  className="focus:outline-none w-full bg-transparent"
                  value={`<script \nbuddhi_api_id="${
                    typeof window !== "undefined" &&
                    window.btoa(JSON.stringify({ filename: file.name, userId }))
                  }" \nsrc="https://www.buddhiai.app/buddi_widget/min-buddhi.js" async>\n</script>`}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <button
          disabled={loading}
          onClick={handleFileTraining}
          className="bg-indigo-400 text-white text-sm font-bold px-2 rounded-md flex items-center w-24 justify-center"
        >
          {loading && <Loader />}
          <span>Train Me</span>
        </button>
      )}
    </li>
  );
};

function UploadDropzone() {
  const [isLoading, setIsLoading] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const { files = [], addNewUploadedFile, updateFiles } = useApp();

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

  const handleTrainFile = async (file) => {
    try {
      toast("Hold on we are training your docs");
      const uploadedFiles = await addNewUploadedFile();
      await trainDocs({ filename: file.name });
      updateFiles(
        uploadedFiles.map((ufile) =>
          ufile.name === file.name ? { ...ufile, is_available: true } : ufile
        )
      );
      toast.success("congratulations your file is now trained");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFileUpload = async () => {
    try {
      const size = (file.size / (1024 * 1024)).toFixed(2);
      if (size > 4) {
        toast(
          "For free version we support file less than 4mb. Contact us for larger files"
        );
        return;
      }
      toast("Uploading Started");
      setIsLoading("Uploading File Please wait");
      const { data } = await supabaseClient.storage
        .from("buddhi_docs")
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data?.path) {
        await handleTrainFile(file);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disabledUpload = isLoading || !file;
  return (
    <div className="m-12">
      {files.length >= 5 ? (
        <div>
          <div className="text-center text-3xl text-white">
            Currently In free version we are allowing 5 files to train
          </div>
          <div className="bg-green-500 w-full rounded-md p-2 mt-5">
            <a
              className="flex items-center justify-center text-xl"
              target="_blank"
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_SUPPORT_NUMBER}&text=hello`}
            >
              <FaWhatsapp className="text-white" />
              <span className="text-white font-bold ml-2">Contact Us </span>
            </a>
          </div>
        </div>
      ) : (
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
                    {isDragging
                      ? "Drop pdf file here"
                      : "Drag and drop pdf file here"}
                  </p>
                  <p className="text-gray-500 text-lg font-bold">
                    Click here to upload pdf file
                  </p>
                  <input
                    accept="application/pdf"
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
          <button
            disabled={disabledUpload}
            onClick={handleFileUpload}
            className={`w-full flex justify-center bg-indigo-500 text-white my-5 rounded-md py-3 font-bold ${
              disabledUpload ? "bg-opacity-60 text-opacity-60" : ""
            }`}
          >
            {isLoading && <Loader />}
            <span>{isLoading || "Start Upload"}</span>
          </button>
        </div>
      )}

      <div className="w-full h-0.5 bg-white my-12"></div>
      <ul className="space-y-5">
        {files.map((file) => (
          <UploadedFiles
            userId={user?.id}
            handleTrainFile={handleTrainFile}
            key={file.id}
            file={file}
          />
        ))}
      </ul>
    </div>
  );
}

export default UploadDropzone;
