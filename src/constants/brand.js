// 品牌常量 (per DESIGN.md 附录A.1)
export const BRAND_NAME = 'LZContr';
export const BRAND_SHORT = 'LZContr';
export const BRAND_PRODUCT = '合同生成器';
export const BRAND_TITLE = '合同生成器';
export const BRAND_SLOGAN = '智能生成标书合同与报价文件';
export const BRAND_SERIES = '合同条款库';
export const BRAND_POWERED = 'Powered by LightOS';
export const BRAND_POWERED_URL = 'https://lazycat.cloud/';
export const BRAND_YEAR = 2026;

// 顶栏标签 (per DESIGN.md 2.3.5 六星标签结构，此处为合同/报价切换)
export const SUB_APP_LIST = [
  {
    name: 'yanfa',
    title: '研发合同',
    shortTitle: '研发合同',
    color: 'red',
    iconClass: 'ri-file-shield-2-line',
    route: '/contract/yanfa',
  },
  {
    name: 'xiaoshou',
    title: '销售合同',
    shortTitle: '销售合同',
    color: 'green',
    iconClass: 'ri-file-list-3-line',
    route: '/contract/xiaoshou',
  },
  {
    name: 'baojia',
    title: '报价单',
    shortTitle: '报价单',
    color: 'gold',
    iconClass: 'ri-price-tag-3-line',
    route: '/quotation/a',
  },
];
