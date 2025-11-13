
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface FileUploaderProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File) => void;
  onFileRemove: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ id, label, file, onFileChange, onFileRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileChange(event.dataTransfer.files[0]);
      if (inputRef.current) {
        inputRef.current.files = event.dataTransfer.files;
      }
    }
  };

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onFileRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  if (file) {
    return (
      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <DocumentTextIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate" title={file.name}>
            {file.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRemoveClick}
          className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Remove file"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
       <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <UploadIcon className="w-8 h-8 mb-2 text-slate-400 dark:text-slate-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">PDF file only</p>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
    </div>
  );
};

export default FileUploader;
