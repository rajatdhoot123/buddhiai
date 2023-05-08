import { FaWhatsapp } from "react-icons/fa";
import { useUser } from "@supabase/auth-helpers-react";
import { WHATSAPP_SUPPORT_NUMBER } from "../../constant";
import { useApp } from "../../context/AppContext";
import UploadForm from "../../components/Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

const UploadedFiles = ({ file, userId }) => {
  return (
    <li
      className="text-white border border-white border-opacity-60 rounded-md p-2"
      key={file.name}
    >
      <div className="truncate font-bold text-center">{file.name}</div>
      <Dialog>
        <DialogTrigger className="bg-indigo-400 text-white text-sm font-bold px-2 rounded-md flex items-center w-full p-1 mt-2 text-center justify-center">
          Embed
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add the following script to your website</DialogTitle>
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
    </li>
  );
};

function UploadDropzone() {
  const { files = [], addNewUploadedFile } = useApp();

  const user = useUser();

  return (
    <div className="m-12 grid grid-cols-1 place-content-center">
      {files.length >= 5 &&
      user?.id !== "c803c897-c9d7-463d-93ef-56f525f3ee9c" ? (
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
        <UploadForm addNewUploadedFile={addNewUploadedFile} />
      )}
      <div className="p-5">
        <div className="text-3xl text-center font-semibold text-white my-5">
          Available Agents
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {files.map((file) => (
            <UploadedFiles userId={user?.id} key={file.name} file={file} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UploadDropzone;
