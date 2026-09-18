import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Configure body-parser with high payload limits for PDFs and high-res images
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// API endpoint to convert PDF/Image to Decree 30 structured document
app.post('/api/convert', async (req, res) => {
  try {
    const { fileBase64, mimeType, fileName, options } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({
        error: 'Thiếu dữ liệu tệp hoặc loại MIME.',
      });
    }

    const ai = getGeminiClient();

    const systemPrompt = `Bạn là Chuyên gia Hàng đầu về Công tác Văn thư và Kỹ thuật Trình bày Văn bản Hành chính theo Nghị định số 30/2020/NĐ-CP của Chính phủ Việt Nam.
Nhiệm vụ của bạn:
1. Nhận diện và đọc chính xác 100% toàn bộ nội dung từ tài liệu người dùng tải lên (ảnh scan, ảnh chụp hoặc file PDF).
2. Giữ nguyên tính toàn vẹn của nội dung, các số liệu, bảng biểu, danh sách, điều khoản, ngày tháng, tên riêng.
3. Nhận diện và bóc tách các thành phần thể thức theo Nghị định 30/2020/NĐ-CP:
   - Quốc hiệu: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
   - Tiêu ngữ: "Độc lập - Tự do - Hạnh phúc"
   - Cơ quan chủ quản cấp trên (nếu có) và Cơ quan ban hành văn bản
   - Số, ký hiệu văn bản (ví dụ: Số: 123/QĐ-UBND, Số: 45/BC-STC)
   - Địa danh và ngày tháng năm ban hành văn bản (ví dụ: Hà Nội, ngày 15 tháng 3 năm 2024)
   - Tên loại văn bản (QUYẾT ĐỊNH, CÔNG VĂN, BÁO CÁO, TỜ TRÌNH, THÔNG BÁO, KẾ HOẠCH...) và Trích yếu nội dung văn bản
   - Kính gửi (nếu là công văn hoặc tờ trình)
   - Các căn cứ pháp lý ("Căn cứ Luật...", "Căn cứ Nghị định...", "Xét đề nghị...")
   - Nội dung chính: các điều, khoản, điểm, đoạn văn, danh sách gạch đầu dòng, và bảng biểu (giữ nguyên đầy đủ hàng, cột, số liệu)
   - Nơi nhận (danh sách các nơi nhận ở góc dưới bên trái, bao gồm "- Lưu: VT, ...")
   - Thẩm quyền ký, chức danh và họ tên người ký (ở góc dưới bên phải)
4. Đánh giá mức độ tuân thủ thể thức Nghị định 30.

BẮT BUỘC TRẢ VỀ DẠNG JSON HỢP LỆ VỚI CẤU TRÚC SAU (không thêm văn bản giải thích ngoài JSON):
{
  "metadata": {
    "docType": "QUYẾT ĐỊNH" (hoặc CÔNG VĂN, BÁO CÁO, TỜ TRÌNH, THÔNG BÁO...),
    "agencySuperior": "Tên cơ quan cấp trên (nếu có, viết HOA) hoặc để trống",
    "agencyIssuing": "Tên cơ quan ban hành văn bản (viết HOA)",
    "documentNumber": "Số: .../...",
    "location": "Địa danh (ví dụ: Hà Nội, TP. Hồ Chí Minh)",
    "dateText": "ngày ... tháng ... năm ...",
    "nationalMottoUpper": "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
    "nationalMottoLower": "Độc lập - Tự do - Hạnh phúc",
    "title": "Tên loại văn bản (viết HOA) hoặc để trống nếu là công văn",
    "subject": "Trích yếu nội dung văn bản",
    "recipientHeader": "Kính gửi: ... (nếu có, dùng cho công văn, tờ trình)"
  },
  "legalGrounds": [
    "Căn cứ Luật...",
    "Căn cứ Nghị định..."
  ],
  "body": [
    {
      "type": "heading",
      "level": 1,
      "text": "Điều 1. ..."
    },
    {
      "type": "paragraph",
      "text": "Nội dung đoạn văn...",
      "indent": true,
      "isBold": false,
      "isItalic": false
    },
    {
      "type": "list",
      "listType": "dash" (hoặc "bullet", "number", "letter"),
      "items": ["mục 1", "mục 2"]
    },
    {
      "type": "table",
      "title": "Tên bảng nếu có",
      "headers": ["STT", "Cột 1", "Cột 2"],
      "rows": [
        ["1", "Dữ liệu 1", "100.000"],
        ["2", "Dữ liệu 2", "250.000"]
      ],
      "alignments": ["center", "left", "right"]
    }
  ],
  "signer": {
    "competence": "TM. ỦY BAN NHÂN DÂN (hoặc KT. CHỦ TỊCH, GIÁM ĐỐC...)",
    "position": "CHỦ TỊCH (hoặc PHÓ CHỦ TỊCH...)",
    "fullName": "Họ và tên người ký",
    "signedStatus": "(Đã ký)"
  },
  "recipients": [
    "- Như trên;",
    "- Lưu: VT, TH."
  ],
  "decree30ComplianceCheck": {
    "marginsStatus": "Đạt chuẩn lề theo Nghị định 30 (Top 20mm, Bottom 20mm, Left 30mm, Right 15mm)",
    "fontFamilyStatus": "Quy chuẩn phông Times New Roman 13-14pt",
    "headerTableStatus": "Đã chuẩn hóa tiêu ngữ và cơ quan ban hành 2 cột song song",
    "mottoLineStatus": "Đường kẻ ngang tiêu ngữ nét liền, cân xứng",
    "signerBlockStatus": "Thẩm quyền và chức danh người ký chuẩn quy định",
    "recipientsStatus": "Nơi nhận đặt tại góc dưới bên trái, cỡ chữ 11pt nghiêng đậm",
    "generalNote": "Văn bản đã được số hóa và chuẩn hóa toàn diện theo Nghị định số 30/2020/NĐ-CP."
  }
}`;

    // Clean base64 string if it contains data URI header
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');

    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPrompt = `Vui lòng nhận diện toàn bộ tài liệu đính kèm (tên file: ${fileName || 'tai-lieu'}), trích xuất toàn diện nội dung, giữ nguyên mọi bảng biểu, danh sách, điều khoản và chuẩn hóa thể thức chính xác theo Nghị định 30/2020/NĐ-CP. Trả về định dạng JSON chính xác.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [filePart, { text: textPrompt }],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsedDoc;

    try {
      parsedDoc = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback regex extract in case of formatting wrapper
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedDoc = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Không thể phân tích dữ liệu JSON trả về từ mô hình AI.');
      }
    }

    res.json({
      success: true,
      document: parsedDoc,
    });
  } catch (error: any) {
    console.error('Error during document conversion:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Đã có lỗi xảy ra khi xử lý và chuyển đổi văn bản.',
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
