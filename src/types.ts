export type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface DocParagraph {
  type: 'paragraph';
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: Alignment;
  indent?: boolean; // first line indent according to ND 30 (1 - 1.27cm)
}

export interface DocHeading {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
  isBold?: boolean;
  alignment?: Alignment;
}

export interface DocList {
  type: 'list';
  listType: 'dash' | 'bullet' | 'number' | 'letter';
  items: string[];
}

export interface DocTable {
  type: 'table';
  title?: string;
  headers: string[];
  rows: string[][];
  alignments?: ('left' | 'center' | 'right')[];
}

export type DocBlock = DocParagraph | DocHeading | DocList | DocTable;

export interface Decree30Document {
  metadata: {
    docType: string; // "QUYẾT ĐỊNH", "CÔNG VĂN", "BÁO CÁO", "TỜ TRÌNH", "THÔNG BÁO", etc.
    agencySuperior?: string; // e.g., "BỘ GIÁO DỤC VÀ ĐÀO TẠO" or "ỦY BAN NHÂN DÂN TỈNH..."
    agencyIssuing: string; // e.g., "TRƯỜNG ĐẠI HỌC...", "SỞ TÀI CHÍNH"
    documentNumber: string; // e.g., "Số: 156/QĐ-UBND" or "Số: 89/BC-STC"
    location: string; // e.g., "Hà Nội"
    dateText: string; // e.g., "ngày 15 tháng 10 năm 2024"
    nationalMottoUpper: string; // "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
    nationalMottoLower: string; // "Độc lập - Tự do - Hạnh phúc"
    title: string; // e.g., "QUYẾT ĐỊNH" or "BÁO CÁO"
    subject: string; // e.g., "Về việc ban hành quy chế hoạt động..."
    recipientHeader?: string; // "Kính gửi: ..." for official dispatches/proposals
  };
  legalGrounds: string[]; // "Căn cứ Luật...", "Xét đề nghị của..."
  body: DocBlock[];
  signer: {
    competence?: string; // "TM. ỦY BAN NHÂN DÂN", "KT. CHỦ TỊCH", "GIÁM ĐỐC"
    position?: string; // "CHỦ TỊCH", "PHÓ CHỦ TỊCH", "HIỆU TRƯỞNG"
    fullName: string;
    signedStatus?: string; // "(Đã ký và đóng dấu)"
  };
  recipients: string[]; // ["- Như Điều 3;", "- Bộ Nội vụ (để b/c);", "- Lưu: VT, TH."]
  decree30ComplianceCheck?: {
    marginsStatus: string;
    fontFamilyStatus: string;
    headerTableStatus: string;
    mottoLineStatus: string;
    signerBlockStatus: string;
    recipientsStatus: string;
    generalNote: string;
  };
}

export interface ConvertOptions {
  fontSize: 13 | 14; // ND 30 specifies 13pt or 14pt
  lineSpacing: 1.3 | 1.4 | 1.5; // ND 30 specifies 1.3 - 1.5 lines
  marginPreset: 'standard' | 'generous'; // standard: 20-20-30-15mm
  firstLineIndent: 1.0 | 1.27; // cm
  preserveOriginalLayout: boolean;
  strictDecree30: boolean;
}
