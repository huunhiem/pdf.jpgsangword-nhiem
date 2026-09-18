import React, { useState } from 'react';
import { Decree30Document, ConvertOptions, DocBlock, DocTable } from '../types';
import {
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  FileDown,
  Printer,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { downloadDecree30Docx } from '../utils/docxGenerator';

interface A4DocumentPreviewProps {
  document: Decree30Document;
  options: ConvertOptions;
  onUpdateDocument?: (doc: Decree30Document) => void;
  originalFileName?: string;
}

export const A4DocumentPreview: React.FC<A4DocumentPreviewProps> = ({
  document,
  options,
  onUpdateDocument,
  originalFileName,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable local copy
  const [editableDoc, setEditableDoc] = useState<Decree30Document>(document);

  React.useEffect(() => {
    setEditableDoc(document);
  }, [document]);

  const handleFieldChange = (path: string, value: any) => {
    const updated = { ...editableDoc };
    if (path.startsWith('metadata.')) {
      const field = path.split('.')[1];
      (updated.metadata as any)[field] = value;
    } else if (path === 'signer.fullName') {
      updated.signer.fullName = value;
    } else if (path === 'signer.position') {
      updated.signer.position = value;
    } else if (path === 'signer.competence') {
      updated.signer.competence = value;
    }
    setEditableDoc(updated);
    if (onUpdateDocument) onUpdateDocument(updated);
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      await downloadDecree30Docx(editableDoc, options, originalFileName);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const textLines: string[] = [];
    if (editableDoc.metadata.agencySuperior) textLines.push(editableDoc.metadata.agencySuperior);
    textLines.push(editableDoc.metadata.agencyIssuing);
    textLines.push(editableDoc.metadata.documentNumber);
    textLines.push(editableDoc.metadata.nationalMottoUpper);
    textLines.push(editableDoc.metadata.nationalMottoLower);
    textLines.push(`${editableDoc.metadata.location}, ${editableDoc.metadata.dateText}`);
    textLines.push('');
    if (editableDoc.metadata.title) textLines.push(editableDoc.metadata.title);
    if (editableDoc.metadata.subject) textLines.push(editableDoc.metadata.subject);
    textLines.push('');
    for (const g of editableDoc.legalGrounds || []) {
      textLines.push(g);
    }
    textLines.push('');
    for (const b of editableDoc.body || []) {
      if (b.type === 'heading' || b.type === 'paragraph') textLines.push(b.text);
      else if (b.type === 'list') textLines.push(b.items.join('\n'));
      else if (b.type === 'table') {
        textLines.push(b.headers.join('\t'));
        for (const r of b.rows) textLines.push(r.join('\t'));
      }
    }
    textLines.push('');
    textLines.push(`Nơi nhận:\n${editableDoc.recipients.join('\n')}`);
    textLines.push(`${editableDoc.signer.competence || ''} ${editableDoc.signer.position || ''}\n\n${editableDoc.signer.fullName}`);

    navigator.clipboard.writeText(textLines.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert mm to pixels or responsive CSS
  // A4 paper is 210mm x 297mm
  const isGenerous = options.marginPreset === 'generous';
  const paddingClass = isGenerous ? 'pt-8 pb-8 pl-12 pr-7' : 'pt-7 pb-7 pl-10 pr-5';
  const fontSizeClass = options.fontSize === 14 ? 'text-[14px]' : 'text-[13px]';
  const lineSpacingStyle = { lineHeight: options.lineSpacing };
  const firstLineIndent = options.firstLineIndent === 1.27 ? 'indent-7' : 'indent-5';

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Đã chuẩn hóa NĐ 30/2020/NĐ-CP
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Times New Roman • {options.fontSize}pt • Khổ A4
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isEditMode
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Bật chế độ chỉnh sửa thông tin nhanh"
          >
            {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditMode ? 'Xem hoàn thiện' : 'Sửa nhanh'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
            title="Sao chép nội dung"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Đã sao chép' : 'Sao chép'}</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo Word...' : 'Tải File Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Realistic A4 Document Canvas */}
      <div className="bg-slate-100/90 rounded-2xl p-4 sm:p-8 flex justify-center overflow-x-auto border border-slate-200">
        <div
          className={`bg-white text-black shadow-xl border border-slate-200/90 max-w-[820px] w-full min-h-[1100px] ${paddingClass} ${fontSizeClass} font-['Times_New_Roman',_Times,_serif]`}
          style={lineSpacingStyle}
        >
          {/* 1. Header Table (Agency & Motto) */}
          <div className="grid grid-cols-12 gap-2 pb-3">
            {/* Left Column: Superior + Issuing Agency + Doc Number */}
            <div className="col-span-5 text-center flex flex-col items-center">
              {editableDoc.metadata.agencySuperior && (
                <div className="text-[12px] uppercase font-normal leading-tight">
                  {editableDoc.metadata.agencySuperior}
                </div>
              )}
              {isEditMode ? (
                <input
                  type="text"
                  value={editableDoc.metadata.agencyIssuing}
                  onChange={(e) => handleFieldChange('metadata.agencyIssuing', e.target.value)}
                  className="w-full text-center text-[12.5px] uppercase font-bold border border-dashed border-red-400 bg-red-50/50 rounded px-1"
                />
              ) : (
                <div className="text-[12.5px] uppercase font-bold leading-tight">
                  {editableDoc.metadata.agencyIssuing}
                </div>
              )}

              {/* Short line under agency */}
              <div className="w-16 border-b border-black my-1"></div>

              {isEditMode ? (
                <input
                  type="text"
                  value={editableDoc.metadata.documentNumber}
                  onChange={(e) => handleFieldChange('metadata.documentNumber', e.target.value)}
                  className="w-full text-center text-[12.5px] border border-dashed border-red-400 bg-red-50/50 rounded px-1 mt-0.5"
                />
              ) : (
                <div className="text-[12.5px] mt-0.5">
                  {editableDoc.metadata.documentNumber || 'Số: .../...'}
                </div>
              )}
            </div>

            {/* Right Column: National Motto & Date */}
            <div className="col-span-7 text-center flex flex-col items-center">
              <div className="text-[12.5px] font-bold uppercase leading-tight tracking-tight">
                {editableDoc.metadata.nationalMottoUpper || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'}
              </div>
              <div className="text-[13px] font-bold leading-tight mt-0.5">
                {editableDoc.metadata.nationalMottoLower || 'Độc lập - Tự do - Hạnh phúc'}
              </div>

              {/* Solid line under motto with width matching text */}
              <div className="w-36 border-b border-black my-1"></div>

              {isEditMode ? (
                <div className="flex items-center gap-1 w-full mt-0.5">
                  <input
                    type="text"
                    value={editableDoc.metadata.location}
                    onChange={(e) => handleFieldChange('metadata.location', e.target.value)}
                    className="w-1/3 text-right italic text-[13px] border border-dashed border-red-400 bg-red-50/50 rounded px-1"
                    placeholder="Địa danh"
                  />
                  <span>,</span>
                  <input
                    type="text"
                    value={editableDoc.metadata.dateText}
                    onChange={(e) => handleFieldChange('metadata.dateText', e.target.value)}
                    className="w-2/3 italic text-[13px] border border-dashed border-red-400 bg-red-50/50 rounded px-1"
                    placeholder="ngày ... tháng ... năm ..."
                  />
                </div>
              ) : (
                <div className="text-[13px] italic mt-0.5">
                  {editableDoc.metadata.location || 'Hà Nội'}, {editableDoc.metadata.dateText || 'ngày ... tháng ... năm ...'}
                </div>
              )}
            </div>
          </div>

          {/* 2. Document Title & Subject */}
          <div className="text-center my-5 space-y-1">
            {editableDoc.metadata.title && (
              <div className="text-[14.5px] font-bold uppercase tracking-wide">
                {editableDoc.metadata.title}
              </div>
            )}
            {editableDoc.metadata.subject && (
              <div className="font-bold max-w-lg mx-auto text-[13.5px]">
                {editableDoc.metadata.subject}
              </div>
            )}
            {editableDoc.metadata.subject && (
              <div className="w-20 border-b border-black mx-auto my-1.5"></div>
            )}
          </div>

          {/* Recipient Header (e.g. Kính gửi: ...) */}
          {editableDoc.metadata.recipientHeader && (
            <div className={`mb-3 font-bold text-justify ${firstLineIndent}`}>
              {editableDoc.metadata.recipientHeader}
            </div>
          )}

          {/* 3. Legal Grounds ("Căn cứ...") */}
          {editableDoc.legalGrounds && editableDoc.legalGrounds.length > 0 && (
            <div className="space-y-1.5 mb-4 text-justify">
              {editableDoc.legalGrounds.map((ground, idx) => {
                const cleaned = ground.trim();
                const display = cleaned.startsWith('Căn cứ') || cleaned.startsWith('Xét') ? cleaned : `Căn cứ ${cleaned}`;
                return (
                  <p key={idx} className={`italic text-[13px] ${firstLineIndent}`}>
                    {display}
                  </p>
                );
              })}
            </div>
          )}

          {/* If QUYẾT ĐỊNH, display centered bold "QUYẾT ĐỊNH:" */}
          {(editableDoc.metadata.docType?.toUpperCase().includes('QUYẾT ĐỊNH') ||
            editableDoc.metadata.title?.toUpperCase().includes('QUYẾT ĐỊNH')) && (
            <div className="text-center font-bold text-[14px] my-3">
              QUYẾT ĐỊNH:
            </div>
          )}

          {/* 4. Body Content Blocks */}
          <div className="space-y-3 mb-8 text-justify">
            {editableDoc.body.map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <div
                    key={idx}
                    className={`font-bold my-2 text-[13.5px] ${
                      block.alignment === 'center' ? 'text-center' : firstLineIndent
                    }`}
                  >
                    {block.text}
                  </div>
                );
              }

              if (block.type === 'paragraph') {
                return (
                  <p
                    key={idx}
                    className={`${block.alignment === 'center' ? 'text-center' : block.alignment === 'right' ? 'text-right' : `text-justify ${firstLineIndent}`} ${
                      block.isBold ? 'font-bold' : ''
                    } ${block.isItalic ? 'italic' : ''} ${block.isUnderline ? 'underline' : ''}`}
                  >
                    {block.text}
                  </p>
                );
              }

              if (block.type === 'list') {
                return (
                  <div key={idx} className="space-y-1 my-2">
                    {block.items.map((item, itemIdx) => (
                      <p key={itemIdx} className={`text-justify ${firstLineIndent}`}>
                        {block.listType === 'dash' && !item.startsWith('-') ? `- ${item}` : item}
                      </p>
                    ))}
                  </div>
                );
              }

              if (block.type === 'table') {
                const table = block as DocTable;
                return (
                  <div key={idx} className="my-4 overflow-x-auto">
                    {table.title && (
                      <div className="text-center font-bold text-[13px] mb-1.5">
                        {table.title}
                      </div>
                    )}
                    <table className="w-full border-collapse border border-slate-700 text-[12.5px]">
                      {table.headers && table.headers.length > 0 && (
                        <thead>
                          <tr className="bg-slate-100">
                            {table.headers.map((h, colIdx) => (
                              <th
                                key={colIdx}
                                className="border border-slate-700 p-2 font-bold text-center"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {table.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50/50">
                            {row.map((cell, colIdx) => {
                              const align = table.alignments?.[colIdx] || 'left';
                              const alignClass =
                                align === 'center'
                                  ? 'text-center'
                                  : align === 'right'
                                  ? 'text-right'
                                  : 'text-left';
                              return (
                                <td
                                  key={colIdx}
                                  className={`border border-slate-700 p-1.5 ${alignClass}`}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* 5. Signature and Recipients (Bottom 2 columns) */}
          <div className="grid grid-cols-12 gap-4 pt-4 mt-6 border-t-0">
            {/* Left Column: Recipients */}
            <div className="col-span-5 text-left space-y-0.5">
              <div className="font-bold italic text-[12px]">Nơi nhận:</div>
              {editableDoc.recipients && editableDoc.recipients.length > 0 ? (
                editableDoc.recipients.map((rec, rIdx) => (
                  <div key={rIdx} className="text-[11px] leading-tight text-slate-800">
                    {rec.startsWith('-') ? rec : `- ${rec}`}
                  </div>
                ))
              ) : (
                <>
                  <div className="text-[11px]">- Như trên;</div>
                  <div className="text-[11px]">- Lưu: VT.</div>
                </>
              )}
            </div>

            {/* Right Column: Signer Block */}
            <div className="col-span-7 text-center flex flex-col items-center">
              {editableDoc.signer.competence && (
                <div className="font-bold uppercase text-[13px] leading-tight">
                  {editableDoc.signer.competence}
                </div>
              )}
              {editableDoc.signer.position && (
                <div className="font-bold uppercase text-[13px] leading-tight">
                  {editableDoc.signer.position}
                </div>
              )}

              {/* Empty space for signature & official stamp */}
              <div className="h-16 sm:h-20 flex items-center justify-center text-slate-400 italic text-[11.5px]">
                {editableDoc.signer.signedStatus || '(Ký, ghi rõ họ tên và đóng dấu)'}
              </div>

              {/* Signer Full Name */}
              {isEditMode ? (
                <input
                  type="text"
                  value={editableDoc.signer.fullName}
                  onChange={(e) => handleFieldChange('signer.fullName', e.target.value)}
                  className="font-bold text-[13.5px] border border-dashed border-red-400 bg-red-50/50 rounded px-2 py-0.5 text-center"
                />
              ) : (
                <div className="font-bold text-[13.5px]">
                  {editableDoc.signer.fullName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
