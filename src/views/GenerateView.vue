<template>
  <div class="gen-view">
    <div class="page-head">
      <div>
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>报价单</span>
          <span class="sep">/</span>
          <span class="current">生成文件 · 第 4 步</span>
        </div>
        <h1 class="page-title">报价单 · 生成文件</h1>
        <p class="page-desc">三个标签内容均已填写完成，确认生成格式后即可输出正式合同文件</p>
      </div>
      <div class="head-actions">
        <button class="btn-secondary" @click="onSaveDraft">
          <RiBookletLine size="16" />
          保存草稿
        </button>
        <button class="btn-secondary" @click="onBack">
          <RiArrowLeftLine size="16" />
          返回修改报价单
        </button>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-strip ui-card">
      <div v-for="(step, i) in steps" :key="i" class="step" :class="{ active: step.active }">
        <div class="step-node">
          <RiCheckLine v-if="step.done" size="14" />
          <span v-else>{{ step.num }}</span>
        </div>
        <div class="step-text">
          <div class="step-name">{{ step.name }}</div>
          <div class="step-desc">{{ step.desc }}</div>
        </div>
      </div>
    </div>

    <div class="gen-body">
      <div class="gen-main">
        <!-- 内容填写确认 -->
        <section class="ui-card card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="block-title">内容填写确认</span>
              <span class="card-tip">共 3 个标签 · 全部完成</span>
            </div>
            <span class="done-badge">
              <RiCheckboxCircleLine size="13" />
              全部已完成
            </span>
          </div>
          <div class="confirm-list">
            <div v-for="item in confirms" :key="item.title" class="confirm-item">
              <span class="confirm-icon" :class="item.color">
                <component :is="item.icon" size="18" />
              </span>
              <div class="confirm-info">
                <div class="confirm-title">{{ item.title }}</div>
                <div class="confirm-desc">{{ item.desc }}</div>
              </div>
              <span class="status-done">
                <RiCheckboxCircleLine size="12" />
                已完成
              </span>
              <button class="view-btn" @click="onView(item)">查看</button>
            </div>
          </div>
        </section>

        <!-- 生成格式 -->
        <section class="ui-card card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="block-title">生成格式</span>
              <span class="card-tip">格式默认为 Word，可切换为 PDF 或 Excel</span>
            </div>
            <span class="tip-badge">
              <RiTimeLine size="12" />
              首次生成推荐 Word
            </span>
          </div>
          <div class="format-grid">
            <button
              v-for="fmt in formats"
              :key="fmt.key"
              class="format-card"
              :class="{ active: selectedFormat === fmt.key }"
              @click="selectedFormat = fmt.key"
            >
              <component :is="fmt.icon" :size="26" class="fmt-icon" :class="fmt.color" />
              <div class="fmt-info">
                <div class="fmt-name">
                  {{ fmt.name }}
                  <span v-if="fmt.badge" class="fmt-badge">{{ fmt.badge }}</span>
                </div>
                <div class="fmt-desc">{{ fmt.desc }}</div>
              </div>
              <span class="radio-dot" :class="{ active: selectedFormat === fmt.key }">
                <span v-if="selectedFormat === fmt.key"></span>
              </span>
            </button>
          </div>
          <div class="format-opts">
            <label class="check-item">
              <span class="check-box" :class="{ on: opts.header }" @click="opts.header = !opts.header">
                <RiCheckLine v-if="opts.header" size="12" />
              </span>
              包含公司抬头与盖章位
            </label>
            <label class="check-item">
              <span class="check-box" :class="{ on: opts.pageNum }" @click="opts.pageNum = !opts.pageNum">
                <RiCheckLine v-if="opts.pageNum" size="12" />
              </span>
              添加页码与水印
            </label>
            <label class="check-item">
              <span class="check-box" :class="{ on: opts.email }" @click="opts.email = !opts.email">
                <RiCheckLine v-if="opts.email" size="12" />
              </span>
              生成后推送客户邮箱
            </label>
          </div>
        </section>

        <!-- 文件名与版本 -->
        <section class="ui-card card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="block-title">文件命名与版本</span>
            </div>
            <span class="tip-badge">
              <RiSparkling2Line size="12" />
              已按「合同类型_客户_日期」自动命名
            </span>
          </div>
          <div class="field">
            <label class="form-label">文件名称 <span class="req">*</span></label>
            <div class="filename-wrap">
              <input v-model="filename" class="ui-input" :class="{ 'has-error': errors.filename }" />
              <span class="ext-badge">{{ currentFormat.ext }}</span>
            </div>
            <span v-if="errors.filename" class="err-msg">{{ errors.filename }}</span>
          </div>
          <div class="file-row">
            <div class="field">
              <label class="form-label">版本号</label>
              <UiSelect v-model="version" :options="versionOptions" />
            </div>
            <div class="field">
              <label class="form-label">归档目录</label>
              <UiSelect v-model="archivePath" :options="archiveOptions" />
            </div>
          </div>
          <div class="meta-row">
            <div class="meta-item">
              <span class="meta-label">引用模板</span>
              <span class="meta-val">报价单标准模板 V2.1</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">预计页数</span>
              <span class="meta-val">3 页（含条款附录）</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">预计文件大小</span>
              <span class="meta-val">约 120 KB</span>
            </div>
          </div>
        </section>

        <div class="bottom-tip">
          <RiFileShield2Line size="16" />
          生成文件将引用「合同条款库」中已审核的条款版本，如需调整条款内容请先前往条款库更新后再生成
        </div>
      </div>

      <!-- 右侧摘要 -->
      <aside class="gen-side">
        <section class="ui-card card">
          <div class="card-head">
            <span class="block-title">生成摘要</span>
            <span class="gen-badge">待生成</span>
          </div>
          <div class="summary-list">
            <div class="sum-row">
              <span class="sum-label">合同类型</span>
              <span class="sum-val">报价单（含合同条款）</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">报价公司</span>
              <span class="sum-val">{{ q.form.company || '—' }}</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">客户名称</span>
              <span class="sum-val">{{ q.form.customer || '—' }}</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">项目名称</span>
              <span class="sum-val">{{ q.form.project || '—' }}</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">明细项</span>
              <span class="sum-val">{{ pvCount }} 项设备与服务</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">引用条款</span>
              <span class="sum-val">共 30 条（研发 12 / 销售 18）</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">生成格式</span>
              <span class="sum-val fmt" :style="{ color: currentFormat.colorHex }">
                <component :is="currentFormat.icon" size="15" />
                {{ currentFormat.name }}（{{ currentFormat.ext }}）
              </span>
            </div>
          </div>
          <div class="total-block">
            <span class="total-label">含税总计</span>
            <span class="total-val">¥{{ fmt(pvTotal) }}</span>
          </div>
        </section>

        <button class="btn-primary gen-btn" :disabled="generating" @click="onGenerate">
          <RiSparkling2Line v-if="!generating" size="18" />
          {{ generating ? '生成中…' : '生成合同文件' }}
        </button>
        <button class="btn-secondary back-edit-btn" @click="onBack">
          <RiArrowLeftLine size="16" />
          返回继续编辑
        </button>
        <p class="gen-note">
          <RiInformationLine size="14" />
          格式默认为 Word，生成完成后可立即下载或在线预览合同内容
        </p>

        <section class="ui-card card">
          <div class="card-head">
            <span class="block-title">生成须知</span>
          </div>
          <div class="notice-list">
            <div class="notice-item">
              <span class="notice-num">1</span>
              <span>生成后的合同内容不可直接编辑，如需修改请返回对应标签页调整</span>
            </div>
            <div class="notice-item">
              <span class="notice-num">2</span>
              <span>文件生成后自动归档至合同库，可在合同列表中按编号检索</span>
            </div>
            <div class="notice-item">
              <span class="notice-num">3</span>
              <span>单次生成预计耗时 5-10 秒，生成过程中请保持页面打开</span>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import UiSelect from '../components/ui/UiSelect.vue';
