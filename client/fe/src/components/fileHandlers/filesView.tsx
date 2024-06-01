import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

interface File {
  _id: string;
  file_name: string;
  file_location: string;
  thumbnail_location: string; // Add thumbnail_location to the File interface
}

const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);

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

  return (
    <div className="flex flex-wrap justify-start">
      {files.map((file) => (
        <div
          key={file._id}
          className="bg-gray-200 rounded-md p-1 flex flex-col items-center mr-2 mb-2"
          style={{ width: "calc(20% - 0.5rem)", height: "auto" }} // Adjust width and height
        >
          <div className="bg-white rounded-md p-1 mb-1 w-full">
            <p className="text-xs truncate w-full text-center bg-gray-300 p-1 rounded-md">
              {file.file_name}
            </p>
            <img
              src={file.thumbnail_location}
              alt={file.file_name}
              className="w-full h-auto object-cover rounded-md mt-1"
            />

            <FaTrash
              className="cursor-pointer text-red-500 text-xs mt-1 m-auto"
              onClick={(e) => handleDelete(e, file._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
