// ============================================================
// JSON 文件持久化：server/data/db.json
// 真实后端数据库（原型用 JSON 文件，重启不丢，可读可改）
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 数据目录可配置（桌面端指向 userData，避免写入只读的 app.asar）。
// 惰性读取：Electron 主进程在 import 之后才设置 LZCONTR_DATA_DIR，
// 故不能模块加载时求值，须在每次读写时读取。
function getDataDir() {
  return process.env.LZCONTR_DATA_DIR || path.join(__dirname, 'data');
}
const getDbFile = () => path.join(getDataDir(), 'db.json');

// 示例数据：与前端默认值一致，保证 UI 首次有内容
const SEED = {
  contracts: [
    {
      id: 'CT-seed-yanfa',
      type: 'yanfa',
      name: '智能图生成平台研发服务合同',
      partyA: '杭州懒猫科技有限公司',
      partyB: '上海云枢信息技术有限公司',
      clauses: [
        {
          title: '一、项目说明',
          text: '甲方委托乙方开发「智能图生成平台」，包含图形解析引擎、VSDX 导出模块与条款知识库三部分，交付范围为合同附件一《功能清单》所列全部内容。',
        },
        {
          title: '二、知识产权归属',
          text: '本合同项下形成的全部技术成果（含源代码、设计文档、算法模型）知识产权归甲方所有；乙方享有在不泄露甲方商业信息前提下的通用技术复用权。',
        },
      ],
      milestones: [
        { stage: '需求确认', deliverable: '需求规格说明书', date: '2026-02-20', amount: '96,000', ratio: '20%' },
        { stage: '原型交付', deliverable: '可交互原型与设计稿', date: '2026-03-25', amount: '144,000', ratio: '30%' },
        { stage: '正式上线', deliverable: '生产环境系统与源码', date: '2026-06-30', amount: '192,000', ratio: '40%' },
        { stage: '质保金', deliverable: '验收满 12 个月支付', date: '2027-06-30', amount: '48,000', ratio: '10%' },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'CT-seed-xiaoshou',
      type: 'xiaoshou',
      name: '服务器设备采购及配套服务销售合同',
      buyer: '宁波智造装备制造有限公司',
      seller: '杭州懒猫云计算有限公司',
      products: [
        { name: '机架式服务器', spec: 'R750 / 2U', qty: '6 台', price: '42,000', total: '252,000' },
        { name: '全闪存储阵列', spec: 'AF-8000', qty: '2 套', price: '96,000', total: '192,000' },
        { name: '实施与培训服务', spec: '标准实施包', qty: '1 项', price: '36,000', total: '36,000' },
      ],
      clauses: [
        { title: '一、标的与规格', text: '乙方向甲方销售的产品名称、型号规格、数量与单价以本合同附件《产品明细表》为准。' },
        { title: '二、质保与售后', text: '自甲方验收合格之日起提供 24 个月免费质保。' },
      ],
      updatedAt: new Date().toISOString(),
    },
  ],
  quotations: [
    {
      id: 'QT-seed-a',
      layout: 'a',
      project: '数据中心机房改造项目报价单',
      subtitle: '机房基础设施升级与配套服务',
      company: '杭州懒猫云计算有限公司',
      date: '2026-02-10',
      no: 'Q2026-0210-007',
      customer: '宁波智造装备制造有限公司',
      contact: '王经理 · 138-0000-1234',
      validity: '自报价日起 30 天',
      rows: [
        { name: '精密空调（下送风）', spec: 'CR-35kW', qty: '4 台', price: '86,000', amount: '344,000' },
        { name: '模块化 UPS 系统', spec: 'UPS-200kVA', qty: '2 套', price: '138,000', amount: '276,000' },
        { name: '动环监控系统', spec: 'DCIM-2000', qty: '1 套', price: '68,000', amount: '68,000' },
      ],
      notes: '本报价含设备供货、安装调试与三年质保服务；不含土建改造与电力增容费用。',
      updatedAt: new Date().toISOString(),
    },
  ],
  generations: [],
};

// 读取整个 DB（不存在则用种子并落盘）
export function loadDb() {
  const DATA_DIR = getDataDir();
  const DB_FILE = getDbFile();
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    /* 损坏则重建 */
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(SEED, null, 2), 'utf8');
  return JSON.parse(JSON.stringify(SEED));
}

export function saveDb(db) {
  fs.mkdirSync(getDataDir(), { recursive: true });
  fs.writeFileSync(getDbFile(), JSON.stringify(db, null, 2), 'utf8');
}

// 读某个集合
export function read(key) {
  return loadDb()[key] || [];
}

// 写某个集合
export function write(key, arr) {
  const db = loadDb();
  db[key] = arr;
  saveDb(db);
  return arr;
}
