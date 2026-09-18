import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  LineRuleType,
} from 'docx';
import saveAs from 'file-saver';
import { Decree30Document, ConvertOptions, DocBlock } from '../types';

// Measurements in Twips (1 inch = 1440 twips; 1 mm = 56.6929 twips; 1 pt = 20 twips)
// ND 30 Standards:
// Paper size: A4 (210mm x 297mm) -> 11906 x 16838 twips
// Margins: Top 20-25mm, Bottom 20-25mm, Left 30-35mm, Right 15-20mm
// Font: Times New Roman
// Body size: 13pt (26 half-pts) or 14pt (28 half-pts)
// Spacing: 1.3 - 1.5 lines, after: 6pt (120 twips)

const MM_TO_TWIP = 56.6929;

export function generateDocxBlob(doc: Decree30Document, options: ConvertOptions): Promise<Blob> {
  const bodyFontSize = options.fontSize * 2; // in half-points
  const smallerFontSize = (options.fontSize - 1) * 2; // 12-13pt for headers
  const recipientFontSize = 22; // 11pt for recipients according to ND30
  const recipientHeaderSize = 24; // 12pt for "Nơi nhận:"
  
  // Line spacing: 1.3 lines = 312 twips; 1.4 = 336; 1.5 = 360
  const lineSpacingTwip = Math.round(options.lineSpacing * 240);
  const paragraphSpacing = { after: 120, line: lineSpacingTwip, lineRule: LineRuleType.AUTO };
  const firstLineIndentTwip = Math.round(options.firstLineIndent * 10 * MM_TO_TWIP);

  const topMargin = options.marginPreset === 'generous' ? Math.round(25 * MM_TO_TWIP) : Math.round(20 * MM_TO_TWIP);
  const bottomMargin = options.marginPreset === 'generous' ? Math.round(25 * MM_TO_TWIP) : Math.round(20 * MM_TO_TWIP);
  const leftMargin = options.marginPreset === 'generous' ? Math.round(35 * MM_TO_TWIP) : Math.round(30 * MM_TO_TWIP);
  const rightMargin = options.marginPreset === 'generous' ? Math.round(20 * MM_TO_TWIP) : Math.round(15 * MM_TO_TWIP);

  const FONT_FAMILY = 'Times New Roman';

  // Section 1: 2-Column Header Table (Agency & Number on Left, Motto & Date on Right)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Column 1: Agency and Doc Number
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            margins: { top: 0, bottom: 0, left: 0, right: 100 },
            children: [
              ...(doc.metadata.agencySuperior
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { line: 240, after: 40 },
                      children: [
                        new TextRun({
                          text: doc.metadata.agencySuperior.toUpperCase(),
                          font: FONT_FAMILY,
                          size: smallerFontSize,
                        }),
                      ],
                    }),
                  ]
                : []),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, after: 40 },
                children: [
                  new TextRun({
                    text: doc.metadata.agencyIssuing.toUpperCase(),
                    font: FONT_FAMILY,
                    size: smallerFontSize,
                    bold: true,
                  }),
                ],
              }),
              // Short horizontal line under issuing agency (ND 30: 1/3 to 1/2 width)
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 120, after: 60 },
                children: [
                  new TextRun({
                    text: '────────',
                    font: FONT_FAMILY,
                    size: 16,
                    color: '333333',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, after: 80 },
                children: [
                  new TextRun({
                    text: doc.metadata.documentNumber || 'Số: .../...',
                    font: FONT_FAMILY,
                    size: smallerFontSize,
                  }),
                ],
              }),
            ],
          }),

          // Column 2: National Motto and Location/Date
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            margins: { top: 0, bottom: 0, left: 100, right: 0 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, after: 40 },
                children: [
                  new TextRun({
                    text: doc.metadata.nationalMottoUpper || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    font: FONT_FAMILY,
                    size: smallerFontSize,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, after: 40 },
                children: [
                  new TextRun({
                    text: doc.metadata.nationalMottoLower || 'Độc lập - Tự do - Hạnh phúc',
                    font: FONT_FAMILY,
                    size: bodyFontSize,
                    bold: true,
                  }),
                ],
              }),
              // Solid line under national motto (ND 30: width equals motto width)
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 120, after: 80 },
                children: [
                  new TextRun({
                    text: '───────────────────',
                    font: FONT_FAMILY,
                    size: 16,
                    color: '333333',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, after: 80 },
                children: [
                  new TextRun({
                    text: `${doc.metadata.location || 'Hà Nội'}, ${doc.metadata.dateText || 'ngày ... tháng ... năm ...'}`,
                    font: FONT_FAMILY,
                    size: bodyFontSize,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Section 2: Title & Subject
  const titleParagraphs: Paragraph[] = [];
  
  if (doc.metadata.title) {
    titleParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 80, line: 280 },
        children: [
          new TextRun({
            text: doc.metadata.title.toUpperCase(),
            font: FONT_FAMILY,
            size: bodyFontSize + 2, // 14-15pt for main doc type
            bold: true,
          }),
        ],
      })
    );
  }

  if (doc.metadata.subject) {
    titleParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 60, line: 280 },
        children: [
          new TextRun({
            text: doc.metadata.subject,
            font: FONT_FAMILY,
            size: bodyFontSize,
            bold: true,
          }),
        ],
      })
    );

    // Decorative short line under subject
    titleParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200, line: 120 },
        children: [
          new TextRun({
            text: '───────',
            font: FONT_FAMILY,
            size: 16,
            color: '444444',
          }),
        ],
      })
    );
  }

  // Recipient header (e.g., "Kính gửi: ...")
  if (doc.metadata.recipientHeader) {
    titleParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: firstLineIndentTwip },
        spacing: paragraphSpacing,
        children: [
          new TextRun({
            text: doc.metadata.recipientHeader,
            font: FONT_FAMILY,
            size: bodyFontSize,
            bold: true,
          }),
        ],
      })
    );
  }

  // Section 3: Legal Grounds ("Căn cứ...")
  const groundsParagraphs: Paragraph[] = (doc.legalGrounds || []).map((ground, idx) => {
    const isLast = idx === (doc.legalGrounds.length - 1);
    const cleaned = ground.trim();
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { firstLine: firstLineIndentTwip },
      spacing: { after: isLast ? 160 : 80, line: lineSpacingTwip, lineRule: LineRuleType.AUTO },
      children: [
        new TextRun({
          text: cleaned.startsWith('Căn cứ') || cleaned.startsWith('Xét') ? cleaned : `Căn cứ ${cleaned}`,
          font: FONT_FAMILY,
          size: bodyFontSize,
          italics: true,
        }),
      ],
    });
  });

  // If docType is QUYẾT ĐỊNH, add "QUYẾT ĐỊNH:" centered bold
  if (doc.metadata.docType?.toUpperCase().includes('QUYẾT ĐỊNH') || doc.metadata.title?.toUpperCase().includes('QUYẾT ĐỊNH')) {
    groundsParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 140, line: 260 },
        children: [
          new TextRun({
            text: 'QUYẾT ĐỊNH:',
            font: FONT_FAMILY,
            size: bodyFontSize,
            bold: true,
          }),
        ],
      })
    );
  }

  // Section 4: Body Content Blocks
  const bodyElements: (Paragraph | Table)[] = [];

  for (const block of doc.body) {
    if (block.type === 'heading') {
      bodyElements.push(
        new Paragraph({
          alignment: block.alignment === 'center' ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
          spacing: { before: 160, after: 80, line: lineSpacingTwip, lineRule: LineRuleType.AUTO },
          indent: block.alignment === 'center' ? undefined : { firstLine: firstLineIndentTwip },
          children: [
            new TextRun({
              text: block.text,
              font: FONT_FAMILY,
              size: bodyFontSize,
              bold: true,
            }),
          ],
        })
      );
    } else if (block.type === 'paragraph') {
      bodyElements.push(
        new Paragraph({
          alignment: block.alignment === 'center'
            ? AlignmentType.CENTER
            : block.alignment === 'right'
            ? AlignmentType.RIGHT
            : AlignmentType.JUSTIFIED,
          indent: block.alignment === 'center' || block.alignment === 'right' || block.indent === false
            ? undefined
            : { firstLine: firstLineIndentTwip },
          spacing: paragraphSpacing,
          children: [
            new TextRun({
              text: block.text,
              font: FONT_FAMILY,
              size: bodyFontSize,
              bold: block.isBold,
              italics: block.isItalic,
              underline: block.isUnderline ? {} : undefined,
            }),
          ],
        })
      );
    } else if (block.type === 'list') {
      for (const item of block.items) {
        let prefix = '- ';
        if (block.listType === 'bullet') prefix = '• ';
        else if (block.listType === 'number' && !/^\d+[\.\)]/.test(item)) prefix = '1. ';
        else if (block.listType === 'letter' && !/^[a-z][\.\)]/i.test(item)) prefix = 'a) ';
        else if (block.listType === 'dash' && !item.startsWith('-')) prefix = '- ';
        else prefix = '';

        bodyElements.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: firstLineIndentTwip },
            spacing: { after: 60, line: lineSpacingTwip, lineRule: LineRuleType.AUTO },
            children: [
              new TextRun({
                text: `${prefix}${item}`,
                font: FONT_FAMILY,
                size: bodyFontSize,
              }),
            ],
          })
        );
      }
    } else if (block.type === 'table') {
      if (block.title) {
        bodyElements.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60, line: 240 },
            children: [
              new TextRun({
                text: block.title,
                font: FONT_FAMILY,
                size: bodyFontSize,
                bold: true,
              }),
            ],
          })
        );
      }

      const tableRows: TableRow[] = [];
      const colCount = Math.max(
        block.headers.length,
        ...block.rows.map(r => r.length)
      ) || 1;
      const colWidthPercent = Math.floor(100 / colCount);

      // Header Row
      if (block.headers && block.headers.length > 0) {
        tableRows.push(
          new TableRow({
            tableHeader: true,
            children: block.headers.map((h, colIdx) => {
              const align = block.alignments?.[colIdx] === 'right'
                ? AlignmentType.RIGHT
                : AlignmentType.CENTER;
              return new TableCell({
                width: { size: colWidthPercent, type: WidthType.PERCENTAGE },
                margins: { top: 80, bottom: 80, left: 80, right: 80 },
                shading: { fill: 'F4F5F7' },
                children: [
                  new Paragraph({
                    alignment: align,
                    spacing: { line: 240, after: 0 },
                    children: [
                      new TextRun({
                        text: h,
                        font: FONT_FAMILY,
                        size: smallerFontSize,
                        bold: true,
                      }),
                    ],
                  }),
                ],
              });
            }),
          })
        );
      }

      // Data Rows
      for (const row of block.rows) {
        tableRows.push(
          new TableRow({
            children: row.map((cellText, colIdx) => {
              const align = block.alignments?.[colIdx] === 'center'
                ? AlignmentType.CENTER
                : block.alignments?.[colIdx] === 'right'
                ? AlignmentType.RIGHT
                : AlignmentType.LEFT;
              return new TableCell({
                width: { size: colWidthPercent, type: WidthType.PERCENTAGE },
                margins: { top: 60, bottom: 60, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: align,
                    spacing: { line: 240, after: 0 },
                    children: [
                      new TextRun({
                        text: cellText,
                        font: FONT_FAMILY,
                        size: smallerFontSize,
                      }),
                    ],
                  }),
                ],
              });
            }),
          })
        );
      }

      const docxTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
          left: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
          right: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
          insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
        },
        rows: tableRows,
      });

      bodyElements.push(docxTable);
      // Spacing after table
      bodyElements.push(
        new Paragraph({
          spacing: { after: 120, line: 120 },
          children: [],
        })
      );
    }
  }

  // Section 5: Signature & Recipients Block (Table 2 columns borderless)
  const recipientParas: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { line: 200, after: 20 },
      children: [
        new TextRun({
          text: 'Nơi nhận:',
          font: FONT_FAMILY,
          size: recipientHeaderSize,
          bold: true,
          italics: true,
        }),
      ],
    }),
  ];

  const recipientList = doc.recipients && doc.recipients.length > 0
    ? doc.recipients
    : ['- Như trên;', '- Lưu: VT.'];

  for (const rec of recipientList) {
    recipientParas.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 180, after: 10 },
        children: [
          new TextRun({
            text: rec.startsWith('-') ? rec : `- ${rec}`,
            font: FONT_FAMILY,
            size: recipientFontSize,
          }),
        ],
      })
    );
  }

  const signerParas: Paragraph[] = [];
  if (doc.signer.competence) {
    signerParas.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, after: 40 },
        children: [
          new TextRun({
            text: doc.signer.competence.toUpperCase(),
            font: FONT_FAMILY,
            size: bodyFontSize,
            bold: true,
          }),
        ],
      })
    );
  }

  if (doc.signer.position) {
    signerParas.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, after: 40 },
        children: [
          new TextRun({
            text: doc.signer.position.toUpperCase(),
            font: FONT_FAMILY,
            size: bodyFontSize,
            bold: true,
          }),
        ],
      })
    );
  }

  // Signature and Stamp whitespace (ND 30: 4-5 empty lines)
  for (let i = 0; i < 4; i++) {
    signerParas.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 200, after: 0 },
        children: [
          new TextRun({
            text: i === 1 && doc.signer.signedStatus ? doc.signer.signedStatus : ' ',
            font: FONT_FAMILY,
            size: smallerFontSize,
            italics: true,
            color: '888888',
          }),
        ],
      })
    );
  }

  // Signer Name
  signerParas.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 0, line: 240 },
      children: [
        new TextRun({
          text: doc.signer.fullName || '',
          font: FONT_FAMILY,
          size: bodyFontSize,
          bold: true,
        }),
      ],
    })
  );

  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Left: Recipients
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 0, left: 0, right: 60 },
            children: recipientParas,
          }),
          // Right: Signer Block
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 0, left: 60, right: 0 },
            children: signerParas,
          }),
        ],
      }),
    ],
  });

  // Combine all into the final Document
  const docx = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips (210mm)
              height: 16838, // A4 height in twips (297mm)
            },
            margin: {
              top: topMargin,
              bottom: bottomMargin,
              left: leftMargin,
              right: rightMargin,
            },
          },
        },
        children: [
          headerTable,
          new Paragraph({ spacing: { after: 120, line: 120 }, children: [] }),
          ...titleParagraphs,
          ...groundsParagraphs,
          ...bodyElements,
          new Paragraph({ spacing: { before: 160, line: 120 }, children: [] }),
          footerTable,
        ],
      },
    ],
  });

  return Packer.toBlob(docx);
}

export async function downloadDecree30Docx(
  doc: Decree30Document,
  options: ConvertOptions,
  customFileName?: string
) {
  const blob = await generateDocxBlob(doc, options);
  const docTypeStr = doc.metadata.docType || 'VanBan';
  const cleanName = (customFileName || `${docTypeStr}_ChuanND30`)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
  const fileName = `${cleanName}.docx`;
  saveAs(blob, fileName);
}
