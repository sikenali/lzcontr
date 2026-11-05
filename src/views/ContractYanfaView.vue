<template>
  <div class="contract-view">
    <div class="page-head">
      <div>
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>研发合同</span>
          <span class="sep">/</span>
          <span class="current">条款填写</span>
        </div>
        <h1 class="page-title">研发合同 · 条款填写</h1>
        <p class="page-desc">填写基础信息与条款内容，系统会自动套用标准条款模板生成合同草稿</p>
      </div>
      <div class="head-right">
        <span class="count-badge">
          <RiCheckboxCircleLine size="16" />
          已选 {{ selectedCount }} 条条款，可随时增删
        </span>
      </div>
    </div>

    <div class="contract-body">
      <!-- 左侧：合同章节（可编辑/删除/新增） -->
      <ContractSectionsSidebar v-model="sections" />

      <!-- 右侧：表单 -->
      <div class="form-main">
        <!-- 合同基础信息 -->
        <section class="ui-card form-card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="block-title">合同基础信息</span>
              <span class="req-note"><span class="req">*</span> 为必填项</span>
            </div>
          </div>
          <div class="form-body">
            <div class="field">
              <label class="form-label">合同名称 <span class="req">*</span></label>
              <input v-model="form.name" class="ui-input" :class="{ 'has-error': errors.name }" placeholder="请输入合同名称" />
              <span v-if="errors.name" class="err-msg">{{ errors.name }}</span>
            </div>
            <div class="field-row cols-2">
              <div class="field">
                <label class="form-label">甲方（委托方）<span class="req">*</span></label>
                <input v-model="form.partyA" class="ui-input" :class="{ 'has-error': errors.partyA }" placeholder="请输入甲方名称" />
                <span v-if="errors.partyA" class="err-msg">{{ errors.partyA }}</span>
              </div>
              <div class="field">
                <label class="form-label">乙方（开发方）<span class="req">*</span></label>
                <input v-model="form.partyB" class="ui-input" :class="{ 'has-error': errors.partyB }" placeholder="请输入乙方名称" />
                <span v-if="errors.partyB" class="err-msg">{{ errors.partyB }}</span>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label class="form-label">签订日期</label>
                <input v-model="form.date" type="date" class="ui-input" />
              </div>
              <div class="field">
                <label class="form-label">合同金额（元）</label>
                <input v-model="form.amount" class="ui-input" placeholder="请输入金额" />
              </div>
              <div class="field">
                <label class="form-label">项目周期</label>
                <input v-model="form.period" class="ui-input" placeholder="请输入周期" />
              </div>
            </div>
          </div>
        </section>

        <!-- 条款内容 -->
        <section class="ui-card form-card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="block-title">条款内容</span>
              <span class="card-tip">可逐条修改措辞</span>
            </div>
            <button class="btn-ghost" @click="onAddClause">
              <RiSparkling2Line size="14" />
              引用标准模板
            </button>
          </div>
          <div class="clause-list">
            <div v-for="(clause, i) in clauses" :key="i" class="clause-item">
              <div class="clause-title">
                <span>{{ clause.title }}</span>
                <button class="clause-edit" title="编辑">
                  <RiEditLine size="14" />
                </button>
              </div>
              <div class="clause-text">
                <textarea
                  v-model="clause.text"
                  rows="2"
                  class="clause-area"
                  :placeholder="clause.placeholder"
                ></textarea>
              </div>
            </div>
          </div>
          <button class="add-clause-btn" @click="onAddClause">
            <RiAddLine size="16" />
            继续添加条款段落
          </button>
        </section>

        <!-- 里程碑与付款计划 -->
        <section class="ui-card form-card">
          <div class="card-head">
            <span class="block-title">里程碑与付款计划</span>
            <button class="btn-ghost" @click="addMilestone">
              <RiAddLine size="14" />
              添加一行
            </button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>阶段</th>
                  <th>交付物</th>
                  <th>完成时间</th>
                  <th>金额（元）</th>
                  <th>比例</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, i) in milestones" :key="i">
                  <td><input v-model="m.stage" class="cell-input" /></td>
                  <td><input v-model="m.deliverable" class="cell-input" /></td>
                  <td><input v-model="m.date" class="cell-input" /></td>
                  <td><input v-model="m.amount" class="cell-input num" /></td>
                  <td><span class="ratio">{{ m.ratio }}</span></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2">
                    合计 <span class="foot-note">（{{ milestones.length }} 个阶段）</span>
                  </td>
                  <td></td>
                  <td><span class="total-amount">480,000.00 元</span></td>
                  <td><span class="ratio">100%</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </div>

    <!-- 下一步 -->
    <div class="next-area">
      <button class="btn-primary next-btn" :disabled="store.saving" @click="onNext">
        {{ store.saving ? '保存中…' : '下一步' }}
        <RiArrowRightLine v-if="!store.saving" size="16" />
      </button>
      <p class="next-hint">
        <RiInformationLine size="14" />
        下一步将预览并导出完整的研发合同文稿
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  RiAddLine,
  RiCheckboxCircleLine,
  RiCalendarLine,
  RiEditLine,
  RiSparkling2Line,
  RiArrowRightLine,
  RiInformationLine,
} from '@remixicon/vue';
import { ElMessage } from '../utils/toast';
import { useContractStore } from '../stores/contract';
import ContractSectionsSidebar from '../components/contract/ContractSectionsSidebar.vue';

