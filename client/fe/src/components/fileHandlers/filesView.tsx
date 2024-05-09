import React, { useState, useEffect } from "react";
import axios from "axios";

interface File {
  _id: string;
  file_name: string;
  file_location: string;
}

const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
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

  return (
    <aside className="sidebar fixed top-20  bottom-12 left-8 h- w-96 bg-gray-100 overflow-y-auto">
      <h2 className="mb-8 font-bold uppercase text-xl text-gray-700 fixed">
        Your Files
      </h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a
              href={file.file_location}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-4 m-8 h-28 text-xs md:text-base rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800"
            >
              {file.file_name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FileList;
