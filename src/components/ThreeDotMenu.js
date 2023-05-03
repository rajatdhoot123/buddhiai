import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRef, useState } from "react";
import useClickOutside from "../hooks/clickOutside";
import { useRouter } from "next/router";
import { useApp } from "../context/AppContext";

function ThreeDotMenu({ children }) {
  const supabaseClient = useSupabaseClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();
  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });
  const { files = [], handleActiveFile } = useApp();

  const availableFiles = files.filter((file) => file.is_available);
  return (
    <div ref={dropdownRef} className="relative">
      <div className="inline-flex items-center overflow-hidden rounded-md w-full">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-white w-full"
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div
          className="w-full absolute bottom-10 right-0 z-10 mt-2 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className="p-2">
            <small className="font-semibold">Active File</small>
            {!availableFiles.length ? (
              <div>No files</div>
            ) : (
              availableFiles.map((file) => (
                <button
                  key={file.id}
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full"
                  onClick={() => handleActiveFile(file.id)}
                >
                  {file.name}
                </button>
              ))
            )}
            <div className="w-full h-0.5 bg-slate-400" />
            <button
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full"
              onClick={async () => {
                await supabaseClient.auth.signOut();
                router.push("/");
              }}
            >
              Signout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreeDotMenu;
