import { defineStore } from 'pinia';
import { contractService } from '../services/contractService';

export const useContractStore = defineStore('contract', {
  state: () => ({
    yanfa: {
      name: '智能图生成平台研发服务合同',
      partyA: '杭州懒猫科技有限公司',
      partyB: '上海云枢信息技术有限公司',
      date: '2026-02-01',
      amount: '480,000.00',
      period: '180 个自然日',
      clauses: [],
      milestones: [],
    },
    xiaoshou: {
      name: '服务器设备采购及配套服务销售合同',
      buyer: '宁波智造装备制造有限公司',
      seller: '杭州懒猫云计算有限公司',
      date: '2026-02-05',
      place: '宁波市北仑区港区大道 88 号',
      warranty: '24 个月',
      products: [],
      clauses: [],
    },
    saving: false,
    hydrated: false,
  }),
  actions: {
    // 从 API 加载已保存的合同
    async load() {
      try {
        const res = await contractService.list();
        const list = (res.data || []).slice().sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        );
        const yf = list.find((c) => c.type === 'yanfa');
        const xs = list.find((c) => c.type === 'xiaoshou');
        if (yf) {
          this.yanfa = {
            ...this.yanfa,
            name: yf.name,
            partyA: yf.partyA,
            partyB: yf.partyB,
            clauses: yf.clauses || this.yanfa.clauses,
            milestones: yf.milestones || this.yanfa.milestones,
          };
        }
        if (xs) {
          this.xiaoshou = {
            ...this.xiaoshou,
            name: xs.name,
            buyer: xs.buyer,
            seller: xs.seller,
            products: xs.products || this.xiaoshou.products,
            clauses: xs.clauses || this.xiaoshou.clauses,
          };
        }
      } catch (e) {
        /* ignore */
      } finally {
        this.hydrated = true;
      }
    },
    async saveYanfa(data) {
      if (!this.hydrated) return null;
      this.saving = true;
      try {
        const res = await contractService.save({ type: 'yanfa', ...data });
        this.yanfa = { ...this.yanfa, ...data };
        return res.data;
      } finally {
        this.saving = false;
      }
    },
    async saveXiaoshou(data) {
      if (!this.hydrated) return null;
      this.saving = true;
      try {
        const res = await contractService.save({ type: 'xiaoshou', ...data });
        this.xiaoshou = { ...this.xiaoshou, ...data };
        return res.data;
      } finally {
        this.saving = false;
      }
    },
  },
});