const router = useRouter();
const store = useContractStore();
const errors = reactive({});

const sections = ref([
  { name: '封面信息', active: true, selected: true },
  { name: '项目说明', active: false, selected: true },
  { name: '技术指标', active: false, selected: false },
  { name: '项目金额', active: false, selected: true },
  { name: '交付方式', active: false, selected: true },
  { name: '支付方式', active: false, selected: true },
  { name: '知识产权归属', active: false, selected: false },
]);

const form = reactive(store.yanfa);

const clauses = ref([
  {
    title: '一、项目说明',
    text: '甲方委托乙方开发「智能图生成平台」，包含图形解析引擎、VSDX 导出模块与条款知识库三部分，交付范围为合同附件一《功能清单》所列全部内容。',
    placeholder: '请输入项目说明…',
  },
  {
    title: '二、知识产权归属',
    text: '本合同项下形成的全部技术成果（含源代码、设计文档、算法模型）知识产权归甲方所有；乙方享有在不泄露甲方商业信息前提下的通用技术复用权。',
    placeholder: '请输入知识产权归属条款…',
  },
]);

const milestones = ref([
  { stage: '需求确认', deliverable: '需求规格说明书', date: '2026-02-20', amount: '96,000', ratio: '20%' },
  { stage: '原型交付', deliverable: '可交互原型与设计稿', date: '2026-03-25', amount: '144,000', ratio: '30%' },
  { stage: '正式上线', deliverable: '生产环境系统与源码', date: '2026-06-30', amount: '192,000', ratio: '40%' },
  { stage: '质保金', deliverable: '验收满 12 个月支付', date: '2027-06-30', amount: '48,000', ratio: '10%' },
]);

function addMilestone() {
  milestones.value.push({ stage: '', deliverable: '', date: '', amount: '', ratio: '' });
}
function onAddClause() {
  clauses.value.push({ title: '', text: '', placeholder: '请输入条款内容…' });
  ElMessage.success('已引用标准模板');
}
function validate() {
  let ok = true;
  if (!form.name.trim()) {
    errors.name = '合同名称不能为空';
    ok = false;
  }
  if (!form.partyA.trim()) {
    errors.partyA = '甲方不能为空';
    ok = false;
  }
  if (!form.partyB.trim()) {
    errors.partyB = '乙方不能为空';
    ok = false;
  }
  return ok;
}
async function onNext() {
  if (!validate()) {
    ElMessage.warning('请先完善必填项');
    return;
  }
  try {
    await store.saveYanfa({
      name: form.name,
      partyA: form.partyA,
      partyB: form.partyB,
      date: form.date,
      amount: form.amount,
      period: form.period,
      clauses: clauses.value,
      milestones: milestones.value,
    });
    ElMessage.success('研发合同已保存，正在跳转…');
    router.push('/contract/xiaoshou');
  } catch (e) {
    ElMessage.error(e.message || '保存失败，请重试');
  }
}
</script>

<style scoped>
.contract-view {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
.head-right {
  flex-shrink: 0;
}
.count-badge {
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
}

.contract-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.form-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.form-card {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.card-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.req-note {
  font-size: 13px;
  color: var(--color-text-muted);
}
.req {
  color: var(--color-error);
}
.field .has-error {
  border-color: var(--color-error);
}
.err-msg {
  font-size: 12px;
  color: var(--color-error);
}
.card-tip {
  font-size: 13px;
  color: var(--color-text-muted);
}
.btn-ghost {
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
  transition: border-color var(--t-base) var(--ease),
    color var(--t-base) var(--ease);
}
.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.clause-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.clause-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}
.clause-edit {
  color: var(--color-border-hover);
  display: flex;
  align-items: center;
  justify-content: center;
}
.clause-edit:hover {
  color: var(--color-primary);
}
.clause-area {
  width: 100%;
  padding: 12px 14px;
  border: 0.7px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-body);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: background-color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease);
}
.clause-area:focus {
  outline: none;
  background: var(--color-bg-white);
  border-color: var(--color-primary);
}
.add-clause-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
  transition: border-color var(--t-base) var(--ease),
    background-color var(--t-base) var(--ease);
}
.add-clause-btn:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.table-wrap {
  overflow-x: auto;
}
.cell-input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 14px;
  color: var(--color-text-body);
  padding: 6px 8px;
  border-radius: 6px;
}
.cell-input:focus {
  outline: none;
  background: var(--color-bg-secondary);
}
.cell-input.num {
  text-align: left;
}
.ratio {
  color: var(--color-text-muted);
}
.foot-note {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 400;
}
.total-amount {
  color: var(--color-primary);
  font-weight: 600;
}

.next-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0 16px;
}
.next-btn {
  min-width: 180px;
}
.next-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.next-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-faint);
}
</style>
