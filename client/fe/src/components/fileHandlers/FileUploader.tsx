import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import FileList from "./filesView";

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token from local storage
      if (!token) {
        throw new Error("No token found");
      }

      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Fetch presigned URL from backend
      const presignedUrlResponse = await axios.post(
        "http://localhost:3001/api/get-presigned-url",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for handling file uploads
          },
        }
      );

      // Upload file directly to S3 using presigned URL
      await axios.put(presignedUrlResponse.data.url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      // Reset selected file after upload
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 gap-10 w-screen bg-gray-200">
      <div className="flex">
        <div className="hidden md:block w-1/5 pr-2">
          {/* Sidebar */}
          <div className="bg-gray-300 h-full rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Upload File</h2>
            <div className="flex items-center mb-2">
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="mr-2"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-4/5">
          {/* Content */}
          Files
          <FileList />
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
