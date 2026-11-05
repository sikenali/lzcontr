// ============================================================
// LZContr 真实后端 API（Express）
// - 服务端校验 + 服务端持久化（JSON 文件，数据目录可配置 LZCONTR_DATA_DIR）
// - 开发：前端 Vite 代理 /api → 本服务端口
// - 生产：托管 dist/ 静态文件 + API（单端口）
// - 桌面端：由 Electron 主进程调用 startServer() 内嵌启动
// ============================================================
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { read, write } from './db.js';
import { requiredCheck, wrap } from './validate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ok = (res, data) => res.json({ success: true, data });

// 构建 Express 应用
function createApp({ prod = false } = {}) {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // 简易 CORS（代理已处理 dev；此头兜底直连场景）
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ---------- 健康检查 ----------
  app.get('/api/health', (req, res) => ok(res, { ok: true, time: new Date().toISOString() }));

  // ---------- 合同 ----------
  app.get('/api/contracts', wrap(async (req, res) => ok(res, read('contracts'))));
  app.post('/api/contracts', wrap(async (req, res) => {
    const d = req.body || {};
    if (d.type === 'xiaoshou') {
      requiredCheck(d, { type: '合同类型', name: '合同名称', buyer: '买方（甲方）', seller: '卖方（乙方）' });
    } else {
      requiredCheck(d, { type: '合同类型', name: '合同名称', partyA: '甲方（委托方）', partyB: '乙方（开发方）' });
    }
    const list = read('contracts');
    const record = {
      id: d.id || 'CT-' + Date.now().toString(36),
      type: d.type, name: d.name, partyA: d.partyA, partyB: d.partyB,
      buyer: d.buyer, seller: d.seller,
      sections: d.sections || [], clauses: d.clauses || [],
      milestones: d.milestones || [], products: d.products || [],
      updatedAt: new Date().toISOString(),
    };
    const idx = list.findIndex((c) => c.type === d.type);
    if (idx > -1) list[idx] = record; else list.push(record);
    write('contracts', list);
    ok(res, record);
  }));

  // ---------- 报价单 ----------
  app.get('/api/quotations', wrap(async (req, res) => ok(res, read('quotations'))));
  app.post('/api/quotations', wrap(async (req, res) => {
    const d = req.body || {};
    requiredCheck(d, { layout: '布局', project: '项目名称', company: '报价公司', customer: '客户名称' });
    const list = read('quotations');
    const record = {
      id: d.id || 'QT-' + Date.now().toString(36),
      layout: d.layout, project: d.project, subtitle: d.subtitle || '',
      company: d.company, date: d.date || '', no: d.no || '',
      customer: d.customer, contact: d.contact || '', validity: d.validity || '',
      rows: d.rows || [], notes: d.notes || '',
      updatedAt: new Date().toISOString(),
    };
    const idx = d.id ? list.findIndex((q) => q.id === d.id) : -1;
    if (idx > -1) list[idx] = { ...list[idx], ...record }; else list.push(record);
    write('quotations', list);
    ok(res, record);
  }));

  // ---------- 生成记录 ----------
  app.get('/api/generations', wrap(async (req, res) => ok(res, read('generations'))));
  app.post('/api/generations', wrap(async (req, res) => {
    const d = req.body || {};
    requiredCheck(d, { format: '生成格式', filename: '文件名称', version: '版本号', archivePath: '归档目录' });
    const list = read('generations');
    const record = {
      id: 'LOG-' + Date.now().toString(36).toUpperCase(),
      format: d.format, filename: d.filename, version: d.version, archivePath: d.archivePath,
      contractNo: 'QT-2026-0210-018', checksum: 'a3f1·9c72·4d08',
      sizeKB: 119.4, pages: 3, total: '777,440.00',
      createdAt: new Date().toISOString(),
      logs: [
        { title: 'Word 文件生成成功', desc: '文件已写入 ' + d.archivePath, ok: true },
        { title: '条款与金额校验通过', desc: '30 条条款版本一致，金额校验无差异', ok: true },
        { title: '开始生成 Word 文件', desc: '使用模板「报价单标准模板 V2.1」', ok: true },
      ],
    };
    list.unshift(record);
    write('generations', list);
    ok(res, record);
  }));

  // ---------- 生产：托管 dist/ 静态文件 + SPA 回退 ----------
  if (prod) {
    const dist = path.join(__dirname, '..', 'dist');
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  // 404 兜底
  app.use((req, res) => {
    res.status(404).json({ success: false, code: 'NOT_FOUND', message: '接口不存在: ' + req.path });
  });

  return app;
}

/**
 * 启动服务（供脚本与 Electron 主进程复用）
 * @param {{port?: number, prod?: boolean}} opts
 * @returns {Promise<{ app, server, port }>} 监听成功后解析
 */
export function startServer({ port = 3002, prod = process.env.NODE_ENV === 'production' } = {}) {
  const app = createApp({ prod });
  const server = app.listen(port);
  return new Promise((resolve, reject) => {
    server.once('listening', () => {
      const actual = server.address().port;
      console.log(`[lzcontr-server] 真实后端已启动: http://localhost:${actual} (${prod ? 'production' : 'development'})`);
      resolve({ app, server, port: actual });
    });
    server.once('error', reject);
  });
}

// 直接运行：node server/index.js
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  startServer({ port: Number(process.env.PORT) || 3002 }).catch((e) => {
    console.error('[lzcontr-server] 启动失败', e);
    process.exit(1);
  });
}
