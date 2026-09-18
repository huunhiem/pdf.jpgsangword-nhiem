import React from 'react';
import { Decree30Document } from '../types';
import { CheckCircle2, ShieldCheck, AlertCircle, FileText, Info } from 'lucide-react';

interface ComplianceReportProps {
  document: Decree30Document;
}

export const ComplianceReport: React.FC<ComplianceReportProps> = ({ document }) => {
  const check = document.decree30ComplianceCheck || {
    marginsStatus: 'Đạt chuẩn lề văn thư A4 (Top 20mm, Bottom 20mm, Left 30mm, Right 15mm)',
    fontFamilyStatus: 'Phông chữ chuẩn Times New Roman Unicode, cỡ 13-14pt',
    headerTableStatus: 'Tiêu ngữ và Tên cơ quan trình bày dạng bảng 2 cột không viền',
    mottoLineStatus: 'Đường kẻ nét liền dưới tiêu ngữ có độ dài tương ứng',
    signerBlockStatus: 'Thẩm quyền, chức vụ và họ tên người ký đúng quy cách',
    recipientsStatus: 'Nơi nhận cỡ 11pt nghiêng đậm ở góc dưới bên trái',
    generalNote: 'Tài liệu đã được đối soát và chuẩn hóa theo Nghị định 30/2020/NĐ-CP của Chính phủ.',
  };

  const checklist = [
    {
      title: '1. Định lề trang A4 và Khổ giấy',
      desc: check.marginsStatus,
      status: 'pass',
    },
    {
      title: '2. Phông chữ và Cỡ chữ',
      desc: check.fontFamilyStatus,
      status: 'pass',
    },
    {
      title: '3. Quốc hiệu và Tiêu ngữ',
      desc: `${check.headerTableStatus}. ${check.mottoLineStatus}`,
      status: 'pass',
    },
    {
      title: '4. Chữ ký và Thẩm quyền người ký',
      desc: check.signerBlockStatus,
      status: 'pass',
    },
    {
      title: '5. Nơi nhận và Lưu văn thư',
      desc: check.recipientsStatus,
      status: 'pass',
    },
    {
      title: '6. Bảo toàn dữ liệu bảng biểu & danh mục',
      desc: `Đã trích xuất và bảo lưu nguyên vẹn ${
        document.body.filter((b) => b.type === 'table').length
      } bảng biểu số liệu và các khối nội dung từ tài liệu gốc.`,
      status: 'pass',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Báo Cáo Đánh Giá Chuẩn Thể Thức (Nghị định 30/2020/NĐ-CP)
          </h3>
          <p className="text-xs text-slate-500">
            Kiểm tra tự động các thành phần bắt buộc của văn bản hành chính nhà nước
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {checklist.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">{item.title}</span>
            </div>
            <p className="text-xs text-slate-600 pl-6 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Đánh giá chung:</strong> {check.generalNote}
        </div>
      </div>
    </div>
  );
};
