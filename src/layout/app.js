import ThreeDotMenu from "@/components/ThreeDotMenu";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { FaEllipsisH } from "react-icons/fa";

const LEFT_ICONS = [
  { label: "Dashboard", link: "/app" },
  { label: "Documents", link: "/app/upload_document" },
];

const App = ({ children }) => {
  const user = useUser();

  return (
    <div className="grid grid-cols-12 chat-bg h-screen">
      <div className="col-span-2 p-5 h-full bg-[#202123]">
        <div className="flex flex-col justify-between h-full">
          <ul className="space-y-5">
            {LEFT_ICONS.map(({ label, link }) => (
              <li className="text-white" key={label}>
                <Link href={link}>{label}</Link>
              </li>
            ))}
          </ul>
          <ThreeDotMenu>
            <div className="flex items-center justify-between">
              <div className="w-3/4 truncate">{user?.email}</div>
              <FaEllipsisH className="w-1/4" />
            </div>
          </ThreeDotMenu>
        </div>
      </div>
      <div className="col-span-10 overflow-y-scroll">{children}</div>
    </div>
  );
};

export default App;
