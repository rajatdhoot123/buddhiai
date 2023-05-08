import { useRef, useState } from "react";
import useClickOutside from "../hooks/clickOutside";
import { useRouter } from "next/router";
import { useApp } from "../context/AppContext";
import { FcCheckmark } from "react-icons/fc";

function ThreeDotMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });
  const { files = [], handleActiveFile, activeFile } = useApp();

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
          className="absolute bottom-10 right-0 z-10 mt-2 rounded-md border border-gray-100 bg-white shadow-lg px-2 w-44"
          role="menu"
        >
          <div className="p-2 space-y-2">
            <small className="font-semibold">Select File</small>
            {!files.length ? (
              <div>No files</div>
            ) : (
              files.map((file) => (
                <button
                  key={file.name}
                  className="text-sm font-medium flex items-center py-2 space-x-2 w-40"
                  onClick={() => {
                    handleActiveFile(file.name);
                    setIsOpen(false);
                  }}
                >
                  {activeFile?.name === file.name && <FcCheckmark />}
                  <span className="truncate">{file.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreeDotMenu;
