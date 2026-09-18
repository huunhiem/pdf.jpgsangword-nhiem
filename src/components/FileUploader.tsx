import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface FileUploaderProps {
  onFileSelected: (file: { name: string; size: number; mimeType: string; base64: string; previewUrl?: string }) => void;
  currentFile: { name: string; size: number; mimeType: string; previewUrl?: string } | null;
  onClearFile: () => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  currentFile,
  onClearFile,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setErrorMessage(null);

    // Validate mime type
    const validMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/bmp'];
    const isPdfOrImage = validMimes.includes(file.type) || file.name.endsWith('.pdf');

    if (!isPdfOrImage) {
      setErrorMessage('Định dạng tệp không được hỗ trợ. Vui lòng tải file PDF hoặc file ảnh (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 35 * 1024 * 1024) {
      setErrorMessage('Kích thước tệp quá lớn (tối đa 35MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const previewUrl = file.type.startsWith('image/') ? base64 : undefined;

      onFileSelected({
        name: file.name,
        size: file.size,
        mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        base64,
        previewUrl,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Có lỗi xảy ra khi đọc tệp tin. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-red-500 bg-red-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-red-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-red-600">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1 max-w-md">
            <p className="text-sm font-semibold text-slate-800">
              Kéo và thả tệp <span className="text-red-600">PDF</span> hoặc <span className="text-red-600">Ảnh scan</span> vào đây
            </p>
            <p className="text-xs text-slate-500">
              Hỗ trợ tệp tài liệu PDF nhiều trang, ảnh công văn, quyết định chụp hoặc scan (PNG, JPG, WEBP) tối đa 35MB
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all pointer-events-none"
          >
            Chọn Tệp Từ Máy Tính
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
              {currentFile.mimeType.includes('pdf') ? (
                <FileText className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate" title={currentFile.name}>
                {currentFile.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-medium text-slate-600">
                  {formatFileSize(currentFile.size)}
                </span>
                <span>•</span>
                <span className="uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                  {currentFile.mimeType.includes('pdf') ? 'PDF' : 'ẢNH SCAN'}
                </span>
                <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã sẵn sàng
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đổi file</span>
            </button>
            <button
              onClick={onClearFile}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
