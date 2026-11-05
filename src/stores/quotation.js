import { defineStore } from 'pinia';
import { quotationService } from '../services/quotationService';

export const useQuotationStore = defineStore('quotation', {
  state: () => ({
    layout: 'a',
    form: {
      project: '数据中心机房改造项目报价单',
      subtitle: '机房基础设施升级与配套服务',
      company: '杭州懒猫云计算有限公司',
      date: '2026-02-10',
      no: 'Q2026-0210-007',
      customer: '宁波智造装备制造有限公司',
      contact: '王经理 · 138-0000-1234',
      validity: '自报价日起 30 天',
    },
    rows: [],
    notes: '',
    saved: false,
    saving: false,
    hydrated: false,
    savedId: null,
  }),
  actions: {
    setRows(rows) {
      this.rows = rows;
    },
    setNotes(notes) {
      this.notes = notes;
    },
    setLayout(l) {
      this.layout = l;
    },
    // 从 API 加载最近一次保存的报价单
    async load() {
      try {
        const res = await quotationService.list();
        // 取最新（按 updatedAt 降序）
        const latest = [...(res.data || [])].sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        )[0];
        if (latest) {
          this.savedId = latest.id;
          this.form = { ...this.form, ...latest };
          this.rows = latest.rows || this.rows;
          this.notes = latest.notes || this.notes;
          this.saved = true;
        }
      } catch (e) {
        /* ignore */
      } finally {
        this.hydrated = true;
      }
    },
    // 保存报价单（调用 API，修改即保存：携带已有 id 则更新）
    async save() {
      if (!this.hydrated) return null;
      this.saving = true;
      try {
        const res = await quotationService.save({
          id: this.savedId,
          layout: this.layout,
          project: this.form.project,
          subtitle: this.form.subtitle,
          company: this.form.company,
          date: this.form.date,
          no: this.form.no,
          customer: this.form.customer,
          contact: this.form.contact,
          validity: this.form.validity,
          rows: this.rows,
          notes: this.notes,
        });
        this.savedId = res.data.id;
        this.saved = true;
        return res.data;
      } finally {
        this.saving = false;
      }
    },
  },
});
