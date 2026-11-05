// 真实文档生成服务：用 docx 库生成可下载的 Word 文件
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
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';

const PRIMARY = 'C0392B';
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'DDD6C8' };

function cell(text, opts = {}) {
  return new TableCell({
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: !!opts.bold, color: opts.color, size: opts.size || 20 })],
        alignment: opts.align || AlignmentType.LEFT,
      }),
    ],
  });
}

function labelValueTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: BORDER,
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, color: '8A8578', size: 20 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: BORDER,
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: value, size: 20, bold: true })],
                }),
              ],
            }),
          ],
        })
    ),
  });
}

function parseNum(s) {
  const m = String(s || '').match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
}

// 生成报价单 Word 文档
export function buildQuotationDocx(data) {
  const rows = data.rows || [];
  const subtotal = rows.reduce((s, r) => s + parseNum(r.amount), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER,
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: data.project || '报价单', bold: true, size: 30 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: data.subtitle || '', color: '6E6A60', size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const infoRows = [
    ['报价公司', data.company || ''],
    ['报价日期', data.date || ''],
    ['报价编号', data.no || ''],
    ['客户名称', data.customer || ''],
    ['联系人 / 电话', data.contact || ''],
    ['报价有效期', data.validity || ''],
  ];

  const detailRows = [
    new TableRow({
      tableHeader: true,
      children: ['序号', '产品名称', '规格型号', '数量', '单价（元）', '金额（元）'].map((h) =>
        new TableCell({
          borders: BORDER,
          shading: { fill: 'F7F3EA' },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 18, color: '6E6A60' })],
              alignment: AlignmentType.CENTER,
            }),
          ],
        })
      ),
    }),
    ...rows
      .filter((r) => r.name || r.spec || r.qty || r.price)
      .map(
        (r, i) =>
          new TableRow({
            children: [
              cell(String(i + 1).padStart(2, '0'), { align: AlignmentType.CENTER, color: '8A8578', size: 18 }),
              cell(r.name, { size: 18 }),
              cell(r.spec, { size: 18 }),
              cell(r.qty, { align: AlignmentType.CENTER, size: 18 }),
              cell(r.price, { align: AlignmentType.RIGHT, size: 18 }),
              cell(r.amount || '—', { align: AlignmentType.RIGHT, size: 18 }),
            ],
          })
      ),
    new TableRow({
      children: [
        new TableCell({ columnSpan: 5, borders: BORDER, children: [] }),
        cell('小计 ' + fmt(subtotal) + ' 元', { bold: true, align: AlignmentType.RIGHT, size: 18 }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ columnSpan: 5, borders: BORDER, children: [] }),
        cell('税额 13%  ' + fmt(tax) + ' 元', { align: AlignmentType.RIGHT, size: 18 }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ columnSpan: 5, borders: BORDER, children: [] }),
        cell('含税总计  ' + fmt(total) + ' 元', { bold: true, align: AlignmentType.RIGHT, color: PRIMARY, size: 20 }),
      ],
    }),
  ];

  const detailTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    rows: detailRows,
  });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'LZContr · 合同条款库', color: 'A7A296', size: 16 })],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    headerTable,
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    labelValueTable(infoRows),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      children: [new TextRun({ text: '报价明细', bold: true, size: 22, color: PRIMARY })],
    }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    detailTable,
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      children: [new TextRun({ text: '报价说明与条款', bold: true, size: 22, color: PRIMARY })],
    }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    new Paragraph({
      children: [new TextRun({ text: data.notes || '', size: 20 })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '—— 本报价单由 LZContr 合同生成器生成 ——', color: 'A7A296', size: 16 })],
    }),
  ];

  return new Document({
    creator: 'LZContr',
    title: data.project || '报价单',
    sections: [{ properties: {}, children }],
  });
}

// 生成合同 Word 文档
export function buildContractDocx(data) {
  const isSale = data.type === 'xiaoshou';
  const partyA = isSale ? data.buyer : data.partyA;
  const partyB = isSale ? data.seller : data.partyB;

  const infoRows = [
    ['合同名称', data.name || ''],
    ['甲方（买方）', partyA || ''],
    ['乙方（卖方）', partyB || ''],
    ['签订日期', data.date || ''],
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'LZContr · 合同条款库', color: 'A7A296', size: 16 })],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: data.name || '合同', bold: true, size: 30 })],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    labelValueTable(infoRows),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    ...(data.clauses || []).map(
      (c) =>
        new Paragraph({
          children: [new TextRun({ text: c.title || '', bold: true, size: 22, color: PRIMARY })],
          spacing: { after: 100 },
        }),
    ),
    ...(data.clauses || []).map(
      (c) =>
        new Paragraph({
          children: [new TextRun({ text: c.text || '', size: 20 })],
          spacing: { after: 200 },
        })
    ),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '—— 本合同由 LZContr 合同生成器生成 ——', color: 'A7A296', size: 16 })],
    }),
  ];

  return new Document({
    creator: 'LZContr',
    title: data.name || '合同',
    sections: [{ properties: {}, children }],
  });
}

// 生成并下载文件
export async function downloadDocx(doc, filename) {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename.endsWith('.docx') ? filename : filename + '.docx');
  return blob.size;
}
