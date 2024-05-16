import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
interface File {
  _id: string;
  file_name: string;
  file_location: string;
  file_key: string;
}
const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User session ended.Login");
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
    <aside className="sidebar fixed top-20  bottom-12 left-8 h-auto w-96 bg-gray-100 overflow-y-auto">
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
              className="block px-4 py-4 m-8 h-28 flex  justify-between text-xs md:text-base rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800"
            >
              <p className="text-xs">{file.file_name}</p>
              <FaTrash
                className="ml-2 cursor-pointer text-red-500 text-1xl"
                onClick={(e) => handleDelete(e, file._id)}
              />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FileList;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaTrash, FaFolder } from "react-icons/fa";

// const FileList = () => {
//   const [folders, setFolders] = useState<string[]>([]);
//   const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
//   const [newFolderName, setNewFolderName] = useState<string>("");
//   const [creatingFolder, setCreatingFolder] = useState<boolean>(false);

//   const [files, setFiles] = useState<File[]>([]);

//   const handleCreateFolder = () => {
//     setCreatingFolder(true);
//   };

//   const handleSaveFolder = () => {
//     if (newFolderName.trim() !== "") {
//       setFolders([...folders, newFolderName]);
//       setNewFolderName("");
//       setCreatingFolder(false);
//     }
//   };

//   const handleFolderClick = async (folderName: string) => {
//     setSelectedFolder(folderName);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("User session ended. Login again");
//       }

//       const response = await axios.get(`http://localhost:3001/api/files`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setFiles(response.data.files);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };
//   const handleDeleteFolder = (index: number) => {
//     setFolders(folders.filter((_, idx) => idx !== index));
//   };
//   return (
//     <aside className="sidebar fixed top-20 bottom-12 left-8 h-auto w-96 bg-gray-100 overflow-y-auto">
//       <h2 className="mb-8 font-bold uppercase text-xl text-gray-700 fixed">
//         Your Files
//       </h2>
//       {creatingFolder ? (
//         <div className="flex items-center mb-4">
//           <input
//             type="text"
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             placeholder="Enter folder name"
//             className="mb-2 px-2 py-1 border rounded"
//           />
//           <button
//             onClick={handleSaveFolder}
//             className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Save
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={handleCreateFolder}
//           className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
//         >
//           Create New Folder
//         </button>
//       )}
//       <ul>
//         {folders.map((folderName, index) => (
//           <li key={index}>
//             <div
//               className="flex items-center justify-between px-4 py-4 m-8 h-28 bg-gray-300 rounded cursor-pointer"
//               onClick={() => handleFolderClick(folderName)}
//             >
//               <div className="flex items-center">
//                 <FaFolder
//                   className="mr-2 text-gray-500"
//                   onClick={() => handleFolderClick}
//                 />
//                 <p>{folderName}</p>
//               </div>
//               <FaTrash
//                 className="ml-2 cursor-pointer text-red-500 text-1xl"
//                 // Implement delete folder functionality if needed
//                 onClick={() => handleDeleteFolder(index)}
//               />
//             </div>
//           </li>
//         ))}
//       </ul>
//       {/* Display files of the selected folder */}
//       {selectedFolder && (
//         <div className="px-4 py-4 m-8 bg-gray-300 rounded">
//           <h3 className="font-semibold mb-2">Files in {selectedFolder}</h3>
//           {/* Implement displaying files of the selected folder here */}
//         </div>
//       )}
//     </aside>
//   );
// };

// export default FileList;
