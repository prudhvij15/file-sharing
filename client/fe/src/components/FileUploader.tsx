import React, { useState, ChangeEvent } from "react";
import axios from "axios";
const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    Link: string;
    type: string;
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
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setFileDetails({
        name: response.data.file_info.file_name,
        Link: response.data.file_info.file_location,
        type: response.data.file_info.file_mimetype,
      });
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 gap-10 lg:w-3/4 xl:w-2/3">
      {/* Content */}
      <div className="flex">
        <div className="w-1/2 pr-2">
          <h2 className="text-xl font-semibold mb-2">Upload File</h2>
          <div className="flex items-center mb-4">
            <input type="file" onChange={handleFileChange} className="mr-2" />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div className="w-1/2 pr-2 -left-1/3">
            {fileDetails && (
              <div>
                <h2 className="text-xl font-semibold mb-2">File Details</h2>
                <p>Name: {fileDetails.name}</p>
                <a href={fileDetails.Link} className="hover:text-gray-300">
                  <p>Size: {fileDetails.Link} bytes</p>
                </a>
                <p>Type: {fileDetails.type}</p>
              </div>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="w-screen pl-2  h-auto bg-gray-300">
            <h2 className="text-xl font-semibold mb-2 text-black-100">
              Preview
            </h2>
            {previewData && (
              <div className="flex justify-center w-full h-[80vh]">
                {selectedFile && selectedFile.type.startsWith("image/") ? (
                  <img src={previewData} alt="Preview" className="w-auto" />
                ) : (
                  <iframe
                    src={previewData}
                    className="w-full border"
                    title="Preview"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
