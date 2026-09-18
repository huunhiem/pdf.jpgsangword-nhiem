import React from 'react';
import { SAMPLE_DOCUMENTS, SampleDocItem } from '../data/sampleDocuments';
import { Decree30Document } from '../types';
import { Sparkles, FileText, Table, Send } from 'lucide-react';

interface SamplePickerProps {
  onSelectSample: (sample: SampleDocItem) => void;
  selectedId?: string;
  disabled?: boolean;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  selectedId,
  disabled,
}) => {
  const getIcon = (id: string) => {
    if (id.includes('report')) return <Table className="w-4 h-4 text-emerald-600" />;
    if (id.includes('dispatch')) return <Send className="w-4 h-4 text-blue-600" />;
    return <FileText className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Văn Bản Mẫu Chuẩn Thể Thức (Dùng thử nhanh)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_DOCUMENTS.map((sample) => {
          const isSelected = selectedId === sample.id;
          return (
            <button
              key={sample.id}
              disabled={disabled}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'border-red-500 bg-red-50/40 ring-2 ring-red-200 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  {getIcon(sample.id)}
                </div>
                <span className="font-semibold text-slate-800 line-clamp-1">
                  {sample.category}
                </span>
              </div>
              <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                {sample.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
