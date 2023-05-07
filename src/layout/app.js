import ThreeDotMenu from "@/components/ThreeDotMenu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { FaEllipsisH, FaSignOutAlt } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import useMediaQuery from "../hooks/useMediaQuery";
const LEFT_ICONS = [
  { label: "AI Agent", link: "/app" },
  { label: "Upload and Train", link: "/app/upload_document" },
];

const App = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width: 760px)");
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/app");
  const supabaseClient = useSupabaseClient();
  const { activeFile, docsLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(true);
    }
  }, [isDesktop]);

  useEffect(() => {
    setActiveRoute(router.pathname);
  }, [router.pathname, setActiveRoute]);

  return (
    <div className="grid bg-[#343541] h-screen">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed p-5 text-white md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className={`z-10 w-full md:w-48 bg-[#202123] top-0 fixed left-0 h-full  transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full relative">
          <button
            className="absolute right-0 p-5 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <strong className="text-[28px] text-white align-center cursor-pointer alert-del">
              &times;
            </strong>
          </button>
          <div>
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
          </div>
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
      <div className="md:ml-48 overflow-y-scroll pt-12 md:pt-5">
        {docsLoading ? (
          <div className="h-full flex justify-center items-center">
            <Loader />
            <div className="text-white">Loading...</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default App;
