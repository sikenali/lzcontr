# LZContr — 合同与报价单，一键生成 Word

<p align="center">
  <strong>研发/销售合同、报价单条款填写，自动保存，一键生成可下载 Word 文档 · 桌面应用 + 云应用</strong>
</p>

<p align="center">
  <img alt="Electron" src="https://img.shields.io/badge/Electron-45-47848F?logo=electron&logoColor=white">
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow">
</p>

## 软件介绍

LZContr 是一款合同与报价单生成工具。左侧条款/模块导航 + 右侧表单编辑，研发合同（甲方/乙方、里程碑）与销售合同（买方/卖方、产品明细）分型填写，报价单提供 3 种布局；内容**自动保存**到真实后端（Express + JSON 文件持久化，重启不丢），一键生成可下载的 `.docx` Word 文件并记录生成历史。基于 Vue 3 + Vite + Express 构建，覆盖 **Windows 便携 exe、macOS dmg（arm64+x64）、Linux AppImage/deb** 三条桌面交付路径，并支持 **LazyCat 云应用（lpk）**。

**核心功能**

| 功能 | 说明 |
|------|------|
| 研发合同 | 甲方/乙方、服务条款、里程碑（阶段/交付物/金额/比例）分型编辑 |
| 销售合同 | 买方/卖方、产品明细（名称/规格/数量/单价/金额）、条款编辑 |
| 报价单 | 3 种布局（A/B/C），项目/客户/联系人/有效期 + 明细行 + 备注 |
| 自动保存 | 表单变更防抖自动保存到后端，刷新后回显最新内容 |
| 条款导航 | 左侧条款/模块侧栏，快速切换与定位 |
| Word 生成 | 浏览器端 `docx` 库生成可下载 `.docx`，含条款/金额校验 |
| 生成记录 | 生成历史（文件名/版本/归档目录/校验和/大小/页数）留存后端 |
| 主题设置 | 深浅色主题、外观偏好本地持久化 |

## 技术实现

### 交付路径

1. **Windows 便携 exe**：`LZContr-<version>-win-x64.exe`（Electron portable 单文件，双击即用、免安装），约 108MB。
2. **macOS dmg**：`LZContr-<version>-mac-arm64.dmg` + `LZContr-<version>-mac-x64.dmg`（双架构，无 zip）。
3. **Linux AppImage + deb**：`LZContr-<version>-linux-x86_64.AppImage` + `LZContr-<version>-linux-amd64.deb`（x64，AppImage 约 135MB / deb 约 106MB）。
4. **LazyCat 云应用**：`cloud.lazycat.app.lzcontr-<version>.lpk`（约 3.3MB，运行时用容器内 Node 启动 Express 后端）。

### 为什么是 Electron

桌面壳主进程在启动时**内嵌拉起已有 Express 后端**（`startServer({port:0, prod:true})` 随机端口、生产模式托管 `dist/` + `/api`），再加载 `http://127.0.0.1:<port>`。前后端同源，开箱即用；数据写入 `app.getPath('userData')`（避免写只读 `app.asar`），配置经环境变量 `LZCONTR_DATA_DIR` 注入后端。

### 核心模块

| 模块 | 说明 |
|------|------|
| `src/views/` | Vue 3 页面：研发合同 / 销售合同 / 报价单 A·B·C / 生成 / 生成完成（7 个页面） |
| `src/services/` | REST 服务（contracts/quotations/generations）+ `documentService.js`（`docx` 生成 Word） |
| `src/stores/` | Pinia store：合同 / 报价单 / 生成 / 主题（自动保存、回显） |
| `server/index.js` | Express API：`/api/health`、`/api/contracts`、`/api/quotations`、`/api/generations`（服务端校验） |
| `server/db.js` | JSON 文件持久化（`server/data/db.json`，数据目录可配置 `LZCONTR_DATA_DIR`） |
| `electron/main.js` | Electron 主进程：内嵌后端 + `userData` 数据目录 + 外链系统浏览器 |
| `electron-builder.yml` | 三平台打包目标：win portable / mac dmg(arm64+x64) / linux AppImage+deb |
| `lzc/` | LazyCat 云应用打包（`build.sh` + `package.sh` → `.lpk`） |

### 构建

```bash
# 桌面应用（Electron）
npm run build                              # 前端 → dist/
npx electron-builder --win portable        # Windows 单文件 exe
npx electron-builder --mac dmg             # macOS dmg（arm64+x64）
npx electron-builder --linux AppImage deb  # Linux AppImage + deb
# 产物在 release/

# LazyCat 云应用（lpk）
cd lzc && bash package.sh                  # 产出 cloud.lazycat.app.lzcontr-<version>.lpk
```

### GitHub Actions

- `.github/workflows/build.yml`：push tag（如 `v1.0.0`）构建 **Windows/macOS/Linux** 三平台并创建 GitHub Release（`--publish onTagOrDraft`）；手动 `workflow_dispatch` 只构建上传 artifacts。

### 本地开发

```bash
npm run server     # 后端 :3002
npm run dev        # 前端 :5174（代理 /api → 3002）
npm run dev:full   # concurrently 一键起前后端
npm run build && npm run start   # 生产：单端口托管 dist + API
```

### 测试

```bash
# 需前端 :5174 与后端 :3002 运行中
node scratch/verify.mjs             # UI 交互 27 项
node scratch/verify_api.mjs         # API 全流程 7 项
node scratch/verify_srv.mjs         # 服务端校验 11 项
node scratch/verify_new.mjs         # 自动保存/下载 10 项
node scratch/verify_sidebar_preview.mjs  # 侧栏+预览 16 项
node scratch/verify_prelaunch.mjs   # 上线前扫描 20 项
# 合计 91 项
```

---

## 软件声明

### 重要声明

1. **仅限学习研究使用**
   本项目仅供合同/报价单模板管理与文档生成等自动化办公场景的技术实验使用，产出文档的内容与法律效力由使用者自行确认与承担。

2. **无官方隶属关系**
   本项目与 Microsoft、Word 及任何办公文档软件厂商不存在官方合作、授权或从属关系。文档导出在浏览器端由 `docx` 库完成，不依赖本机 Office 安装。

3. **知识产权与免责声明**
   合同/报价单内容版权归用户生成内容与第三方素材权利方所有。项目不保证服务的持续性、稳定性与适配性，对于使用本项目产生的一切直接、间接损失不承担任何责任。

## License

[MIT](./LICENSE)

<p align="center">Powered by LightOS</p>
