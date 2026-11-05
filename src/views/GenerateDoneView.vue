<template>
  <div class="done-view">
    <div class="page-head">
      <div>
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>报价单</span>
          <span class="sep">/</span>
          <span class="current">生成完成</span>
        </div>
        <h1 class="page-title">报价单 · 生成完成</h1>
        <p class="page-desc">Word 文件已生成并归档至合同库，可立即下载或在线预览合同信息</p>
      </div>
      <div class="head-badge">
        <RiCheckboxCircleLine size="14" />
        已完成 · 用时 9 秒
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-strip ui-card">
      <div v-for="(step, i) in steps" :key="i" class="step" :class="{ done: step.done }">
        <div class="step-node">
          <RiCheckLine v-if="step.done" size="14" />
          <span v-else>{{ step.num }}</span>
        </div>
        <div class="step-text">
          <div class="step-name">{{ step.name }}</div>
          <div class="step-desc">{{ step.desc }}</div>
        </div>
      </div>
      <button class="log-btn" @click="onLog">
        <RiFileListLine size="14" />
        生成记录
      </button>
    </div>

    <div class="done-body">
      <div class="done-main">
        <!-- 合同文件已生成 -->
        <section class="ui-card card file-card">
          <div class="file-head">
            <div class="success-icon">
              <RiCheckboxCircleLine size="30" />
            </div>
            <div>
              <div class="file-title">合同文件已生成</div>
              <div class="file-sub">报价单_宁波智造装备制造_20260210.docx · 119.4 KB · 共 3 页</div>
            </div>
          </div>
          <div class="file-meta">
            <div class="meta-item">
              <span class="meta-label">文件格式</span>
              <span class="meta-val fmt"><RiFile3Line size="15" /> Word 文档（.docx）</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">生成时间</span>
              <span class="meta-val">2026-02-10 14:26:08</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">引用模板</span>
              <span class="meta-val">报价单标准模板 V2.1</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">包含条款</span>
              <span class="meta-val">30 条（研发 12 / 销售 18）</span>
            </div>
          </div>
          <div class="total-line">
            <span class="total-label">含税总计（人民币）</span>
            <span class="total-val">¥777,440.00</span>
            <span class="checked-badge">
              <RiCheckboxCircleLine size="12" />
              已核对
            </span>
          </div>
          <div class="primary-actions">
            <button class="btn-primary dl-btn" @click="onDownload">
              <RiDownload2Line size="19" />
              下载 Word 文件
            </button>
            <button class="btn-ghost lg" @click="onPreview">
              <RiEyeLine size="18" />
              在线预览合同
            </button>
          </div>
          <div class="secondary-actions">
            <button class="ghost-btn" @click="onRegen"><RiRefreshLine size="15" /> 重新生成</button>
            <button class="ghost-btn" @click="onSend"><RiShareLine size="15" /> 发送给客户</button>
            <button class="ghost-btn" @click="onCopy"><RiLinkM size="15" /> 复制分享链接</button>
            <button class="ghost-btn back" @click="onBack"><RiArrowLeftLine size="15" /> 返回报价单</button>
          </div>
        </section>

        <!-- 本次生成记录 -->
        <section class="ui-card card">
          <div class="card-head">
            <span class="block-title">本次生成记录</span>
            <span class="log-no">日志编号 LOG-20260210-0042</span>
          </div>
          <div class="log-list">
            <div v-for="(log, i) in logs" :key="i" class="log-item">
              <span class="log-icon" :class="{ pending: log.pending }">
                <RiCheckLine v-if="!log.pending" size="13" />
                <span v-else class="spinner"></span>
              </span>
              <div class="log-info">
                <div class="log-top">
                  <span class="log-title">{{ log.title }}</span>
                  <span class="log-time">{{ log.time }}</span>
                </div>
                <div class="log-desc">{{ log.desc }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧 -->
      <aside class="done-side">
        <!-- 合同信息预览 -->
        <section class="ui-card card">
          <div class="card-head">
            <span class="block-title">合同信息预览</span>
            <div class="preview-tabs">
              <button class="pv-tab active"><RiFile3Line size="12" /> Word</button>
              <button class="pv-tab" @click="onFullscreen"><RiFullscreenLine size="14" /> 全屏</button>
            </div>
          </div>
          <div class="preview-doc">
            <div class="doc-head">
              <div class="doc-title">{{ q.form.project || '报价单' }}</div>
              <div class="doc-no">编号 {{ q.form.no || '—' }} · 第 1 页 / 共 {{ pvPages }} 页</div>
            </div>
            <div class="doc-kv">
              <div class="kv-row"><span class="kv-label">报价方</span><span class="kv-val">{{ q.form.company || '—' }}</span></div>
              <div class="kv-row"><span class="kv-label">客户方</span><span class="kv-val">{{ q.form.customer || '—' }}</span></div>
              <div class="kv-row"><span class="kv-label">项目</span><span class="kv-val">{{ q.form.project || '—' }}</span></div>
            </div>
            <div class="doc-table">
              <div class="dt-head"><span>产品 / 服务名称</span><span>金额（元）</span></div>
              <div v-for="(r, i) in pvRows" :key="i" class="dt-row">
                <span>{{ r.name || '—' }}</span><span>{{ fmtNum(r.amount) }}</span>
              </div>
              <div class="dt-row sum"><span>小计</span><span>{{ fmtNum(pvSubtotal) }}</span></div>
              <div class="dt-row"><span>税额 13%</span><span>{{ fmtNum(pvTax) }}</span></div>
              <div class="dt-row total"><span>含税总计</span><span>¥{{ fmtNum(pvTotal) }}</span></div>
            </div>
            <div class="doc-clause">
              <div class="clause-head">报价说明与条款</div>
              <div class="clause-item">{{ q.notes || '（暂无报价说明）' }}</div>
            </div>
            <div class="doc-footer">
              <span>LZContr · 合同条款库</span>
              <span>1 / {{ pvPages }}</span>
            </div>
          </div>
          <p class="preview-note">
            <RiInformationLine size="14" />
            预览为生成文件的实际排版效果，下载后可在 Word 中继续编辑或加盖电子章
          </p>
        </section>

        <!-- 归档与校验 -->
        <section class="ui-card card">
          <div class="card-head">
            <span class="block-title">归档与校验</span>
          </div>
          <div class="archive-list">
            <div class="ar-row"><span class="ar-label">归档路径</span><span class="ar-val">/ 合同库 / 报价单 / 2026</span></div>
            <div class="ar-row"><span class="ar-label">合同编号</span><span class="ar-val">QT-2026-0210-018</span></div>
            <div class="ar-row"><span class="ar-label">文件校验码</span><span class="ar-val">a3f1·9c72·4d08</span></div>
            <div class="ar-row">
              <span class="ar-label">归档状态</span>
              <span class="archive-badge">
                <RiCheckboxCircleLine size="12" />
                已归档
              </span>
            </div>
          </div>
          <div class="archive-actions">
            <button class="btn-secondary" @click="onCopyNo"><RiFileCopyLine size="15" /> 复制编号</button>
            <button class="btn-secondary" @click="onGoto"><RiFolder3Line size="15" /> 前往合同库</button>
          </div>
        </section>
      </aside>
    </div>

    <div class="bottom-tip">
      <RiFileShield2Line size="16" />
      文件已归档至合同库，合同编号 QT-2026-0210-018；如需调整内容请返回对应标签页修改后重新生成，历史版本保留可追溯
    </div>
  </div>

  <!-- 真实在线预览弹窗 -->
  <DocPreviewModal
    v-model:visible="previewVisible"
    v-model:fullscreen="previewFullscreen"
    @close="previewVisible = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  RiCheckLine,
  RiCheckboxCircleLine,
  RiFile3Line,
  RiDownload2Line,
  RiEyeLine,
  RiRefreshLine,
  RiShareLine,
  RiLinkM,
  RiArrowLeftLine,
  RiFileListLine,
  RiFullscreenLine,
  RiFileCopyLine,
  RiFolder3Line,
  RiInformationLine,
  RiFileShield2Line,
} from '@remixicon/vue';
import { ElMessage } from '../utils/toast';
import { useGenerationStore } from '../stores/generation';
import { useQuotationStore } from '../stores/quotation';
import DocPreviewModal from '../components/preview/DocPreviewModal.vue';

