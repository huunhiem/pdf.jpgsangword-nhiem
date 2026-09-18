import { Decree30Document } from '../types';

export interface SampleDocItem {
  id: string;
  name: string;
  category: string;
  description: string;
  document: Decree30Document;
}

export const SAMPLE_DOCUMENTS: SampleDocItem[] = [
  {
    id: 'decision-01',
    name: 'Quyết định ban hành Kế hoạch Cải cách hành chính',
    category: 'Quyết định (Nghị định 30)',
    description: 'Quyết định hành chính chuẩn của UBND Tỉnh, bao gồm quốc hiệu, cơ quan cấp trên, căn cứ pháp lý, các điều khoản và nơi nhận.',
    document: {
      metadata: {
        docType: 'QUYẾT ĐỊNH',
        agencySuperior: 'ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG',
        agencyIssuing: 'VĂN PHÒNG ỦY BAN',
        documentNumber: 'Số: 452/QĐ-UBND',
        location: 'Đà Lạt',
        dateText: 'ngày 18 tháng 03 năm 2025',
        nationalMottoUpper: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        nationalMottoLower: 'Độc lập - Tự do - Hạnh phúc',
        title: 'QUYẾT ĐỊNH',
        subject: 'Về việc ban hành Kế hoạch thực hiện công tác chuyển đổi số và cải cách hành chính nhà nước giai đoạn 2025 - 2026',
      },
      legalGrounds: [
        'Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;',
        'Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn thư;',
        'Căn cứ Quyết định số 749/QĐ-TTg ngày 03 tháng 6 năm 2020 của Thủ tướng Chính phủ phê duyệt Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030;',
        'Theo đề nghị của Giám đốc Sở Nội vụ tại Tờ trình số 128/TTr-SNV ngày 12 tháng 03 năm 2025.',
      ],
      body: [
        {
          type: 'heading',
          level: 1,
          text: 'Điều 1. Ban hành kèm theo Quyết định này Kế hoạch thực hiện công tác chuyển đổi số và cải cách hành chính nhà nước trên địa bàn tỉnh giai đoạn 2025 - 2026.',
        },
        {
          type: 'paragraph',
          text: 'Mục tiêu trọng tâm là 100% văn bản hành chính được gửi nhận điện tử và xử lý trên môi trường mạng; toàn bộ biểu mẫu hành chính được số hóa và chuẩn hóa thể thức trình bày theo đúng quy định tại Nghị định số 30/2020/NĐ-CP.',
          indent: true,
        },
        {
          type: 'heading',
          level: 1,
          text: 'Điều 2. Kinh phí thực hiện',
        },
        {
          type: 'paragraph',
          text: 'Kinh phí thực hiện Kế hoạch được bố trí từ nguồn ngân sách nhà nước theo phân cấp ngân sách hiện hành, nguồn kinh phí sự nghiệp khoa học công nghệ và các nguồn huy động hợp pháp khác theo quy định của pháp luật.',
          indent: true,
        },
        {
          type: 'heading',
          level: 1,
          text: 'Điều 3. Trách nhiệm thi hành',
        },
        {
          type: 'paragraph',
          text: 'Chánh Văn phòng Ủy ban nhân dân tỉnh, Giám đốc các Sở: Nội vụ, Thông tin và Truyền thông, Tài chính; Chủ tịch Ủy ban nhân dân các huyện, thành phố và Thủ trưởng các cơ quan, đơn vị có liên quan chịu trách nhiệm thi hành Quyết định này.',
          indent: true,
        },
        {
          type: 'paragraph',
          text: 'Quyết định này có hiệu lực thi hành kể từ ngày ký ban hành.',
          indent: true,
        },
      ],
      signer: {
        competence: 'TM. ỦY BAN NHÂN DÂN',
        position: 'CHỦ TỊCH',
        fullName: 'Trần Thanh Nam',
        signedStatus: '(Đã ký và đóng dấu)',
      },
      recipients: [
        '- Văn phòng Chính phủ (để b/c);',
        '- Bộ Nội vụ, Bộ TT&TT (để b/c);',
        '- Thường trực Tỉnh ủy, HĐND tỉnh;',
        '- Chủ tịch, các Phó Chủ tịch UBND tỉnh;',
        '- Các Sở, ban, ngành cấp tỉnh;',
        '- UBND các huyện, thành phố;',
        '- Cổng Thông tin điện tử tỉnh;',
        '- Lưu: VT, NC, TH (03b).',
      ],
      decree30ComplianceCheck: {
        marginsStatus: 'Đạt chuẩn (Lề trên 20mm, dưới 20mm, trái 30mm, phải 15mm)',
        fontFamilyStatus: 'Đạt chuẩn phông chữ Times New Roman Unicode',
        headerTableStatus: 'Bảng tiêu ngữ và cơ quan ban hành 2 cột không viền',
        mottoLineStatus: 'Đường kẻ liền dưới tiêu ngữ cân đối, đúng quy cách',
        signerBlockStatus: 'Thẩm quyền TM. UBND và chức danh in hoa đậm',
        recipientsStatus: 'Nơi nhận cỡ chữ 11pt, nghiêng đậm tiêu đề',
        generalNote: 'Văn bản tuân thủ 100% thể thức văn bản hành chính theo Nghị định số 30/2020/NĐ-CP của Chính phủ.',
      },
    },
  },
  {
    id: 'report-table-02',
    name: 'Báo cáo tổng hợp số liệu công tác quý I (Có bảng biểu)',
    category: 'Báo cáo bảng biểu',
    description: 'Báo cáo định kỳ có bảng số liệu chi tiết nhiều cột, giữ nguyên cấu trúc dòng cột và căn lề số liệu.',
    document: {
      metadata: {
        docType: 'BÁO CÁO',
        agencySuperior: 'BỘ KHOA HỌC VÀ CÔNG NGHỆ',
        agencyIssuing: 'CỤC ỨNG DỤNG VÀ PHÁT TRIỂN CÔNG NGHỆ',
        documentNumber: 'Số: 98/BC-CUDPTCN',
        location: 'Hà Nội',
        dateText: 'ngày 25 tháng 03 năm 2025',
        nationalMottoUpper: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        nationalMottoLower: 'Độc lập - Tự do - Hạnh phúc',
        title: 'BÁO CÁO',
        subject: 'Kết quả triển khai nhiệm vụ khoa học, chuyển đổi công nghệ và ứng dụng trí tuệ nhân tạo Quý I năm 2025',
      },
      legalGrounds: [
        'Thực hiện Quyết định số 12/QĐ-BKHCN ngày 08 tháng 01 năm 2025 của Bộ trưởng Bộ Khoa học và Công nghệ ban hành Chương trình công tác năm 2025;',
        'Căn cứ chức năng, nhiệm vụ và tình hình triển khai thực tế, Cục Ứng dụng và Phát triển công nghệ báo cáo kết quả thực hiện nhiệm vụ Quý I và phương hướng nhiệm vụ Quý II năm 2025 như sau:',
      ],
      body: [
        {
          type: 'heading',
          level: 2,
          text: 'I. KẾT QUẢ ĐẠT ĐƯỢC',
        },
        {
          type: 'paragraph',
          text: 'Trong quý I năm 2025, Cục đã chủ động phối hợp với các viện nghiên cứu, trường đại học và địa phương triển khai 24 nhiệm vụ trọng điểm. Công tác ứng dụng trí tuệ nhân tạo và số hóa tài liệu hành chính theo chuẩn Nghị định 30/2020/NĐ-CP đã đạt nhiều bước tiến vững chắc.',
          indent: true,
        },
        {
          type: 'table',
          title: 'Bảng 1: Thống kê chỉ tiêu ứng dụng số hóa và chuyển đổi văn bản Quý I/2025',
          headers: ['STT', 'Tên chỉ tiêu nhiệm vụ', 'Đơn vị tính', 'Kế hoạch', 'Thực hiện', 'Tỷ lệ (%)'],
          alignments: ['center', 'left', 'center', 'right', 'right', 'right'],
          rows: [
            ['01', 'Số hóa hồ sơ tài liệu lưu trữ', 'Hồ sơ', '12.000', '13.450', '112.1%'],
            ['02', 'Chuẩn hóa văn bản hành chính theo NĐ 30', 'Văn bản', '5.000', '5.230', '104.6%'],
            ['03', 'Tập huấn kỹ năng văn thư điện tử', 'Học viên', '800', '850', '106.3%'],
            ['04', 'Phần mềm OCR trích xuất bảng biểu tự động', 'Hệ thống', '02', '02', '100.0%'],
            ['05', 'Tỷ lệ tiếp nhận văn bản trực tuyến', '%', '95%', '99.2%', '104.4%'],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'II. NHẬN XÉT VÀ ĐÁNH GIÁ',
        },
        {
          type: 'paragraph',
          text: 'Nhìn chung, tiến độ triển khai các đề tài và dự án bám sát kế hoạch. Các đơn vị đã tuân thủ nghiêm ngặt kỹ thuật trình bày văn bản theo Nghị định 30, giảm thiểu sai sót về phông chữ, định lề và bố cục các thành phần thể thức.',
          indent: true,
        },
        {
          type: 'heading',
          level: 2,
          text: 'III. NHIỆM VỤ TRỌNG TÂM QUÝ II NĂM 2025',
        },
        {
          type: 'list',
          listType: 'dash',
          items: [
            'Đẩy mạnh kiểm tra, rà soát việc thực hiện thể thức văn bản tại tất cả các phòng ban trực thuộc;',
            'Nâng cấp hệ thống trích xuất văn bản scan sang định dạng Word có kiểm tra sai lệch thể thức tự động;',
            'Tổ chức hội thảo chuyên đề về bảo mật dữ liệu và chuẩn hóa văn thư điện tử toàn quốc.',
          ],
        },
      ],
      signer: {
        competence: 'CỤC TRƯỞNG',
        position: '',
        fullName: 'TS. Hoàng Minh Trí',
        signedStatus: '(Đã ký)',
      },
      recipients: [
        '- Bộ trưởng (để b/c);',
        '- Thứ trưởng phụ trách khối (để b/c);',
        '- Văn phòng Bộ Khoa học và Công nghệ;',
        '- Các đơn vị trực thuộc Cục;',
        '- Lưu: VT, TH (02b).',
      ],
      decree30ComplianceCheck: {
        marginsStatus: 'Đạt chuẩn (20-20-30-15 mm)',
        fontFamilyStatus: 'Times New Roman 13pt',
        headerTableStatus: 'Đúng quy chuẩn Quốc hiệu và Cơ quan',
        mottoLineStatus: 'Đường gạch ngang tiêu ngữ chính xác',
        signerBlockStatus: 'Cục trưởng ký đúng thẩm quyền',
        recipientsStatus: 'Đúng vị trí góc dưới bên trái',
        generalNote: 'Bảng biểu được định dạng với đường viền mảnh 0.5pt, tiêu đề cột in đậm và căn lề số liệu bên phải theo thông lệ quốc tế và quy định NĐ 30.',
      },
    },
  },
  {
    id: 'dispatch-03',
    name: 'Công văn hành chính hướng dẫn thể thức văn bản',
    category: 'Công văn hành chính',
    description: 'Công văn gửi cơ quan ban ngành với phần kính gửi, trích yếu dưới số hiệu, các nội dung hướng dẫn.',
    document: {
      metadata: {
        docType: 'CÔNG VĂN',
        agencySuperior: 'SỞ THÔNG TIN VÀ TRUYỀN THÔNG',
        agencyIssuing: 'TRUNG TÂM CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG',
        documentNumber: 'Số: 215/STTTT-CNTT',
        location: 'Hà Nội',
        dateText: 'ngày 10 tháng 02 năm 2025',
        nationalMottoUpper: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        nationalMottoLower: 'Độc lập - Tự do - Hạnh phúc',
        title: '',
        subject: 'V/v hướng dẫn chuyển đổi số văn bản hành chính và định dạng file Word chuẩn Nghị định 30/2020/NĐ-CP',
        recipientHeader: 'Kính gửi: Các Sở, ban, ngành và Ủy ban nhân dân các quận, huyện, thị xã',
      },
      legalGrounds: [
        'Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn thư;',
        'Căn cứ Kế hoạch số 45/KH-UBND ngày 15 tháng 01 năm 2025 của Ủy ban nhân dân thành phố về phát triển chính quyền số và đảm bảo an toàn thông tin mạng;',
      ],
      body: [
        {
          type: 'paragraph',
          text: 'Nhằm nâng cao hiệu quả trao đổi văn bản điện tử và đảm bảo tính thống nhất trong kỹ thuật trình bày văn bản hành chính, Sở Thông tin và Truyền thông hướng dẫn các cơ quan, đơn vị thực hiện một số nội dung sau:',
          indent: true,
        },
        {
          type: 'heading',
          level: 2,
          text: '1. Về phông chữ và định lề trang văn bản',
        },
        {
          type: 'paragraph',
          text: 'Văn bản hành chính phải sử dụng phông chữ tiếng Việt chuẩn Times New Roman (bộ mã ký tự Unicode theo TCVN 6909:2001). Cỡ chữ nội dung từ 13pt đến 14pt, màu đen. Định lề trang A4: lề trên 20 - 25mm, lề dưới 20 - 25mm, lề trái 30 - 35mm, lề phải 15 - 20mm.',
          indent: true,
        },
        {
          type: 'heading',
          level: 2,
          text: '2. Về vị trí và kỹ thuật trình bày Quốc hiệu, Tiêu ngữ',
        },
        {
          type: 'paragraph',
          text: 'Quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" được trình bày bằng chữ in hoa, cỡ chữ 12 đến 13, kiểu chữ đứng, đậm. Tiêu ngữ "Độc lập - Tự do - Hạnh phúc" được trình bày bằng chữ in thường, cỡ chữ 13 đến 14, kiểu chữ đứng, đậm; chữ cái đầu của các cụm từ được viết hoa, giữa các cụm từ có gạch nối, có cách chữ; phía dưới có đường kẻ ngang, nét liền, có độ dài bằng độ dài của dòng chữ.',
          indent: true,
        },
        {
          type: 'heading',
          level: 2,
          text: '3. Chuyển đổi tài liệu quét (PDF/Ảnh) sang Word có thể chỉnh sửa',
        },
        {
          type: 'paragraph',
          text: 'Khuyến khích các cơ quan áp dụng giải pháp OCR ứng dụng AI để nhận diện, tái tạo lại văn bản dạng Word (.docx) mà vẫn bảo đảm độ trung thực về nội dung, bảng biểu và cấu trúc phân cấp thể thức.',
          indent: true,
        },
        {
          type: 'paragraph',
          text: 'Trong quá trình thực hiện, nếu có khó khăn, vướng mắc, đề nghị các cơ quan, đơn vị liên hệ Sở Thông tin và Truyền thông để được phối hợp, hỗ trợ giải quyết kịp thời./.',
          indent: true,
        },
      ],
      signer: {
        competence: 'KT. GIÁM ĐỐC',
        position: 'PHÓ GIÁM ĐỐC',
        fullName: 'Nguyễn Đình Phúc',
        signedStatus: '(Đã ký)',
      },
      recipients: [
        '- Như trên;',
        '- Chủ tịch UBND thành phố (để b/c);',
        '- Giám đốc Sở (để b/c);',
        '- Các phòng chuyên môn thuộc Sở;',
        '- Lưu: VT, CNTT.',
      ],
      decree30ComplianceCheck: {
        marginsStatus: 'Đạt chuẩn 20-20-30-15 mm',
        fontFamilyStatus: 'Times New Roman 13.5pt',
        headerTableStatus: 'Đúng thể thức công văn hành chính',
        mottoLineStatus: 'Đường kẻ liền tiêu ngữ đúng quy chuẩn',
        signerBlockStatus: 'Ký thay (KT. Giám đốc) chuẩn thể thức',
        recipientsStatus: 'Nơi nhận căn góc trái dưới cùng',
        generalNote: 'Công văn đạt chuẩn theo quy định tại Phụ lục I Nghị định số 30/2020/NĐ-CP.',
      },
    },
  },
];
