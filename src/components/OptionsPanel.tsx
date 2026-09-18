import React from 'react';
import { ConvertOptions } from '../types';
import { Sliders, Check, HelpCircle } from 'lucide-react';

interface OptionsPanelProps {
  options: ConvertOptions;
  onChangeOptions: (newOptions: ConvertOptions) => void;
  disabled?: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onChangeOptions,
  disabled,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tùy Chỉnh Thể Thức Nghị Định 30/2020/NĐ-CP
            </h3>
            <p className="text-[11px] text-slate-500">
              Tất cả thiết lập tự động tuân thủ dải quy định của Chính phủ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Font Size */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Cỡ chữ nội dung</span>
            <span className="text-[11px] text-slate-400 font-normal">Times New Roman</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, fontSize: 13 })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.fontSize === 13
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              13 pt (Chuẩn)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, fontSize: 14 })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.fontSize === 14
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 pt (Lớn)
            </button>
          </div>
        </div>

        {/* Line Spacing */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Khoảng cách dòng</span>
            <span className="text-[11px] text-slate-400 font-normal">Line Spacing</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            {[1.3, 1.4, 1.5].map((val) => (
              <button
                key={val}
                type="button"
                disabled={disabled}
                onClick={() => onChangeOptions({ ...options, lineSpacing: val as 1.3 | 1.4 | 1.5 })}
                className={`py-1.5 px-1 rounded-lg font-medium transition-all text-center ${
                  options.lineSpacing === val
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {val} lines
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Định lề trang A4</span>
            <span className="text-[11px] text-slate-400 font-normal">Trang dọc</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, marginPreset: 'standard' })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.marginPreset === 'standard'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm"
            >
              Chuẩn 20-20-30-15
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, marginPreset: 'generous' })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.marginPreset === 'generous'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Trên 25mm, Dưới 25mm, Trái 35mm, Phải 20mm"
            >
              Rộng 25-25-35-20
            </button>
          </div>
        </div>

        {/* Indent & Tables */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Thụt đầu dòng</span>
            <span className="text-[11px] text-slate-400 font-normal">1.0 - 1.27 cm</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, firstLineIndent: 1.0 })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.firstLineIndent === 1.0
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1.0 cm
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChangeOptions({ ...options, firstLineIndent: 1.27 })}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                options.firstLineIndent === 1.27
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1.27 cm (0.5")
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