import { useQuotationStore } from '../stores/quotation';
import {
  RiCheckLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiBookletLine,
  RiArrowLeftLine,
  RiSparkling2Line,
  RiInformationLine,
  RiFileShield2Line,
  RiFile3Line,
  RiFileExcel2Line,
  RiFileTextLine,
  RiFileListLine,
  RiPriceTag3Line,
} from '@remixicon/vue';
import { ElMessage } from '../utils/toast';
import { useGenerationStore } from '../stores/generation';

const router = useRouter();
const errors = reactive({});
const generating = ref(false);
const genStore = useGenerationStore();
const q = useQuotationStore();

// 摘要：报价单真实数据
function parseNum(s) {
  const m = String(s || '').match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
}
const pvRows = computed(() => (q.rows || []).filter((r) => r.name || r.spec || r.qty || r.price));
const pvCount = computed(() => pvRows.value.length);
const pvSubtotal = computed(() => pvRows.value.reduce((s, r) => s + parseNum(r.amount), 0));
const pvTotal = computed(() => pvSubtotal.value * 1.13);
const fmt = (n) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const currentFormat = computed(() => formats.find((f) => f.key === selectedFormat.value) || formats[0]);

const versionOptions = [
  { value: 'V1.0', label: 'V1.0' },
  { value: 'V1.1', label: 'V1.1' },
  { value: 'V2.0', label: 'V2.0' },
  { value: 'V2.1', label: 'V2.1' },
];
const archiveOptions = [
  { value: '/ 合同库 / 报价单 / 2026', label: '/ 合同库 / 报价单 / 2026' },
  { value: '/ 合同库 / 报价单 / 2025', label: '/ 合同库 / 报价单 / 2025' },
  { value: '/ 合同库 / 合同 / 2026', label: '/ 合同库 / 合同 / 2026' },
];

