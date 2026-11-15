import { defineStore } from 'pinia';
import { generateService } from '../services/generateService';
import { buildQuotationDocx, downloadDocx } from '../services/documentService';
import { useQuotationStore } from './quotation';

export const useGenerationStore = defineStore('generation', {
  state: () => ({
    record: null,
    doc: null,
    generating: false,
  }),
  actions: {
    // 生成报价单文件：走 API 记录 + 构建真实 Word 文档
    async generate(payload, onProgress) {
      this.generating = true;
      try {
        const res = await generateService.generate(payload, onProgress);
        this.record = res.data;
        // 构建真实 .docx（数据来自报价单 store）
        const q = useQuotationStore();
        this.doc = buildQuotationDocx({
          project: q.form.project,
          subtitle: q.form.subtitle,
          company: q.form.company,
          date: q.form.date,
          no: q.form.no,
          customer: q.form.customer,
          contact: q.form.contact,
          validity: q.form.validity,
          rows: q.rows,
          notes: q.notes,
        });
        return res.data;
      } finally {
        this.generating = false;
      }
    },
    // 下载已生成的 Word 文件
    async download() {
      if (!this.doc) return 0;
      const filename = this.record ? this.record.filename : '报价单';
      return downloadDocx(this.doc, filename + '.docx');
    },
    reset() {
      this.record = null;
      this.doc = null;
    },
  },
});
