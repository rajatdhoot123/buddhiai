import { useUser } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { useApp } from "../../context/AppContext";

const UploadedFiles = ({ file, userId }) => {
  return (
    <li
      className="text-white border border-white border-opacity-60 rounded-md p-2"
      key={file.agent_name}
    >
      <div className="truncate font-bold text-center">{file.agent_name}</div>
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
                  window.btoa(
                    JSON.stringify({ filename: file.agent_name, userId })
                  )
                }" \nsrc="https://www.buddhiai.app/buddi_widget/min-buddhi.js" async>\n</script>`}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </li>
  );
};

const Agents = () => {
  const user = useUser();
  const { files = [] } = useApp();

  return (
    <div className="p-5">
      <div className="text-3xl text-center font-semibold text-white my-5">
        Available Agents
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {files.map((file) => (
          <UploadedFiles userId={user?.id} key={file.agent_name} file={file} />
        ))}
      </ul>
    </div>
  );
};

export default Agents;
