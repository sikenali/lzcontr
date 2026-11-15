import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/contract/yanfa' },
  {
    path: '/contract/yanfa',
    name: 'yanfa',
    component: () => import('../views/ContractYanfaView.vue'),
    meta: { tab: 'yanfa', title: '研发合同 · 条款填写' },
  },
  {
    path: '/contract/xiaoshou',
    name: 'xiaoshou',
    component: () => import('../views/ContractXiaoshouView.vue'),
    meta: { tab: 'xiaoshou', title: '销售合同 · 条款填写' },
  },
  {
    path: '/quotation/a',
    name: 'quotation-a',
    component: () => import('../views/QuotationLayoutA.vue'),
    meta: { tab: 'baojia', title: '报价单 · 填写（布局A）' },
  },
  {
    path: '/quotation/b',
    name: 'quotation-b',
    component: () => import('../views/QuotationLayoutB.vue'),
    meta: { tab: 'baojia', title: '报价单 · 填写（布局B）' },
  },
  {
    path: '/quotation/c',
    name: 'quotation-c',
    component: () => import('../views/QuotationLayoutC.vue'),
    meta: { tab: 'baojia', title: '报价单 · 填写（布局C）' },
  },
  {
    path: '/generate',
    name: 'generate',
    component: () => import('../views/GenerateView.vue'),
    meta: { tab: 'baojia', title: '报价单 · 生成文件' },
  },
  {
    path: '/generate/done',
    name: 'generate-done',
    component: () => import('../views/GenerateDoneView.vue'),
    meta: { tab: 'baojia', title: '报价单 · 生成完成' },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
