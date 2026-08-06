"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

type FileUploadProps = {
  onFilesChange?: (files: File[]) => void;
};

export default function FileUpload({ onFilesChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setFiles((previousFiles) => {
      const nextFiles = [...previousFiles, ...Array.from(selectedFiles)];
      onFilesChange?.(nextFiles);
      return nextFiles;
    });
  };

  const removeFile = (file: File) => {
    setFiles((previousFiles) => {
      const nextFiles = previousFiles.filter((item) => item !== file);
      onFilesChange?.(nextFiles);
      return nextFiles;
    });
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="
          cursor-pointer
          border-2
          border-dashed
          rounded-xl
          p-10
          text-center
          bg-muted
          hover:bg-muted/50
          transition
        "
      >
        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-4" />

        <p className="text-sm">
          <span className="font-semibold text-teal-700">
            Cliquez pour téléverser
          </span>{" "}
          ou glissez-déposez vos fichiers ici
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG ou PDF (Max. 10MB)
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>


      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex flex-6 items-center justify-between bg-error-container text-on-surface rounded-lg px-3 py-2"
            >
              <span className="text-sm truncate">
                {file.name}
              </span>

              <button type="button" onClick={() => removeFile(file)}>
                <X className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
