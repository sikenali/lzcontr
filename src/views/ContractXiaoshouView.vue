<template>
  <div class="contract-view">
    <div class="page-head">
      <div>
        <div class="breadcrumb">
          <span>首页</span>
          <span class="sep">/</span>
          <span>销售合同</span>
          <span class="sep">/</span>
          <span class="current">条款填写</span>
        </div>
        <h1 class="page-title">销售合同 · 条款填写</h1>
        <p class="page-desc">填写买方卖方信息与产品明细，系统自动生成附带质保条款的销售合同</p>
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

      <div class="form-main">
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
                <label class="form-label">买方（甲方）<span class="req">*</span></label>
                <input v-model="form.buyer" class="ui-input" :class="{ 'has-error': errors.buyer }" placeholder="请输入买方名称" />
                <span v-if="errors.buyer" class="err-msg">{{ errors.buyer }}</span>
              </div>
              <div class="field">
                <label class="form-label">卖方（乙方）<span class="req">*</span></label>
                <input v-model="form.seller" class="ui-input" :class="{ 'has-error': errors.seller }" placeholder="请输入卖方名称" />
                <span v-if="errors.seller" class="err-msg">{{ errors.seller }}</span>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label class="form-label">签订日期</label>
                <input v-model="form.date" type="date" class="ui-input" />
              </div>
              <div class="field">
                <label class="form-label">交付地点</label>
                <input v-model="form.place" class="ui-input" placeholder="请输入交付地点" />
              </div>
              <div class="field">
                <label class="form-label">质保期</label>
                <div class="input-icon-wrap">
                  <input v-model="form.warranty" class="ui-input" placeholder="请输入质保期" />
                  <RiArrowDownSLine size="16" class="input-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ui-card form-card">
          <div class="card-head">
            <span class="block-title">产品明细</span>
            <button class="btn-ghost" @click="addProduct">
              <RiAddLine size="14" />
              添加一行
            </button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>产品名称</th>
                  <th>型号规格</th>
                  <th>数量</th>
                  <th>单价（元）</th>
                  <th>金额（元）</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in products" :key="i">
                  <td><input v-model="p.name" class="cell-input" /></td>
                  <td><input v-model="p.spec" class="cell-input" /></td>
                  <td><input v-model="p.qty" class="cell-input" style="width: 80px" /></td>
                  <td><input v-model="p.price" class="cell-input" /></td>
                  <td><span class="cell-total">{{ p.total }}</span></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">
                    合计（含税） <span class="foot-note">（{{ products.length }} 行明细）</span>
                  </td>
                  <td></td>
                  <td><span class="total-amount">480,000.00 元</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

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
      </div>
    </div>

    <div class="next-area">
      <button class="btn-primary next-btn" :disabled="store.saving" @click="onNext">
        {{ store.saving ? '保存中…' : '下一步' }}
        <RiArrowRightLine v-if="!store.saving" size="16" />
      </button>
      <p class="next-hint">
        <RiInformationLine size="14" />
        下一步将预览并导出完整的销售合同文稿
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  RiAddLine,
  RiCheckboxCircleLine,
  RiCalendarLine,
  RiArrowDownSLine,
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
  { name: '标的与规格', active: false, selected: true },
  { name: '价格与折扣', active: false, selected: false },
  { name: '交付与验收', active: false, selected: true },
  { name: '付款方式', active: false, selected: true },
  { name: '质保与售后', active: false, selected: false },
  { name: '争议解决', active: false, selected: false },
]);
const selectedCount = computed(() => sections.value.filter((s) => s.selected).length);

const form = reactive(store.xiaoshou);

const products = ref([
  { name: '机架式服务器', spec: 'R750 / 2U', qty: '6 台', price: '42,000', total: '252,000' },
  { name: '全闪存储阵列', spec: 'AF-8000', qty: '2 套', price: '96,000', total: '192,000' },
  { name: '实施与培训服务', spec: '标准实施包', qty: '1 项', price: '36,000', total: '36,000' },
]);

const clauses = ref([
  {
    title: '一、标的与规格',
    text: '乙方向甲方销售的产品名称、型号规格、数量与单价以本合同附件《产品明细表》为准，产品应符合国家相关强制性标准及厂商原厂技术规范。',
    placeholder: '请输入标的与规格条款…',
  },
  {
    title: '二、质保与售后',
    text: '自甲方验收合格之日起提供 24 个月免费质保；质保期内乙方应在接到通知后 4 小时内响应，48 小时内到场，7 个工作日内完成修复或更换。',
    placeholder: '请输入质保与售后条款…',
  },
]);

function addProduct() {
  products.value.push({ name: '', spec: '', qty: '', price: '', total: '' });
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
  if (!form.buyer.trim()) {
    errors.buyer = '买方不能为空';
    ok = false;
  }
  if (!form.seller.trim()) {
    errors.seller = '卖方不能为空';
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
    await store.saveXiaoshou({
      name: form.name,
      buyer: form.buyer,
      seller: form.seller,
      date: form.date,
      place: form.place,
      warranty: form.warranty,
      products: products.value,
      clauses: clauses.value,
    });
    ElMessage.success('销售合同已保存，正在跳转…');
    router.push('/quotation/a');
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
.cell-total {
  color: var(--color-text-body);
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
