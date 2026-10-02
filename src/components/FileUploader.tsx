import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { MAX_FILE_SIZE, formatBytes } from '../utils/fileValidation';

interface FileUploaderProps {
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input value so same file can be re-uploaded if desired
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 shadow-lg shadow-indigo-100 scale-[1.008]'
            : 'border-slate-300/80 bg-white hover:border-indigo-400 hover:bg-slate-50/50 hover:shadow-sm'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
          accept=".docx,.doc,.txt,.rtf,.odt,.xlsx,.xls,.csv,.ods,.pptx,.ppt,.odp,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif,.gif,.svg,.html,.htm,.md,.markdown,.xml,.json"
        />

        {/* Central Icon */}
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition ${
            isDragging
              ? 'bg-indigo-600 text-white scale-110'
              : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="h-8 w-8" />
        </div>

        {/* Action Title */}
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
          Drop your files here
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md">
          or{' '}
          <span className="font-semibold text-indigo-600 hover:underline">
            browse from your computer
          </span>
          . Select single or multiple documents.
        </p>

        {/* Badges / Supported categories */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <FileText className="h-3 w-3 text-indigo-500" />
            DOCX · DOC · TXT · RTF · ODT
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <Zap className="h-3 w-3 text-emerald-500" />
            XLSX · XLS · CSV · ODS
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <CheckCircle2 className="h-3 w-3 text-amber-500" />
            PPTX · PPT · ODP
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            JPG · PNG · WEBP · TIFF · BMP
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            Markdown · HTML · JSON · XML
          </span>
        </div>

        {/* Security & Size note */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            100% Private (Processed in your browser)
          </span>
          <span aria-hidden="true">·</span>
          <span>Max file size: {formatBytes(MAX_FILE_SIZE)}</span>
        </div>
      </div>
    </div>
  );
};
