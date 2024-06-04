import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Modal from "./Modal";

interface File {
  _id: string;
  file_name: string;
  file_location: string;
  thumbnail_location: string; // Add thumbnail_location to the File interface
}

const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const filesPerRow = 5; // Define the number of files to display per row

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User session ended. Please login.");
        }

        const response = await axios.get("http://localhost:3001/api/files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.delete(`http://localhost:3001/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the file from the UI
      setFiles(files.filter((file) => file._id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleFileClick = (e: React.MouseEvent, file: File) => {
    e.preventDefault();
    setSelectedFile(file);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-start">
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-gray-200 rounded-md p-1 flex flex-col items-center mr-2 mb-4"
            style={{
              width: `calc(${100 / filesPerRow}% - 0.5rem)`,
            }}
          >
            <a
              href="#"
              onClick={(e) => handleFileClick(e, file)}
              className="w-full"
            >
              <div className="bg-white rounded-md p-1 mb-1 w-full flex flex-col justify-between">
                <p className="text-xs truncate w-full text-center bg-gray-300 p-1 rounded-md">
                  {file.file_name}
                </p>
                <div className="relative flex-grow overflow-hidden">
                  {file.thumbnail_location ? (
                    <img
                      src={file.thumbnail_location}
                      alt={file.file_name}
                      className="w-full h-48 object-cover rounded-md"
                      style={{ objectPosition: "top" }}
                    />
                  ) : (
                    <div className="w-full h-auto bg-gray-300 rounded-md" />
                  )}
                  <button
                    className="absolute bottom-0 left-0 right-0 bg-gray-500 text-white rounded-full p-1 mb-1 mx-auto flex items-center justify-center"
                    onClick={(e) => handleDelete(e, file._id)}
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {selectedFile && (
        <Modal
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          fileUrl={selectedFile.file_location}
          fileName={selectedFile.file_name}
        />
      )}
    </div>
  );
};

export default FileList;
