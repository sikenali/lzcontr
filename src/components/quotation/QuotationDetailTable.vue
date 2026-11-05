<template>
  <section class="ui-card detail-card">
    <div class="card-head">
      <div class="card-head-left">
        <span class="block-title">报价明细</span>
        <span class="card-tip">支持自定义列与行</span>
      </div>
      <button class="btn-ghost" @click="addRow">
        <RiAddLine size="14" />
        添加一行
      </button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="num-col">序号</th>
            <th>产品名称</th>
            <th v-if="showSpec">规格型号</th>
            <th>数量</th>
            <th>单价（元）</th>
            <th>金额（元）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td class="num-col seq">{{ String(i + 1).padStart(2, '0') }}</td>
            <td><input v-model="r.name" class="cell-input" placeholder="点击填写产品名称" /></td>
            <td v-if="showSpec"><input v-model="r.spec" class="cell-input" placeholder="—" /></td>
            <td><input v-model="r.qty" class="cell-input" style="width: 80px" placeholder="—" @input="recalc(r)" /></td>
            <td><input v-model="r.price" class="cell-input" style="width: 110px" placeholder="—" @input="recalc(r)" /></td>
            <td><span class="cell-total">{{ r.amount || '—' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span class="foot-hint">
        <RiInformationLine size="14" />
        金额自动按 数量 × 单价 计算，可手动覆盖
      </span>
      <div class="summary">
        <div class="sum-item">
          <span class="sum-label">小计</span>
          <span class="sum-val">{{ fmt(subtotal) }}</span>
        </div>
        <div class="sum-item">
          <span class="sum-label">税额 13%</span>
          <span class="sum-val">{{ fmt(tax) }}</span>
        </div>
        <div class="sum-item total">
          <span class="sum-label">含税总计</span>
          <span class="sum-val big">{{ fmt(total) }} 元</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RiAddLine, RiInformationLine } from '@remixicon/vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  showSpec: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue']);

// rows 直接引用父级数组，就地修改保持响应式
const rows = computed(() => props.modelValue);

function parseNum(s) {
  const m = String(s || '').match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
}
function recalc(r) {
  const qty = parseNum(r.qty);
  const price = parseNum(r.price);
  r.amount = qty && price ? (qty * price).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
  emit('update:modelValue', props.modelValue);
}

const subtotal = computed(() => props.modelValue.reduce((s, r) => s + parseNum(r.amount), 0));
const tax = computed(() => subtotal.value * 0.13);
const total = computed(() => subtotal.value + tax.value);
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function addRow() {
  const next = [...props.modelValue, { name: '', spec: '', qty: '', price: '', amount: '' }];
  emit('update:modelValue', next);
}
</script>

<style scoped>
.detail-card {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.table-wrap {
  overflow-x: auto;
}
.num-col {
  width: 56px;
  text-align: center;
}
.seq {
  color: var(--color-text-muted);
  text-align: center;
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
.cell-input::placeholder {
  color: var(--color-text-faint);
}
.cell-input:focus {
  outline: none;
  background: var(--color-bg-secondary);
}
.cell-total {
  color: var(--color-text-body);
}
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.foot-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}
.summary {
  display: flex;
  align-items: center;
  gap: 24px;
}
.sum-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.sum-label {
  font-size: 13px;
  color: var(--color-text-muted);
}
.sum-val {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-body);
}
.sum-item.total .sum-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}
.sum-val.big {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
