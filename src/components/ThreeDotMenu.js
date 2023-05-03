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
          <div className="p-2 space-y-2">
            <small className="font-semibold">Select File</small>
            {!availableFiles.length ? (
              <div>No files</div>
            ) : (
              availableFiles.map((file) => (
                <button
                  key={file.id}
                  className="text-sm font-medium flex items-center py-2 space-x-2"
                  onClick={() => {
                    handleActiveFile(file.id);
                    setIsOpen(false);
                  }}
                >
                  {activeFile?.id === file.id && <FcCheckmark />}
                  <span>{file.name}</span>
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
