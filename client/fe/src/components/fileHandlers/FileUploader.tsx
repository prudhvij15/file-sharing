import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import FileList from "./filesView";
import FilePreview from "./previewfile";

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    Link: string;
    type: string;
    signed_url: string;
  } | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFileDetails(null);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewData(reader.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
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

      // Update file details
      setFileDetails({
        name: selectedFile.name,
        Link: presignedUrlResponse.data.fileUrl,
        type: selectedFile.type,
        signed_url: presignedUrlResponse.data.url,
      });
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 gap-10 w-screen bg-gray-200">
      <div className="flex">
        <div className="w-1/3 pr-2">
          <FileList />
        </div>

        {/* File upload */}
        <div className="w-1/3 pr-2">
          <h2 className="text-xl font-semibold mb-2">Upload File</h2>
          <div className="flex items-center mb-4">
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="mr-2"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {fileDetails && (
            <div>
              <h2 className="text-xl font-semibold mb-2">File Details</h2>
              <p>Name: {fileDetails.name}</p>
              <a href={fileDetails.Link} className="hover:text-gray-300">
                <p>File Link: {fileDetails.Link}</p>
              </a>
              <p>Type: {fileDetails.type}</p>
            </div>
          )}
        </div>
        {/* Preview */}
        {selectedFile && (
          <FilePreview previewData={previewData} selectedFile={selectedFile} />
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
