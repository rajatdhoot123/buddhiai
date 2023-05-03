import ThreeDotMenu from "@/components/ThreeDotMenu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { FaEllipsisH, FaSignOutAlt } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LEFT_ICONS = [
  { label: "AI Agent", link: "/app" },
  { label: "Upload and Train", link: "/app/upload_document" },
];

const App = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState("/app");
  const supabaseClient = useSupabaseClient();
  const { activeFile } = useApp();
  const router = useRouter();

  useEffect(() => {
    setActiveRoute(router.pathname);
  }, [router.pathname, setActiveRoute]);

  return (
    <div className="grid grid-cols-12 chat-bg h-screen">
      <div className="col-span-2 h-full bg-[#202123]">
        <div className="flex flex-col justify-between h-full">
          <ul className="space-y-4 m-5">
            {LEFT_ICONS.map(({ label, link }) => (
              <li
                className={`${
                  activeRoute === link ? "" : "text-opacity-60"
                } text-white border-opacity-40`}
                key={label}
              >
                <Link href={link}>{label}</Link>
              </li>
            ))}
          </ul>
          <div>
            <div className="h-0.5 bg-white bg-opacity-25 mb-5" />
            <ul className="space-y-4 m-5">
              <li>
                <ThreeDotMenu>
                  <div className="flex items-center">
                    <HiOutlineDocumentDuplicate />
                    <div className="ml-2 truncate">
                      {activeFile?.name ?? "Select Doc"}
                    </div>
                  </div>
                </ThreeDotMenu>
              </li>
              <li className="text-white flex items-center">
                <FaSignOutAlt className="text-white" />
                <button
                  className="ml-2"
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          {/* <ThreeDotMenu>
            <div className="flex items-center justify-between">
              <div className="w-3/4 truncate">{user?.email}</div>
              <FaEllipsisH className="w-1/4" />
            </div>
          </ThreeDotMenu> */}
        </div>
      </div>
      <div className="col-span-10 overflow-y-scroll">{children}</div>
    </div>
  );
};

export default App;
