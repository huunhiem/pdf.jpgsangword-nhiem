/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { SamplePicker } from './components/SamplePicker';
import { OptionsPanel } from './components/OptionsPanel';
import { A4DocumentPreview } from './components/A4DocumentPreview';
import { ComplianceReport } from './components/ComplianceReport';
import { ComplianceModal } from './components/ComplianceModal';
import { SAMPLE_DOCUMENTS, SampleDocItem } from './data/sampleDocuments';
import { Decree30Document, ConvertOptions } from './types';
import { downloadDecree30Docx } from './utils/docxGenerator';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Columns,
  Eye,
  Download,
  RotateCcw,
} from 'lucide-react';

interface UploadedFileInfo {
  name: string;
  size: number;
  mimeType: string;
  base64: string;
  previewUrl?: string;
}

export default function App() {
  const [currentFile, setCurrentFile] = useState<UploadedFileInfo | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('decision-01');
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  
  // Options for Decree 30 formatting
  const [options, setOptions] = useState<ConvertOptions>({
    fontSize: 13,
    lineSpacing: 1.3,
    marginPreset: 'standard',
    firstLineIndent: 1.0,
    preserveOriginalLayout: true,
    strictDecree30: true,
  });

  // Current active document (defaults to sample 1 so user sees immediate value)
  const [activeDocument, setActiveDocument] = useState<Decree30Document>(
    SAMPLE_DOCUMENTS[0].document
  );

  // Conversion process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'compare' | 'compliance'>('preview');

  // Handle sample document selection
  const handleSelectSample = (sample: SampleDocItem) => {
    setSelectedSampleId(sample.id);
    setActiveDocument(sample.document);
    setCurrentFile(null);
    setErrorMessage(null);
  };

  // Handle user uploaded file selection
  const handleFileSelected = (file: UploadedFileInfo) => {
    setCurrentFile(file);
    setSelectedSampleId('');
    setErrorMessage(null);
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    setSelectedSampleId('decision-01');
    setActiveDocument(SAMPLE_DOCUMENTS[0].document);
    setErrorMessage(null);
  };

  // Trigger conversion via server-side Gemini API
  const handleConvert = async () => {
    if (!currentFile) {
      // If no file uploaded, user is testing with sample
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStep('Đang gửi tệp đến hệ thống phân tích...');

    try {
      // Step 1: Uploading
      setTimeout(() => {
        setProcessingStep('AI Gemini đang phân tích thị giác và trích xuất nội dung văn bản...');
      }, 1200);

      // Step 2: Processing
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64: currentFile.base64,
          mimeType: currentFile.mimeType,
          fileName: currentFile.name,
          options,
        }),
      });

      setProcessingStep('Đang cấu trúc hóa và chuẩn hóa theo Nghị định 30/2020/NĐ-CP...');

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Quá trình chuyển đổi thất bại. Vui lòng thử lại.');
      }

      setProcessingStep('Hoàn tất định dạng văn bản hành chính!');
      setActiveDocument(data.document);
      setActiveTab('preview');
    } catch (error: any) {
      console.error('Conversion error:', error);
      setErrorMessage(
        error?.message || 'Không thể xử lý tệp tin. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại với tệp khác.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <Header onOpenComplianceInfo={() => setIsComplianceModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner Announcement */}
        <div className="rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-rose-700 p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs">
                Tiêu chuẩn quốc gia
              </span>
              <span className="text-red-100 text-xs font-medium">Nghị định số 30/2020/NĐ-CP</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Chuyển Đổi Tài Liệu PDF &amp; Ảnh Scan Sang File Word (.docx)
            </h2>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              Bảo toàn cấu trúc bảng biểu, điều khoản, số ký hiệu và trích yếu; tự động chuẩn hóa định lề trang A4 (20-20-30-15mm), phông chữ Times New Roman và bố cục chữ ký, nơi nhận chuẩn văn thư.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsComplianceModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-red-700 hover:bg-red-50 shadow-xs transition-colors"
            >
              Xem Chi Tiết Quy Chuẩn
            </button>
          </div>
        </div>

        {/* Section 1: Upload & Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upload and Samples (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Tải Lên File PDF Hoặc Ảnh Scan
                  </h3>
                </div>
                {currentFile && (
                  <span className="text-xs text-slate-500 font-medium">
                    1 tệp được chọn
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <FileUploader
                onFileSelected={handleFileSelected}
                currentFile={currentFile}
                onClearFile={handleClearFile}
                isProcessing={isProcessing}
              />

              {/* Sample Documents Picker */}
              <SamplePicker
                onSelectSample={handleSelectSample}
                selectedId={selectedSampleId}
                disabled={isProcessing}
              />

              {/* Convert Action Button if file is uploaded */}
              {currentFile && (
                <div className="pt-2">
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{processingStep || 'Đang xử lý tài liệu...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Bắt Đầu Chuyển Đổi Sang Word Chuẩn NĐ 30</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Lỗi xử lý tài liệu</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Decree 30 Options & Standards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <OptionsPanel
              options={options}
              onChangeOptions={setOptions}
              disabled={isProcessing}
            />

            {/* Quick Summary Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-red-600" />
                Thể Thức Bắt Buộc Khi Xuất File Word
              </h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Khổ A4 tiêu chuẩn:</strong> Lề trên 20mm, dưới 20mm, trái 30mm, phải 15mm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Phông Times New Roman:</strong> Cỡ chữ 13-14pt, giãn dòng 1.3 - 1.5, giãn đoạn 6pt sau.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bố cục 2 cột tiêu ngữ &amp; chữ ký:</strong> Khung căn chỉnh không viền, tự động căn giữa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Giữ nguyên bảng biểu:</strong> Hàng tiêu đề in đậm, đường viền đơn mảnh, căn lề số liệu chuẩn xác.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Results & Document Interactive View */}
        <div className="space-y-4 pt-2">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Văn Bản Word Chuẩn NĐ 30 (Trang A4)</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'compare'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>So Sánh Với File Gốc</span>
              </button>

              <button
                onClick={() => setActiveTab('compliance')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'compliance'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kiểm Tra Thể Thức NĐ 30</span>
              </button>
            </div>

            {/* Quick Export Trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadDecree30Docx(activeDocument, options, currentFile?.name)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất File Word (.DOCX)</span>
              </button>
            </div>
          </div>

          {/* Tab 1: A4 Document Preview */}
          {activeTab === 'preview' && (
            <A4DocumentPreview
              document={activeDocument}
              options={options}
              onUpdateDocument={setActiveDocument}
              originalFileName={currentFile?.name}
            />
          )}

          {/* Tab 2: Comparison Side-by-Side View */}
          {activeTab === 'compare' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Original Uploaded Image or PDF Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Tài Liệu Gốc Đã Tải Lên
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {currentFile ? currentFile.name : 'Văn bản mẫu tham khảo'}
                  </span>
                </div>

                <div className="flex-1 min-h-[500px] bg-slate-100 rounded-xl flex items-center justify-center p-4 overflow-auto border border-slate-200">
                  {currentFile?.previewUrl ? (
                    <img
                      src={currentFile.previewUrl}
                      alt="Original Document Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-[750px] w-auto object-contain rounded shadow-sm border border-slate-300"
                    />
                  ) : currentFile?.mimeType.includes('pdf') ? (
                    <div className="text-center p-8 space-y-3 max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-2xs">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-800">{currentFile.name}</p>
                        <p className="text-xs text-slate-500">
                          Tệp PDF đã được gửi đến AI Gemini để bóc tách từng trang, giữ nguyên cấu trúc bảng và thể thức hành chính.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-2 text-slate-500 max-w-sm">
                      <FileText className="w-10 h-10 mx-auto text-slate-400" />
                      <p className="text-xs font-medium text-slate-700">Đang hiển thị dữ liệu mẫu</p>
                      <p className="text-[11px]">
                        Tải file PDF hoặc Ảnh scan của bạn lên để xem đối chiếu song song trực quan tại đây.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Converted A4 Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Văn Bản Đã Chuẩn Hóa Theo Nghị Định 30
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã sẵn sàng xuất Word
                  </span>
                </div>
                <A4DocumentPreview
                  document={activeDocument}
                  options={options}
                  onUpdateDocument={setActiveDocument}
                  originalFileName={currentFile?.name}
                />
              </div>
            </div>
          )}

          {/* Tab 3: Compliance Report */}
          {activeTab === 'compliance' && (
            <ComplianceReport document={activeDocument} />
          )}
        </div>
      </main>

      {/* Decree 30 Regulations Modal */}
      <ComplianceModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hệ thống chuyển đổi tài liệu PDF &amp; Ảnh scan sang Word chuẩn Nghị định 30/2020/NĐ-CP của Chính phủ.
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Font: Times New Roman • Page: A4 • Margins: 20-20-30-15mm
          </span>
        </div>
      </footer>
    </div>
  );
}
