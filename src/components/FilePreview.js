import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { CSV, EXCEL_FORMAT, TEXT_FILE } from "../constant";

const FilesPreview = ({ files, onFileRemove }) => {
  const handleRemoveFile = (index) => {
    onFileRemove(index);
  };
  return (
    <div className="flex space-x-2 flex-wrap">
      {files.map((file, index) => {
        return (
          <div key={file.name}>
            <div className="relative inline-block">
              <a
                className="m-auto"
                href={URL.createObjectURL(file)}
                target="_blank"
              >
                {(() => {
                  switch (file.type) {
                    case "application/pdf":
                      return (
                        <>
                          <FaRegFilePdf className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.name}
                          </div>
                        </>
                      );
                    case TEXT_FILE:
                      return (
                        <>
                          <HiOutlineDocumentText className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.name}
                          </div>
                        </>
                      );
                    case EXCEL_FORMAT:
                    case CSV:
                      return (
                        <>
                          <FaRegFileExcel className="w-12 h-12 inline-block" />
                          <div className="text-xs my-1 truncate w-12">
                            {file.name}
                          </div>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
              </a>
              <button
                type="button"
                className="rounded-full absolute top-0 right-0 h-4 w-4 flex justify-center items-center bg-gray-300 p-1 text-gray-700 hover:bg-gray-400 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(index);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilesPreview;
