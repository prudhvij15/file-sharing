import React from "react";

interface FilePreviewProps {
  previewData: string | null;
  selectedFile: File | null;
}

const FilePreview = ({ previewData, selectedFile }: FilePreviewProps) => {
  return (
    <div className="w-4/6 pl-2">
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
      <div className="flex justify-center w-full h-[80vh]">
        {selectedFile && selectedFile.type.startsWith("image/") ? (
          <img src={previewData as string} alt="Preview" className="w-auto" />
        ) : (
          <iframe
            src={previewData as string}
            className="w-full border"
            title="Preview"
          />
        )}
      </div>
    </div>
  );
};

export default FilePreview;