const steps = [
  { num: 1, name: '选择合同类型', desc: '3 个标签已确认', done: true },
  { num: 2, name: '填写抬头信息', desc: '双方信息已完整', done: true },
  { num: 3, name: '明细与条款', desc: '3 项明细 · 30 条条款', done: true },
  { num: 4, name: '生成文件', desc: '选择格式并生成', done: false, active: true },
];

const confirms = computed(() => [
  {
    key: 'yanfa',
    title: '研发合同条款',
    desc: '12 条条款 · 引用模板「研发合作标准模板 T-01」',
    color: 'blue',
    icon: RiFileShield2Line,
  },
  {
    key: 'xiaoshou',
    title: '销售合同条款',
    desc: '18 条条款 · 含付款、交付与违约责任条款',
    color: 'green',
    icon: RiFileListLine,
  },
  {
    key: 'baojia',
    title: '报价单信息',
    desc: `${pvCount.value} 项明细 · 含税总计 ¥${fmt(pvTotal.value)} · 报价有效期 ${q.form.validity || '—'}`,
    color: 'red',
    icon: RiPriceTag3Line,
  },
]);

const formats = [
  { key: 'word', name: 'Word 文档', badge: '默认', ext: '.docx', desc: '.docx · 可在线编辑', icon: RiFile3Line, color: 'c-blue', colorHex: 'var(--brand-blue)' },
  { key: 'pdf', name: 'PDF 文档', ext: '.pdf', desc: '.pdf · 适合对外发送', icon: RiFileTextLine, color: 'c-red', colorHex: 'var(--brand-red)' },
  { key: 'excel', name: 'Excel 明细', ext: '.xlsx', desc: '.xlsx · 仅导出明细表', icon: RiFileExcel2Line, color: 'c-green', colorHex: 'var(--brand-green)' },
];
const selectedFormat = ref('word');
const opts = ref({ header: true, pageNum: true, email: false });
const filename = ref('报价单_宁波智造装备制造_20260210');
const version = ref('V1.0');
const archivePath = ref('/ 合同库 / 报价单 / 2026');

