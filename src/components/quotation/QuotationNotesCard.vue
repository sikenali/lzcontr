<template>
  <section class="ui-card notes-card">
    <div class="card-head">
      <span class="block-title">报价说明与条款</span>
      <button class="btn-ghost" @click="onQuote">
        <RiSparkling2Line size="14" />
        引用标准条款
      </button>
    </div>
    <textarea
      :value="modelValue"
      rows="3"
      class="notes-area"
      placeholder="继续输入报价说明…"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </section>
</template>

<script setup>
import { RiSparkling2Line } from '@remixicon/vue';
import { ElMessage } from '../../utils/toast';

defineProps({ modelValue: { type: String, default: '' } });
defineEmits(['update:modelValue']);

function onQuote() {
  ElMessage.success('已引用标准条款');
}
</script>

<style scoped>
.notes-card {
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
.notes-area {
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
.notes-area:focus {
  outline: none;
  background: var(--color-bg-white);
  border-color: var(--color-primary);
}
</style>