const router = useRouter();
const genStore = useGenerationStore();
const q = useQuotationStore();
const previewVisible = ref(false);
const previewFullscreen = ref(false);

// 内嵌预览：真实报价单数据
const pvRows = computed(() => (q.rows || []).filter((r) => r.name || r.spec || r.qty || r.price));
function parseNum(s) {
  const m = String(s || '').match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
}
const pvSubtotal = computed(() => pvRows.value.reduce((s, r) => s + parseNum(r.amount), 0));
const pvTax = computed(() => pvSubtotal.value * 0.13);
const pvTotal = computed(() => pvSubtotal.value + pvTax.value);
const pvPages = computed(() => Math.max(1, Math.ceil(pvRows.value.length / 3)));
const fmtNum = (n) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const steps = [
  { num: 1, name: '选择合同类型', desc: '3 个标签已确认', done: true },
  { num: 2, name: '填写抬头信息', desc: '双方信息已完整', done: true },
  { num: 3, name: '明细与条款', desc: '3 项明细 · 30 条条款', done: true },
  { num: 4, name: '生成文件', desc: 'Word 文件已就绪', done: true },
];

const logs = [
  {
    title: 'Word 文件生成成功',
    time: '14:26:08',
    desc: '文件已写入 / 合同库 / 报价单 / 2026，可通过编号 QT-2026-0210-018 检索',
    pending: false,
  },
  {
    title: '条款与金额校验通过',
    time: '14:26:05',
    desc: '30 条条款版本一致，明细金额与小计、税额合计校验无差异',
    pending: false,
  },
  {
    title: '开始生成 Word 文件',
    time: '14:26:02',
    desc: '触发人：王经理 · 使用模板「报价单标准模板 V2.1」',
    pending: false,
  },
];