function onSaveDraft() {
  ElMessage.success('草稿已自动保存');
}
function onBack() {
  router.push('/quotation/c');
}
function onView(item) {
  const routeMap = { yanfa: '/contract/yanfa', xiaoshou: '/contract/xiaoshou', baojia: '/quotation/a' };
  router.push(routeMap[item.key] || '/quotation/a');
}
async function onGenerate() {
  if (!filename.value.trim()) {
    errors.filename = '文件名称不能为空';
    ElMessage.warning('请先填写文件名称');
    return;
  }
  generating.value = true;
  try {
    // 调用生成 store：API 记录 + 构建真实 Word 文档
    await genStore.generate(
      {
        format: selectedFormat.value,
        filename: filename.value,
        version: version.value,
        archivePath: archivePath.value,
        opts: { ...opts.value },
      },
      (pct, label) => {
        ElMessage.info(`生成中 ${pct}% · ${label}`);
      }
    );
    ElMessage.success('合同文件生成成功');
    router.push('/generate/done');
  } catch (e) {
    ElMessage.error(e.message || '生成失败，请重试');
  } finally {
    generating.value = false;
  }
}
</script>

<style scoped>
.gen-view {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
.head-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 进度条 */
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
.step.active .step-node {
  background: var(--color-primary);
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

.gen-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.gen-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.gen-side {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 96px;
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
.card-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-tip {
  font-size: 13px;
  color: var(--color-text-muted);
}
.done-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-success-soft);
  color: var(--color-success-strong);
  font-size: 12px;
  font-weight: 500;
}
.tip-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  font-size: 12px;
}

/* 确认列表 */
.confirm-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.confirm-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}
.confirm-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.confirm-icon.blue {
  background: var(--color-info-soft);
  color: var(--color-info);
}
.confirm-icon.green {
  background: var(--color-success-soft);
  color: var(--color-success);
}
.confirm-icon.red {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.confirm-info {
  flex: 1;
}
.confirm-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.confirm-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.status-done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-success-strong);
}
.view-btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  padding: 6px 12px;
  border-radius: 8px;
}
.view-btn:hover {
  background: var(--color-primary-soft);
}

/* 格式 */
.format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.format-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-white);
  text-align: left;
  position: relative;
  transition: border-color var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.format-card:hover {
  border-color: var(--color-border-hover);
}
.format-card.active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}
.fmt-icon {
  flex-shrink: 0;
}
.fmt-icon.c-blue {
  color: var(--brand-blue);
}
.fmt-icon.c-red {
  color: var(--brand-red);
}
.fmt-icon.c-green {
  color: var(--brand-green);
}
.fmt-info {
  flex: 1;
}
.fmt-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.fmt-badge {
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: var(--color-primary);
  padding: 1px 6px;
  border-radius: 4px;
}
.fmt-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.radio-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.radio-dot.active {
  border-color: var(--color-primary);
}
.radio-dot.active span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
}
.format-opts {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.check-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--color-bg-white);
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
}
.check-box.on {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

/* 文件名 */
.filename-wrap {
  position: relative;
}
.filename-wrap .ui-input {
  padding-right: 70px;
  font-weight: 500;
}
.ext-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 600;
  color: var(--brand-blue);
}
.file-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-faint);
  pointer-events: none;
}
.input-icon-wrap .ui-input {
  padding-right: 36px;
}
.meta-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 14px 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.meta-label {
  font-size: 12px;
  color: var(--color-text-muted);
}
.meta-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-body);
}

/* 底部提示 */
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

/* 侧栏 */
.gen-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-primary-soft);
}
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sum-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}
.sum-label {
  color: var(--color-text-muted);
}
.sum-val {
  color: var(--color-text-body);
  font-weight: 500;
  text-align: right;
}
.sum-val.fmt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-blue);
}
.total-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}
.total-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
.total-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}
.gen-btn {
  width: 100%;
  height: 52px;
}
.gen-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.filename-wrap .has-error {
  border-color: var(--color-error);
}
.err-msg {
  font-size: 12px;
  color: var(--color-error);
}
.back-edit-btn {
  width: 100%;
}
.gen-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-faint);
  padding: 0 4px;
}
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notice-item {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.notice-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
