"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";

function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("accepted files: ", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      <input {...getRootProps()} />
      <div className="flex flex-col items-center justify-center">
        {isDragActive ? (
          <>
            <RocketIcon className="w-20 h-20 animate-ping" />
            <p>Drop the files here...</p>
          </>
        ) : (
          <>
            <CircleArrowDown className="w-20 h-20 animate-bounce" />
            <p>Drag n Drop some file here, or click to select file</p>
          </>
        )}
      </div>
    </div>
  );
}

export default FileUploader;