function onDownload() {
  ElMessage.success('正在下载 Word 文件…');
  genStore.download().then((size) => {
    if (size > 0) ElMessage.success(`已下载 Word 文件（${(size / 1024).toFixed(1)} KB）`);
  });
}
function onPreview() {
  previewFullscreen.value = false;
  previewVisible.value = true;
}
function onRegen() {
  router.push('/generate');
}
function onSend() {
  ElMessage.success('已发送给客户');
}
function onCopy() {
  ElMessage.success('分享链接已复制');
}
function onBack() {
  router.push('/quotation/a');
}
function onLog() {
  ElMessage.info('生成记录：LOG-20260210-0042');
}
function onFullscreen() {
  previewFullscreen.value = true;
  previewVisible.value = true;
}
function onCopyNo() {
  ElMessage.success('合同编号已复制');
}
function onGoto() {
  ElMessage.info('正在前往合同库…');
}
</script>

<style scoped>
.done-view {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
.head-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-md);
  background: var(--color-success-soft);
  color: var(--color-success-strong);
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.progress-strip {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  gap: 8px;
}
.step {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.step-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.step.done .step-node {
  background: var(--color-success);
  color: #fff;
}
.step-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.step-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.log-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 0.7px solid var(--color-border);
  background: var(--color-bg-white);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
}
.log-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.done-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.done-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.done-side {
  width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* 文件卡 */
.file-head {
  display: flex;
  align-items: center;
  gap: 16px;
}
.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-success-soft);
  color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.file-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.file-sub {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.file-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  padding: 16px 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}
.meta-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.meta-label {
  font-size: 13px;
  color: var(--color-text-muted);
}
.meta-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-body);
}
.meta-val.fmt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-blue);
}
.total-line {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}
.total-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
.total-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}
.checked-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-primary-soft);
}
.primary-actions {
  display: flex;
  gap: 12px;
}
.dl-btn {
  flex: 1;
}
.btn-ghost.lg {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 15px;
  font-weight: 600;
  background: var(--color-bg-white);
  transition: background-color var(--t-base) var(--ease);
}
.btn-ghost.lg:hover {
  background: var(--color-primary-soft);
}
.secondary-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 6px 4px;
}
.ghost-btn:hover {
  color: var(--color-primary);
}
.ghost-btn.back {
  margin-left: auto;
  color: var(--color-text-muted);
}

/* 记录 */
.log-no {
  font-size: 12px;
  color: var(--color-text-faint);
}
.log-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.log-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 0.7px solid var(--color-border-soft);
}
.log-item:last-child {
  border-bottom: none;
}
.log-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-success);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.log-icon.pending {
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
}
.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-text-muted);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.log-info {
  flex: 1;
}
.log-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.log-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.log-time {
  font-size: 12px;
  color: var(--color-text-faint);
}
.log-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* 预览 */
.preview-tabs {
  display: flex;
  gap: 6px;
}
.pv-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}
.pv-tab.active {
  background: var(--color-info-soft);
  color: var(--color-info);
}
.pv-tab:hover {
  color: var(--color-primary);
}
.preview-doc {
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  background: var(--color-bg-white);
}
.doc-head {
  text-align: center;
  margin-bottom: 16px;
}
.doc-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.doc-no {
  font-size: 11px;
  color: var(--color-text-faint);
  margin-top: 4px;
}
.doc-kv {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.kv-row {
  display: flex;
  gap: 12px;
}
.kv-label {
  width: 64px;
  font-size: 11px;
  color: var(--color-text-faint);
}
.kv-val {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-body);
}
.doc-table {
  border: 0.7px solid var(--color-border-soft);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}
.dt-head,
.dt-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 11px;
  border-bottom: 0.7px solid var(--color-border-soft);
}
.dt-head {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-weight: 600;
}
.dt-row {
  color: var(--color-text-body);
}
.dt-row.sum {
  color: var(--color-text-secondary);
  font-weight: 500;
}
.dt-row.total {
  border-bottom: none;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 14px;
}
.dt-row.total span:first-child {
  color: var(--color-text-secondary);
  font-weight: 600;
}
.doc-clause {
  margin-bottom: 16px;
}
.clause-head {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.clause-item {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}
.doc-footer {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-border-hover);
}
.preview-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 归档 */
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ar-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}
.ar-label {
  color: var(--color-text-muted);
}
.ar-val {
  font-weight: 500;
  color: var(--color-text-body);
}
.archive-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-success-strong);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-success-soft);
}
.archive-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.bottom-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--color-success-soft);
  color: var(--color-success-strong);
  font-size: 13px;
}
</style>
