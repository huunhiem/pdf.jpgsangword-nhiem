import React from 'react';
import { X, CheckCircle2, FileCheck, BookmarkCheck } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kỹ Thuật Trình Bày Văn Bản Hành Chính (Nghị định 30/2020/NĐ-CP)
              </h2>
              <p className="text-xs text-slate-500">
                Ban hành ngày 05/3/2020 của Chính phủ về công tác văn thư
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs leading-relaxed">
            <strong>Ghi chú:</strong> Hệ thống chuyển đổi này áp dụng thuật toán phân tích bố cục AI kết hợp thư viện định dạng tài liệu Microsoft Word (.docx) để đảm bảo toàn bộ tệp xuất ra chuẩn chỉnh 100% theo các quy định dưới đây.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Margins & Paper */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1. Khổ giấy &amp; Định lề trang A4</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Khổ giấy chuẩn: <strong>A4 (210 mm x 297 mm)</strong></li>
                <li>Lề trên (Top): <strong>20 - 25 mm</strong> (Mặc định: 20 mm)</li>
                <li>Lề dưới (Bottom): <strong>20 - 25 mm</strong> (Mặc định: 20 mm)</li>
                <li>Lề trái (Left): <strong>30 - 35 mm</strong> (Mặc định: 30 mm, để đóng gáy)</li>
                <li>Lề phải (Right): <strong>15 - 20 mm</strong> (Mặc định: 15 mm)</li>
              </ul>
            </div>

            {/* Font & Spacing */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Phông chữ &amp; Giãn dòng</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Phông chữ: <strong>Times New Roman</strong> Unicode (TCVN 6909:2001)</li>
                <li>Cỡ chữ nội dung: <strong>13pt hoặc 14pt</strong>, màu đen</li>
                <li>Giãn dòng (Line spacing): <strong>1.3 - 1.5 lines</strong></li>
                <li>Giãn đoạn (Paragraph spacing): <strong>6pt sau mỗi đoạn</strong></li>
                <li>Thụt đầu dòng: <strong>1.0 cm - 1.27 cm</strong> (First line indent)</li>
              </ul>
            </div>

            {/* National Motto & Agency */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3. Quốc hiệu, Tiêu ngữ &amp; Cơ quan</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Quốc hiệu: <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong> (In hoa, cỡ 12-13, đứng, đậm)</li>
                <li>Tiêu ngữ: <strong>Độc lập - Tự do - Hạnh phúc</strong> (Chữ in thường, 13-14, đứng, đậm, có đường kẻ liền bên dưới có độ dài bằng tiêu ngữ)</li>
                <li>Tên cơ quan: In hoa đứng (cấp trên) và in hoa đậm (cơ quan ban hành), có gạch ngắn bằng 1/3-1/2 độ dài dòng chữ</li>
              </ul>
            </div>

            {/* Signer & Recipients */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4. Chữ ký &amp; Nơi nhận</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Thẩm quyền ký: <strong>TM. ỦY BAN NHÂN DÂN, KT. CHỦ TỊCH...</strong> (In hoa, 13-14, đậm)</li>
                <li>Chức vụ: <strong>CHỦ TỊCH, GIÁM ĐỐC...</strong> (In hoa, 13-14, đậm)</li>
                <li>Họ và tên người ký: Cỡ 13-14, in thường hoặc hoa, đậm</li>
                <li>Nơi nhận: Góc dưới bên trái, <strong>"Nơi nhận:"</strong> cỡ 12 nghiêng đậm, các đơn vị nhận cỡ 11 in thường</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-red-600" />
              Bảng biểu và Danh mục số liệu
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo quy định, bảng số liệu trong văn bản hành chính phải có viền kẻ đơn liền mảnh, tiêu đề bảng đặt ở giữa, hàng tiêu đề in đậm nền xám nhẹ, các cột số liệu được căn phải/căn giữa để thuận tiện đối chiếu và tính toán. Ứng dụng này bảo lưu nguyên vẹn toàn bộ bảng biểu và các chỉ số từ tài liệu scan của bạn.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
