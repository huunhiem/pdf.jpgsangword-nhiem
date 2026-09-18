import React from 'react';
import { FileText, ShieldCheck, Download, Award } from 'lucide-react';

interface HeaderProps {
  onOpenComplianceInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenComplianceInfo }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-sm ring-4 ring-red-50">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Chuyển Đổi PDF &amp; Ảnh Sang Word
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Chuẩn NĐ 30/2020/NĐ-CP
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Giữ nguyên cấu trúc gốc • Tự động chuẩn hóa thể thức hành chính • Xuất tệp Microsoft Word (.docx)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenComplianceInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Quy chuẩn Thể thức NĐ 30</span>
          </button>
        </div>
      </div>
    </header>
  );
};
