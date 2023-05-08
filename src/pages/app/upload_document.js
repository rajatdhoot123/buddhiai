import { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { FaRegFilePdf, FaWhatsapp } from "react-icons/fa";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { WHATSAPP_SUPPORT_NUMBER } from "../../constant";
import { trainDocs } from "../../axios";
import { useApp } from "../../context/AppContext";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import FormDemo from "../../components/Form";
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

  return (
    <div className="m-12">
      <FormDemo />
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
